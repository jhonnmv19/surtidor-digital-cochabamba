import { supabase } from '../config/supabase.js';

export const TanqueModel = {
  async getTanquesStatus() {
    const { data, error } = await supabase.from('tanques').select('*');
    if (error || !data) {
      return [
        { id: 'GE', nombre: 'Gasolina Especial', nivel: 12, capacidad: 20000, estado: 'critico' },
        { id: 'DO', nombre: 'Diésel Oil', nivel: 68, capacidad: 30000, estado: 'normal' },
        { id: 'GP', nombre: 'Gasolina Premium', nivel: 85, capacidad: 15000, estado: 'normal' },
        { id: 'GNV', nombre: 'GNV', nivel: 25, capacidad: 25000, estado: 'advertencia' }
      ];
    }
    return data;
  }
};