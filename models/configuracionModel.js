import { supabase } from '../config/supabase.js';

export const ConfiguracionModel = {
  /**
   * Carga inicial dinámica de todos los parámetros desde Supabase
   */
  async obtenerTodo() {
    try {
      const [combustiblesRes, tanquesRes, estacionRes] = await Promise.all([
        supabase
          .from('combustibles_surtirsoft')
          .select('*')
          .order('nombre', { ascending: true }),
        supabase
          .from('tanques_surtirsoft')
          .select('*, combustibles_surtirsoft(nombre, codigo, unidad_medida)')
          .order('nombre', { ascending: true }),
        supabase
          .from('configuracion_estacion_surtirsoft')
          .select('*')
          .limit(1)
      ]);

      if (combustiblesRes.error) throw combustiblesRes.error;
      if (tanquesRes.error) throw tanquesRes.error;
      if (estacionRes.error) throw estacionRes.error;

      return {
        combustibles: combustiblesRes.data || [],
        tanques: tanquesRes.data || [],
        estacion: estacionRes.data?.[0] || null
      };
    } catch (error) {
      console.error("Error al obtener datos desde Supabase:", error);
      throw error;
    }
  },

  /**
   * Actualiza el precio de un combustible por su ID
   */
  async actualizarPrecioCombustible(id, nuevoPrecio) {
    const { data, error } = await supabase
      .from('combustibles_surtirsoft')
      .update({ 
        precio_unidad: parseFloat(nuevoPrecio),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Actualiza la capacidad de un tanque por su ID
   */
  async actualizarCapacidadTanque(id, nuevaCapacidad) {
    const { data, error } = await supabase
      .from('tanques_surtirsoft')
      .update({ 
        capacidad_total: parseFloat(nuevaCapacidad),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Actualiza los datos institucionales de la estación
   */
  async actualizarDatosEstacion(id, datos) {
    const { data, error } = await supabase
      .from('configuracion_estacion_surtirsoft')
      .update({
        ...datos,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  }
};