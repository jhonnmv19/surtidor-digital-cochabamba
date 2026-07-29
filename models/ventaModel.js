// models/ventaModel.js
import { supabase } from '../config/supabase.js';

export const VentaModel = {
  // Obtener surtidores activos con su tipo de combustible y precio
  async obtenerSurtidoresYCombustibles() {
    const { data, error } = await supabase
      .from('surtidores_surtirsoft')
      .select(`
        id,
        nombre,
        tanque_id,
        tanques_surtirsoft (
          id,
          combustible_id,
          combustibles_surtirsoft (
            id,
            codigo,
            nombre,
            unidad_medida,
            precio_unidad
          )
        )
      `)
      .eq('estado', 'activo');

    if (error) throw error;
    return data;
  },

  // Obtener el turno actualmente abierto
  async obtenerTurnoActivo() {
    const { data, error } = await supabase
      .from('turnos_operador_surtirsoft')
      .select('id, usuario_id, fecha_inicio')
      .eq('estado', 'abierto')
      .order('fecha_inicio', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // Obtener resumen del turno
  async obtenerResumenTurno(turnoId) {
    if (!turnoId) return { totalVentas: 0, totalIngresos: 0, totalCantidad: 0 };

    const { data, error } = await supabase
      .from('ventas_surtirsoft')
      .select('total_cobrado, cantidad')
      .eq('turno_id', turnoId);

    if (error) throw error;

    const totalVentas = data.length;
    const totalIngresos = data.reduce((acc, curr) => acc + Number(curr.total_cobrado || 0), 0);
    const totalCantidad = data.reduce((acc, curr) => acc + Number(curr.cantidad || 0), 0);

    return { totalVentas, totalIngresos, totalCantidad };
  },

  // Obtener las últimas ventas del turno actual
  async obtenerUltimasVentasPorTurno(turnoId, limite = 5) {
    if (!turnoId) return [];

    const { data, error } = await supabase
      .from('ventas_surtirsoft')
      .select(`
        id,
        placa_vehiculo,
        cantidad,
        total_cobrado,
        metodo_pago,
        fecha_hora,
        combustibles_surtirsoft (
          codigo,
          unidad_medida
        )
      `)
      .eq('turno_id', turnoId)
      .order('fecha_hora', { ascending: false })
      .limit(limite);

    if (error) throw error;
    return data;
  },

  // Obtener todo el historial de ventas ordenado por fecha descendente
  async obtenerHistorialVentas(limite = 100) {
    const { data, error } = await supabase
      .from('ventas_surtirsoft')
      .select(`
        id,
        placa_vehiculo,
        nombre_cliente,
        cantidad,
        precio_unitario,
        total_cobrado,
        metodo_pago,
        fecha_hora,
        surtidores_surtirsoft ( nombre ),
        combustibles_surtirsoft ( codigo, unidad_medida )
      `)
      .order('fecha_hora', { ascending: false })
      .limit(limite);

    if (error) throw error;
    return data;
  },

  // Registrar una nueva venta
  async registrarVenta(datosVenta) {
    const { data, error } = await supabase
      .from('ventas_surtirsoft')
      .insert([datosVenta])
      .select();

    if (error) throw error;
    return data[0];
  },
  async obtenerKpisHoy() {
  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('ventas_surtirsoft')
    .select('total_cobrado, cantidad')
    .gte('fecha_hora', inicioHoy.toISOString());

  if (error) {
    console.error('Error al obtener KPIs:', error);
    return { totalVentas: 0, totalIngresos: 0, totalLitros: 0 };
  }

  const totalVentas = data.length;
  const totalIngresos = data.reduce((acc, curr) => acc + Number(curr.total_cobrado || 0), 0);
  const totalLitros = data.reduce((acc, curr) => acc + Number(curr.cantidad || 0), 0);

  return { totalVentas, totalIngresos, totalLitros };
},

// Obtener ventas agrupadas por hora para el gráfico de línea
async obtenerVentasPorHoraHoy() {
  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('ventas_surtirsoft')
    .select('fecha_hora, total_cobrado')
    .gte('fecha_hora', inicioHoy.toISOString())
    .order('fecha_hora', { ascending: true });

  if (error) throw error;

  // Agrupar ventas por intervalos de horas
  const horasMap = {};
  data.forEach(v => {
    const hora = new Date(v.fecha_hora).getHours() + ':00';
    horasMap[hora] = (horasMap[hora] || 0) + Number(v.total_cobrado || 0);
  });

  return {
    labels: Object.keys(horasMap),
    values: Object.values(horasMap)
  };
}
};