// models/reporteModel.js
import { supabase } from '../config/supabase.js';

export const ReporteModel = {
  /**
   * Obtiene ingresos diarios agrupados por día (últimos N días)
   */
  async obtenerIngresosDiarios(dias = 7) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - dias);

    const { data, error } = await supabase
      .from('ventas_surtirsoft')
      .select('fecha_hora, total_cobrado, cantidad')
      .gte('fecha_hora', fechaLimite.toISOString())
      .order('fecha_hora', { ascending: true });

    if (error) {
      console.error('Error al obtener ingresos diarios:', error);
      return { labels: [], ingresos: [], volumen: [] };
    }

    // Agrupación por fecha (YYYY-MM-DD)
    const acumulado = {};
    data.forEach(v => {
      const fechaKey = new Date(v.fecha_hora).toLocaleDateString('es-BO', {
        day: '2-digit',
        month: 'short'
      });

      if (!acumulado[fechaKey]) {
        acumulado[fechaKey] = { ingresos: 0, volumen: 0 };
      }
      acumulado[fechaKey].ingresos += Number(v.total_cobrado || 0);
      acumulado[fechaKey].volumen += Number(v.cantidad || 0);
    });

    return {
      labels: Object.keys(acumulado),
      ingresos: Object.values(acumulado).map(item => item.ingresos),
      volumen: Object.values(acumulado).map(item => item.volumen)
    };
  },

  /**
   * Obtiene ingresos consolidados agrupados por mes para el año actual
   */
  async obtenerIngresosMensuales() {
    const anioActual = new Date().getFullYear();
    const inicioAnio = new Date(anioActual, 0, 1).toISOString();

    const { data, error } = await supabase
      .from('ventas_surtirsoft')
      .select('fecha_hora, total_cobrado')
      .gte('fecha_hora', inicioAnio)
      .order('fecha_hora', { ascending: true });

    if (error) {
      console.error('Error al obtener ingresos mensuales:', error);
      return { labels: [], values: [] };
    }

    const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const mesesAcumulados = new Array(12).fill(0);

    data.forEach(v => {
      const mesIndex = new Date(v.fecha_hora).getMonth();
      mesesAcumulados[mesIndex] += Number(v.total_cobrado || 0);
    });

    return {
      labels: mesesNombres,
      values: mesesAcumulados
    };
  },

  /**
   * Obtiene ventas agrupadas por combustible (Nombre y Volumen/Monto)
   */
  async obtenerVentasPorCombustible() {
    const { data, error } = await supabase
      .from('ventas_surtirsoft')
      .select(`
        cantidad,
        total_cobrado,
        combustibles_surtirsoft (
          codigo,
          nombre
        )
      `);

    if (error) {
      console.error('Error al obtener ventas por combustible:', error);
      return { labels: [], ingresos: [], volumen: [] };
    }

    const mapCombustibles = {};

    data.forEach(v => {
      const nombreComb = v.combustibles_surtirsoft?.nombre || 'Otros';
      if (!mapCombustibles[nombreComb]) {
        mapCombustibles[nombreComb] = { ingresos: 0, volumen: 0 };
      }
      mapCombustibles[nombreComb].ingresos += Number(v.total_cobrado || 0);
      mapCombustibles[nombreComb].volumen += Number(v.cantidad || 0);
    });

    return {
      labels: Object.keys(mapCombustibles),
      ingresos: Object.values(mapCombustibles).map(i => i.ingresos),
      volumen: Object.values(mapCombustibles).map(i => i.volumen)
    };
  },

  /**
   * Obtiene el resumen global para tarjetas/KPIs superiores
   */
  async obtenerResumenKPIs() {
    const { data, error } = await supabase
      .from('ventas_surtirsoft')
      .select('total_cobrado, cantidad');

    if (error) {
      console.error('Error al obtener KPIs globales:', error);
      return { totalRecaudado: 0, totalLitros: 0, totalTransacciones: 0, ticketPromedio: 0 };
    }

    const totalTransacciones = data.length;
    const totalRecaudado = data.reduce((acc, curr) => acc + Number(curr.total_cobrado || 0), 0);
    const totalLitros = data.reduce((acc, curr) => acc + Number(curr.cantidad || 0), 0);
    const ticketPromedio = totalTransacciones > 0 ? (totalRecaudado / totalTransacciones) : 0;

    return {
      totalRecaudado,
      totalLitros,
      totalTransacciones,
      ticketPromedio
    };
  }
};