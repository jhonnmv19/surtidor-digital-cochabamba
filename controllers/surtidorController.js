import { SurtidorModel } from '../models/surtidorModel.js';
import { renderSurtidoresView } from '../views/surtidoresView.js';

export const SurtidorController = {
  async init(container) {
    const surtidores = await SurtidorModel.getAll();
    container.innerHTML = renderSurtidoresView(surtidores);
  }
};