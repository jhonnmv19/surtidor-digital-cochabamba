import { supabase } from '../config/supabase.js';

export const surtidorModel = {
  // 1. Obtener todos los surtidores con la información de su tanque y combustible asignado
  async obtenerTodos() {
    const { data, error } = await supabase
      .from('surtidores_surtirsoft')
      .select(`
        id,
        nombre,
        estado,
        tanque_id,
        tanques_surtirsoft (
          id,
          nombre,
          nivel_actual,
          capacidad_total,
          codigo_binario_scada,
          combustibles_surtirsoft ( id, nombre, codigo, unidad_medida, precio_unidad )
        )
      `)
      .order('nombre', { ascending: true });

    if (error) {
      console.error("Error al obtener surtidores:", error);
      throw error;
    }
    return data || [];
  },

  // 2. Obtener lista de tanques disponibles para asignar al surtidor en el formulario de edición
  async obtenerTanques() {
    const { data, error } = await supabase
      .from('tanques_surtirsoft')
      .select(`
        id,
        nombre,
        combustibles_surtirsoft ( nombre, codigo )
      `)
      .order('nombre', { ascending: true });

    if (error) {
      console.error("Error al obtener lista de tanques:", error);
      throw error;
    }
    return data || [];
  },

  // 3. Actualizar datos completos del surtidor (Nombre, Estado y Tanque/Combustible)
  async actualizarSurtidor(id, datos) {
    const { data, error } = await supabase
      .from('surtidores_surtirsoft')
      .update({ 
        nombre: datos.nombre,
        estado: datos.estado,
        tanque_id: datos.tanque_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error("Error al actualizar surtidor:", error);
      throw error;
    }
    return data;
  },

  // 4. Cambio rápido de estado (Activo <-> Inactivo)
  async actualizarEstado(id, nuevoEstado) {
    const { data, error } = await supabase
      .from('surtidores_surtirsoft')
      .update({ 
        estado: nuevoEstado,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error("Error al actualizar estado rápido del surtidor:", error);
      throw error;
    }
    return data;
  }
};