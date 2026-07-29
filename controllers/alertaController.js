// controllers/alertaController.js
import { AlertaModel } from '../models/alertaModel.js';
import { renderAlertasView } from '../views/alertasView.js';

export const AlertaController = {
  container: null,

  async init(container) {
    this.container = container;
    await this.refresh();
  },

  async refresh() {
    if (!this.container) return;

    // Cargar alertas desde la base de datos
    const activas = await AlertaModel.obtenerActivas();
    const historial = await AlertaModel.obtenerHistorial();

    // Renderizar la vista
    this.container.innerHTML = renderAlertasView(activas, historial);
    this.bindEvents();
  },

  bindEvents() {
    if (!this.container) return;

    // Escuchar clic en botón "Resolver" individual
    this.container.querySelectorAll('.btn-resolver-alerta').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        await this.resolverAlerta(id);
      });
    });

    // Escuchar clic en "Resolver Todas"
    const btnResolveAll = this.container.querySelector('#btn-resolve-all');
    if (btnResolveAll) {
      btnResolveAll.addEventListener('click', async () => {
        await this.resolverTodas();
      });
    }
  },

  async resolverAlerta(alertaId) {
    try {
      // ID dummy de usuario operador o extraído del estado de autenticación de tu app
      const usuarioId = null; 
      await AlertaModel.resolver(alertaId, usuarioId);
      
      // Actualizar vista y badge global de la Navbar
      await this.refresh();
      window.dispatchEvent(new CustomEvent('alerta-resuelta'));
    } catch (err) {
      console.error('Error al resolver alerta:', err);
    }
  },

  async resolverTodas() {
    try {
      const usuarioId = null;
      await AlertaModel.resolverTodas(usuarioId);
      await this.refresh();
      window.dispatchEvent(new CustomEvent('alerta-resuelta'));
    } catch (err) {
      console.error('Error al resolver todas las alertas:', err);
    }
  },

  destroy() {
    this.container = null;
  }
};