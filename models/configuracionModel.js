// models/configuracionModel.js
import { supabase } from '../config/supabase.js';

export const ConfiguracionModel = {
  /**
   * Carga inicial de todos los datos requeridos por la vista de configuración
   */
  async obtenerTodo() {
    try {
      const [combustiblesRes, tanquesRes, estacionRes] = await Promise.all([
        supabase.from('combustibles_surtirsoft').select('*').order('created_at', { ascending: true }),
        supabase.from('tanques_surtirsoft').select('*').order('created_at', { ascending: true }),
        supabase.from('configuracion_estacion_surtirsoft').select('*').limit(1).single()
      ]);

      return {
        combustibles: combustiblesRes.data || [],
        tanques: tanquesRes.data || [],
        estacion: estacionRes.data || {}
      };
    } catch (error) {
      console.error("Error al obtener configuraciones desde Supabase:", error);
      throw error;
    }
  },

  /**
   * Actualiza el precio unitario de un combustible por su código
   */
  async actualizarPrecioCombustible(codigo, nuevoPrecio) {
    const { data, error } = await supabase
      .from('combustibles_surtirsoft')
      .update({ 
        precio_unidad: parseFloat(nuevoPrecio),
        updated_at: new Date().toISOString()
      })
      .eq('codigo', codigo);

    if (error) throw error;
    return data;
  },

  /**
   * Actualiza la capacidad total de un tanque por su ID
   */
  async actualizarCapacidadTanque(tanqueId, nuevaCapacidad) {
    const { data, error } = await supabase
      .from('tanques_surtirsoft')
      .update({ 
        capacidad_total: parseFloat(nuevaCapacidad),
        updated_at: new Date().toISOString()
      })
      .eq('id', tanqueId);

    if (error) throw error;
    return data;
  },

  /**
   * Actualiza los datos de la estación de servicio de forma segura
   */
  async actualizarDatosEstacion(id, datos) {
    // Preparar payload básico compatible
    const payload = {
      nombre_estacion: datos.nombre_estacion,
      ubicacion: datos.ubicacion,
      telefono: datos.telefono,
      updated_at: new Date().toISOString()
    };

    // Agregar opcionales si existen en la tabla
    if (datos.nit !== undefined) payload.nit = datos.nit;
    if (datos.direccion !== undefined) payload.direccion = datos.direccion;

    const { data, error } = await supabase
      .from('configuracion_estacion_surtirsoft')
      .update(payload)
      .eq('id', id);

    if (error) throw error;
    return data;
  }
};