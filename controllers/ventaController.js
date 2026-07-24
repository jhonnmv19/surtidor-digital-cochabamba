import { VentaModel } from '../models/ventaModel.js';
import { SurtidorModel } from '../models/surtidorModel.js';
import { renderRegistroVentasView } from '../views/registroVentasView.js';
import { renderHistorialVentasView } from '../views/historialVentasView.js';

export const VentaController = {
  async initRegistro(container) {
    const surtidores = await SurtidorModel.getAll();
    container.innerHTML = renderRegistroVentasView(surtidores);
  },
  
  async initHistorial(container) {
    const ventas = await VentaModel.getUltimasVentas();
    container.innerHTML = renderHistorialVentasView(ventas);
  }
};