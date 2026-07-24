import { TanqueModel } from '../models/tanqueModel.js';
import { renderTanquesView } from '../views/tanquesView.js';

export const TanqueController = {
  async init(container) {
    // Si TanqueModel aún no tiene datos de Supabase, usará este array de prueba por defecto
    const tanques = (typeof TanqueModel !== 'undefined' && TanqueModel.getAll) 
      ? await TanqueModel.getAll() 
      : [
          { nombre: 'Tanque 01 - Gasolina Especial', combustible: 'GE', nivelActual: 14000, capacidad: 20000 },
          { nombre: 'Tanque 02 - Diésel Oil', combustible: 'Diésel', nivelActual: 3800, capacidad: 25000 },
          { nombre: 'Tanque 03 - Premium', combustible: 'Premium', nivelActual: 18500, capacidad: 20000 }
        ];

    container.innerHTML = renderTanquesView(tanques);
  }
};