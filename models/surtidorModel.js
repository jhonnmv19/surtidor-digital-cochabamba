import { supabase } from '../config/supabase.js';

export const SurtidorModel = {
  // Datos iniciales de respaldo (mock data de la vista)
  surtidoresMock: [
    { id: 1, nombre: 'Surtidor 01', tipo: 'Gasolina Especial', estado: 'activo', mangueras: 2, lecturaActual: '124,580 L' },
    { id: 2, nombre: 'Surtidor 02', tipo: 'Diésel Oil', estado: 'activo', mangueras: 2, lecturaActual: '98,320 L' },
    { id: 3, nombre: 'Surtidor 03', tipo: 'Gasolina Premium', estado: 'mantenimiento', mangueras: 1, lecturaActual: '45,110 L' },
    { id: 4, nombre: 'Surtidor 04', tipo: 'GNV', estado: 'activo', mangueras: 4, lecturaActual: '210,400 L' },
    { id: 5, nombre: 'Surtidor 05', tipo: 'Gasolina Especial', estado: 'activo', mangueras: 2, lecturaActual: '88,900 L' },
    { id: 6, nombre: 'Surtidor 06', tipo: 'Diésel Oil', estado: 'inactivo', mangueras: 2, lecturaActual: '15,200 L' }
  ],

  async getAll() {
    const { data, error } = await supabase.from('surtidores').select('*');
    if (error || !data || data.length === 0) return this.surtidoresMock;
    return data;
  }
};