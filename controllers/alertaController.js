import { AlertaModel } from '../models/alertaModel.js';
import { renderAlertasView } from '../views/alertasView.js';

export const AlertaController = {
  async init(container) {
    const alertas = (typeof AlertaModel !== 'undefined' && AlertaModel.getAll)
      ? await AlertaModel.getAll()
      : [
          { id: 1, titulo: 'Tanque Diésel Bajo', descripcion: 'Nivel por debajo del 20%', nivel: 'critical', timestamp: '10:42 AM' },
          { id: 2, titulo: 'Surtidor 02 Mantenimiento', descripcion: 'Presión fuera de rango de tolerancia', nivel: 'warning', timestamp: '09:15 AM' }
        ];

    container.innerHTML = renderAlertasView(alertas);
  }
};