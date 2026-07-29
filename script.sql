-- ==============================================================================
-- SISTEMA DE GESTIÓN INTEGRAL - ESTACIÓN DE SERVICIO COCHABAMBA
-- Modificado con sufijo _surtirsoft
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TIPOS ENUMERADOS (ENUMS)
CREATE TYPE rol_usuario_surtirsoft AS ENUM ('administrador', 'operador');
CREATE TYPE estado_surtidor_surtirsoft AS ENUM ('activo', 'mantenimiento', 'inactivo', 'bloqueado');
CREATE TYPE estado_alerta_surtirsoft AS ENUM ('activa', 'resuelta');
CREATE TYPE nivel_alerta_surtirsoft AS ENUM ('bajo', 'medio', 'critico');
CREATE TYPE metodo_pago_surtirsoft AS ENUM ('efectivo', 'qr', 'tarjeta');
CREATE TYPE estado_turno_surtirsoft AS ENUM ('abierto', 'cerrado');

-- 3. CONFIGURACIÓN GENERAL DE LA ESTACIÓN
CREATE TABLE configuracion_estacion_surtirsoft (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_estacion VARCHAR(100) NOT NULL DEFAULT 'Estación Cochabamba',
    ubicacion TEXT NOT NULL,
    telefono VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. USUARIOS
CREATE TABLE usuarios_surtirsoft (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_completo VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    rol rol_usuario_surtirsoft NOT NULL DEFAULT 'operador',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    ultimo_acceso TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. COMBUSTIBLES Y PRECIOS
CREATE TABLE combustibles_surtirsoft (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(10) UNIQUE NOT NULL, 
    nombre VARCHAR(50) NOT NULL,        
    unidad_medida VARCHAR(10) NOT NULL DEFAULT 'L', 
    precio_unidad DECIMAL(10, 2) NOT NULL CHECK (precio_unidad >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TANQUES Y ESTADO BINARIO SCADA
CREATE TABLE tanques_surtirsoft (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    combustible_id UUID NOT NULL REFERENCES combustibles_surtirsoft(id) ON DELETE RESTRICT,
    nombre VARCHAR(50) NOT NULL,
    capacidad_total DECIMAL(12, 2) NOT NULL CHECK (capacidad_total > 0),
    nivel_actual DECIMAL(12, 2) NOT NULL CHECK (nivel_actual >= 0),
    codigo_binario_scada VARCHAR(2) NOT NULL DEFAULT '11',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT chk_nivel_maximo CHECK (nivel_actual <= capacidad_total)
);

-- 7. SURTIDORES
CREATE TABLE surtidores_surtirsoft (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tanque_id UUID NOT NULL REFERENCES tanques_surtirsoft(id) ON DELETE RESTRICT,
    nombre VARCHAR(50) NOT NULL,
    estado estado_surtidor_surtirsoft NOT NULL DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. CONTROL DE TURNOS DE OPERADORES
CREATE TABLE turnos_operador_surtirsoft (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios_surtirsoft(id) ON DELETE RESTRICT,
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_fin TIMESTAMP WITH TIME ZONE,
    estado estado_turno_surtirsoft NOT NULL DEFAULT 'abierto',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. RECARGAS DE TANQUES
CREATE TABLE recargas_tanque_surtirsoft (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tanque_id UUID NOT NULL REFERENCES tanques_surtirsoft(id) ON DELETE RESTRICT,
    usuario_id UUID NOT NULL REFERENCES usuarios_surtirsoft(id) ON DELETE RESTRICT,
    litros_cargados DECIMAL(12, 2) NOT NULL CHECK (litros_cargados > 0),
    proveedor VARCHAR(100) NOT NULL,
    fecha_recarga TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. VENTAS
CREATE TABLE ventas_surtirsoft (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    surtidor_id UUID NOT NULL REFERENCES surtidores_surtirsoft(id) ON DELETE RESTRICT,
    combustible_id UUID NOT NULL REFERENCES combustibles_surtirsoft(id) ON DELETE RESTRICT,
    usuario_id UUID NOT NULL REFERENCES usuarios_surtirsoft(id) ON DELETE RESTRICT,
    turno_id UUID REFERENCES turnos_operador_surtirsoft(id) ON DELETE SET NULL,
    placa_vehiculo VARCHAR(15) NOT NULL,
    nombre_cliente VARCHAR(100) DEFAULT 'Sin Nombre / Cliente Varios',
    cantidad DECIMAL(10, 2) NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10, 2) NOT NULL CHECK (precio_unitario >= 0),
    total_cobrado DECIMAL(10, 2) NOT NULL CHECK (total_cobrado >= 0),
    metodo_pago metodo_pago_surtirsoft NOT NULL DEFAULT 'efectivo',
    fecha_hora TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. GESTIÓN DE ALERTAS SCADA Y MANTENIMIENTO
CREATE TABLE alertas_surtirsoft (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    origen_tipo VARCHAR(20) NOT NULL,
    surtidor_id UUID REFERENCES surtidores_surtirsoft(id) ON DELETE SET NULL,
    tanque_id UUID REFERENCES tanques_surtirsoft(id) ON DELETE SET NULL,
    nivel nivel_alerta_surtirsoft NOT NULL DEFAULT 'medio',
    descripcion TEXT NOT NULL,
    estado estado_alerta_surtirsoft NOT NULL DEFAULT 'activa',
    resuelto_por UUID REFERENCES usuarios_surtirsoft(id) ON DELETE SET NULL,
    fecha_resuelto TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- AUTOMATIZACIÓN Y TRIGGERS SCADA
-- ==============================================================================

-- A. Función Venta y SCADA
CREATE OR REPLACE FUNCTION procesar_venta_y_actualizar_scada_surtirsoft()
RETURNS TRIGGER AS $$
DECLARE
    v_tanque_id UUID;
    v_capacidad DECIMAL(12,2);
    v_nuevo_nivel DECIMAL(12,2);
    v_porcentaje DECIMAL(5,2);
    v_codigo_scada VARCHAR(2);
BEGIN
    SELECT tanque_id INTO v_tanque_id FROM surtidores_surtirsoft WHERE id = NEW.surtidor_id;

    UPDATE tanques_surtirsoft 
    SET nivel_actual = nivel_actual - NEW.cantidad,
        updated_at = NOW()
    WHERE id = v_tanque_id
    RETURNING capacidad_total, nivel_actual INTO v_capacidad, v_nuevo_nivel;

    v_porcentaje := (v_nuevo_nivel / v_capacidad) * 100;

    IF v_porcentaje <= 5 THEN
        v_codigo_scada := '00';
    ELSIF v_porcentaje < 25 THEN
        v_codigo_scada := '01';
    ELSIF v_porcentaje <= 75 THEN
        v_codigo_scada := '10';
    ELSE
        v_codigo_scada := '11';
    END IF;

    UPDATE tanques_surtirsoft SET codigo_binario_scada = v_codigo_scada WHERE id = v_tanque_id;

    IF v_porcentaje < 25 THEN
        INSERT INTO alertas_surtirsoft (origen_tipo, tanque_id, nivel, descripcion)
        VALUES ('tanque', v_tanque_id, 'critico', 'Alerta de reabastecimiento: Tanque por debajo del 25% de su capacidad.');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_procesar_venta_surtirsoft
AFTER INSERT ON ventas_surtirsoft
FOR EACH ROW EXECUTE FUNCTION procesar_venta_y_actualizar_scada_surtirsoft();

-- B. Función Recarga y SCADA
CREATE OR REPLACE FUNCTION procesar_recarga_tanque_surtirsoft()
RETURNS TRIGGER AS $$
DECLARE
    v_capacidad DECIMAL(12,2);
    v_nuevo_nivel DECIMAL(12,2);
    v_porcentaje DECIMAL(5,2);
    v_codigo_scada VARCHAR(2);
BEGIN
    UPDATE tanques_surtirsoft 
    SET nivel_actual = nivel_actual + NEW.litros_cargados,
        updated_at = NOW()
    WHERE id = NEW.tanque_id
    RETURNING capacidad_total, nivel_actual INTO v_capacidad, v_nuevo_nivel;

    v_porcentaje := (v_nuevo_nivel / v_capacidad) * 100;

    IF v_porcentaje <= 5 THEN v_codigo_scada := '00';
    ELSIF v_porcentaje < 25 THEN v_codigo_scada := '01';
    ELSIF v_porcentaje <= 75 THEN v_codigo_scada := '10';
    ELSE v_codigo_scada := '11';
    END IF;

    UPDATE tanques_surtirsoft SET codigo_binario_scada = v_codigo_scada WHERE id = NEW.tanque_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_procesar_recarga_surtirsoft
AFTER INSERT ON recargas_tanque_surtirsoft
FOR EACH ROW EXECUTE FUNCTION procesar_recarga_tanque_surtirsoft();

INSERT INTO configuracion_estacion_surtirsoft (nombre_estacion, ubicacion, telefono) 
VALUES ('Estación de Servicio Cochabamba', 'Av. Blanco Galindo Km 6, Cochabamba', '+591 4 4500000');


INSERT INTO usuarios_surtirsoft (nombre_completo, email, password_hash, rol) 
VALUES 
('Admin General', 'admin@estacion.bo', 'hash_password_aqui', 'administrador'),
('Juan Pérez', 'juan.perez@estacion.bo', 'hash_password_aqui', 'operador');


INSERT INTO combustibles_surtirsoft (codigo, nombre, unidad_medida, precio_unidad) VALUES
('GE', 'Gasolina Especial', 'L', 3.74),
('GP', 'Gasolina Premium', 'L', 4.79),
('DO', 'Diésel Oil', 'L', 3.72),
('GNB', 'Gas Natural Vehicular', 'm3', 1.66);

-- Primero obtienes el ID de la 'Gasolina Especial'
INSERT INTO tanques_surtirsoft (combustible_id, nombre, capacidad_total, nivel_actual)
VALUES 
((SELECT id FROM combustibles_surtirsoft WHERE codigo = 'GE'), 'Tanque GE 01', 20000.00, 15000.00),
((SELECT id FROM combustibles_surtirsoft WHERE codigo = 'DO'), 'Tanque Diésel 01', 30000.00, 25000.00);



INSERT INTO surtidores_surtirsoft (tanque_id, nombre, estado)
VALUES 
((SELECT id FROM tanques_surtirsoft WHERE nombre = 'Tanque GE 01'), 'Surtidor 01 (GE)', 'activo'),
((SELECT id FROM tanques_surtirsoft WHERE nombre = 'Tanque Diésel 01'), 'Surtidor 02 (DO)', 'activo');


INSERT INTO turnos_operador_surtirsoft (usuario_id, estado)
VALUES 
((SELECT id FROM usuarios_surtirsoft WHERE email = 'juan.perez@estacion.bo'), 'abierto');



INSERT INTO recargas_tanque_surtirsoft (tanque_id, usuario_id, litros_cargados, proveedor)
VALUES (
    (SELECT id FROM tanques_surtirsoft WHERE nombre = 'Tanque GE 01'),
    (SELECT id FROM usuarios_surtirsoft WHERE email = 'admin@estacion.bo'),
    3000.00,
    'YPFB Logística'
);


INSERT INTO ventas_surtirsoft (surtidor_id, combustible_id, usuario_id, turno_id, placa_vehiculo, nombre_cliente, cantidad, precio_unitario, total_cobrado, metodo_pago)
VALUES (
    (SELECT id FROM surtidores_surtirsoft WHERE nombre = 'Surtidor 01 (GE)'),
    (SELECT id FROM combustibles_surtirsoft WHERE codigo = 'GE'),
    (SELECT id FROM usuarios_surtirsoft WHERE email = 'juan.perez@estacion.bo'),
    (SELECT id FROM turnos_operador_surtirsoft WHERE usuario_id = (SELECT id FROM usuarios_surtirsoft WHERE email = 'juan.perez@estacion.bo') AND estado = 'abierto' LIMIT 1),
    '2345-ABC',
    'Carlos Mamani',
    50.00,
    3.74,
    187.00,
    'efectivo'
);



-- Las alertas críticas de tanques se generan solas mediante el Trigger de Ventas,
-- pero puedes registrar alertas de mantenimiento manualmente:
INSERT INTO alertas_surtirsoft (origen_tipo, surtidor_id, nivel, descripcion)
VALUES (
    'surtidor',
    (SELECT id FROM surtidores_surtirsoft WHERE nombre = 'Surtidor 01 (GE)'),
    'bajo',
    'Manguera presenta desgaste menor.'
);

SELECT 
    t.nombre AS tanque,
    c.nombre AS combustible,
    t.nivel_actual,
    t.capacidad_total,
    ROUND((t.nivel_actual / t.capacidad_total) * 100, 2) AS porcentaje_disponible,
    t.codigo_binario_scada,
    CASE t.codigo_binario_scada
        WHEN '00' THEN 'CRÍTICO: Vacío (<=5%)'
        WHEN '01' THEN 'ALERTA: Bajo (<25%)'
        WHEN '10' THEN 'NORMAL: Medio (25%-75%)'
        WHEN '11' THEN 'ÓPTIMO: Lleno (>75%)'
    END AS interpretacion_scada
FROM tanques_surtirsoft t
JOIN combustibles_surtirsoft c ON t.combustible_id = c.id
ORDER BY porcentaje_disponible ASC;

-- Agregar columnas nit y direccion si no existen
ALTER TABLE configuracion_estacion_surtirsoft 
ADD COLUMN IF NOT EXISTS nit VARCHAR(30) DEFAULT '1234567890',
ADD COLUMN IF NOT EXISTS direccion TEXT DEFAULT 'Av. Blanco Galindo Km 6, Cochabamba';

CREATE TABLE IF NOT EXISTS visitas_sistema_surtirsoft (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_origen VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE visitas_sistema_surtirsoft ENABLE ROW LEVEL SECURITY;

-- Permitir que cualquier usuario (incluso no autenticado) registre su visita
CREATE POLICY "Permitir insercion publica de visitas" 
ON visitas_sistema_surtirsoft 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Permitir la lectura publica del conteo
CREATE POLICY "Permitir lectura publica de visitas" 
ON visitas_sistema_surtirsoft 
FOR SELECT 
TO anon, authenticated 
USING (true);

ALTER TABLE public.visitas_sistema_surtirsoft OWNER TO postgres;