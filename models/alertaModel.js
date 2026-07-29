// models/alertaModel.js
import { supabase } from '../config/supabase.js';

export const AlertaModel = {

/**
   * Obtiene la cantidad total de alertas activas.
   */
  async contarActivas() {
    const { count, error } = await supabase
      .from('alertas_surtirsoft')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'activa');

    if (error) {
      console.error('Error al contar alertas activas:', error);
      return 0;
    }
    return count || 0;
  },


  /**
   * Obtiene alertas activas junto con los nombres de tanques o surtidores asociados.
   */
  async obtenerActivas() {
    const { data, error } = await supabase
      .from('alertas_surtirsoft')
      .select(`
        id,
        origen_tipo,
        nivel,
        descripcion,
        estado,
        created_at,
        surtidores_surtirsoft ( nombre ),
        tanques_surtirsoft ( nombre )
      `)
      .eq('estado', 'activa')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener alertas activas:', error);
      return [];
    }
    return data;
  },

  /**
   * Obtiene el historial de alertas resueltas con información de quién las resolvió.
   */
  async obtenerHistorial() {
    const { data, error } = await supabase
      .from('alertas_surtirsoft')
      .select(`
        id,
        origen_tipo,
        nivel,
        descripcion,
        estado,
        created_at,
        fecha_resuelto,
        surtidores_surtirsoft ( nombre ),
        tanques_surtirsoft ( nombre ),
        usuarios_surtirsoft:resuelto_por ( nombre_completo )
      `)
      .eq('estado', 'resuelta')
      .order('fecha_resuelto', { ascending: false });

    if (error) {
      console.error('Error al obtener historial de alertas:', error);
      return [];
    }
    return data;
  },

  /**
   * Marca una alerta como resuelta.
   */
  async resolver(alertaId, usuarioId) {
    const { data, error } = await supabase
      .from('alertas_surtirsoft')
      .update({
        estado: 'resuelta',
        resuelto_por: usuarioId,
        fecha_resuelto: new Date().toISOString()
      })
      .eq('id', alertaId)
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Marca TODAS las alertas activas como resueltas.
   */
  async resolverTodas(usuarioId) {
    const { data, error } = await supabase
      .from('alertas_surtirsoft')
      .update({
        estado: 'resuelta',
        resuelto_por: usuarioId,
        fecha_resuelto: new Date().toISOString()
      })
      .eq('estado', 'activa')
      .select();

    if (error) throw error;
    return data;
  }
};