-- Habilitar extensión para UUIDs automáticos
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla: tipos_combustible
CREATE TABLE tipos_combustible (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_binario VARCHAR(2) NOT NULL CHECK (codigo_binario IN ('00', '01', '10')),
    nombre TEXT NOT NULL,
    precio_litro NUMERIC(10, 2) NOT NULL
);

-- 2. Tabla: surtidores
CREATE TABLE surtidores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_surtidor INTEGER NOT NULL UNIQUE,
    combustible_id UUID REFERENCES tipos_combustible(id) ON DELETE RESTRICT,
    capacidad_litros NUMERIC(10, 2) NOT NULL,
    nivel_binario VARCHAR(2) NOT NULL CHECK (nivel_binario IN ('00', '01', '10', '11')),
    estado BOOLEAN DEFAULT true
);

-- 3. Tabla: ventas
CREATE TABLE ventas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    surtidor_id UUID REFERENCES surtidores(id) ON DELETE CASCADE,
    litros NUMERIC(10, 2) NOT NULL,
    precio_unitario NUMERIC(10, 2) NOT NULL,
    total_bs NUMERIC(10, 2) NOT NULL
);

-- 4. Tabla: alertas_log
CREATE TABLE alertas_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    surtidor_id UUID REFERENCES surtidores(id) ON DELETE CASCADE,
    tipo_alerta TEXT CHECK (tipo_alerta IN ('BAJO', 'CRITICO')),
    estado_led TEXT CHECK (estado_led IN ('AMARILLO', 'ROJO')),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);