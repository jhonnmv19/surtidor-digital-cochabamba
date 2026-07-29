// models/usuarioModel.js
import { supabase } from '../config/supabase.js';

export const UsuarioModel = {
  /**
   * Obtiene todos los usuarios ordenados por fecha de creación
   */
  async obtenerTodos() {
    const { data, error } = await supabase
      .from('usuarios_surtirsoft')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
    return data;
  },

  /**
   * Crea un nuevo usuario
   */
  async crear(usuarioData) {
    const { data, error } = await supabase
      .from('usuarios_surtirsoft')
      .insert([
        {
          nombre_completo: usuarioData.nombre_completo,
          email: usuarioData.email,
          password_hash: usuarioData.password_hash, // En producción se recomienda cifrar o usar Auth
          rol: usuarioData.rol,
          activo: true
        }
      ])
      .select();

    if (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
    return data[0];
  },

  /**
   * Cambia el estado (activo/inactivo) de un usuario
   */
  async cambiarEstado(id, nuevoEstado) {
    const { data, error } = await supabase
      .from('usuarios_surtirsoft')
      .update({ activo: nuevoEstado })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error al cambiar estado:', error);
      throw error;
    }
    return data[0];
  },

  /**
   * Actualiza los datos de un usuario existente
   */
  async actualizar(id, usuarioData) {
    const { data, error } = await supabase
      .from('usuarios_surtirsoft')
      .update({
        nombre_completo: usuarioData.nombre_completo,
        email: usuarioData.email,
        rol: usuarioData.rol
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
    return data[0];
  }
};