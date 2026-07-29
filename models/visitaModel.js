// models/visitaModel.js
// models/visitaModel.js
import { supabase } from '../config/supabase.js'; // <-- Se quitó "Client"

export const VisitaModel = {
  /**
   * Registra una nueva visita en la base de datos.
   */
  async registrarVisita() {
    try {
      const { error } = await supabase
        .from('visitas_sistema_surtirsoft')
        .insert([{}]); // Genera id y created_at por default en Postgres

      if (error) {
        console.error('Error al registrar visita en BD:', error.message);
      }
    } catch (err) {
      console.error('Error en registrarVisita:', err);
    }
  },

  /**
   * Obtiene el total real de visitas registradas en la BD.
   */
  async obtenerTotalVisitas() {
    try {
      const { count, error } = await supabase
        .from('visitas_sistema_surtirsoft')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    } catch (err) {
      console.error('Error al obtener conteo de visitas:', err);
      return 0;
    }
  }
};