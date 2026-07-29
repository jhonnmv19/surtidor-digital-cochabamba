// models/tanqueModel.js
import { supabase } from '../config/supabase.js';

export const TanqueModel = {
  /**
   * Obtiene todos los tanques junto con la información del combustible asociado
   */
  async obtenerTodos() {
    const { data, error } = await supabase
      .from('tanques_surtirsoft')
      .select(`
        id,
        nombre,
        capacidad_total,
        nivel_actual,
        codigo_binario_scada,
        combustible_id,
        combustibles_surtirsoft (
          codigo,
          nombre,
          unidad_medida,
          precio_unidad
        )
      `)
      .order('nombre', { ascending: true });

    if (error) {
      console.error('Error en TanqueModel.obtenerTodos:', error);
      throw error;
    }
    return data;
  },

  /**
   * Obtiene un tanque específico por ID
   */
  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from('tanques_surtirsoft')
      .select(`
        id,
        nombre,
        capacidad_total,
        nivel_actual,
        codigo_binario_scada,
        combustibles_surtirsoft (
          codigo,
          nombre
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error en TanqueModel.obtenerPorId:', error);
      throw error;
    }
    return data;
  },

  /**
   * Registra una recarga en recargas_tanque_surtirsoft.
   * El trigger de tu SQL ('trg_procesar_recarga_surtirsoft') actualizará 
   * automáticamente el nivel_actual y el codigo_binario_scada.
   */
  async registrarRecarga({ tanque_id, usuario_id, litros_cargados, proveedor }) {
    const { data, error } = await supabase
      .from('recargas_tanque_surtirsoft')
      .insert([
        {
          tanque_id,
          usuario_id,
          litros_cargados: parseFloat(litros_cargados),
          proveedor: proveedor.trim()
        }
      ])
      .select();

    if (error) {
      console.error('Error en TanqueModel.registrarRecarga:', error);
      throw error;
    }
    return data;
  }
};