import { VentaModel } from '../models/ventaModel.js';
import { SurtidorModel } from '../models/surtidorModel.js';
import { renderDashboardView } from '../views/dashboardView.js';
import { SurtidorController } from './surtidorController.js';

export const MainController = {
  async init() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.bindGlobalEvents();
    
    // Carga inicial (Dashboard)
    await this.loadDashboard();
  },

  updateClock() {
    const now = new Date();
    const clockEl = document.getElementById('live-clock');
    const dateEl = document.getElementById('live-date');
    if (clockEl) clockEl.textContent = now.toLocaleTimeString();
    if (dateEl) dateEl.textContent = now.toLocaleDateString('es-BO', { weekday: 'short', day: '2-digit', month: 'short' });
  },

  bindGlobalEvents() {
    // Delegación de eventos para la navegación
    document.body.addEventListener('click', (e) => {
      const navItem = e.target.closest('[data-target]');
      if (navItem) {
        const targetView = navItem.getAttribute('data-target');
        this.navigateTo(targetView);
      }
    });

    const toggleBtn = document.getElementById('toggle-sidebar-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        document.getElementById('sidebar')?.classList.toggle('open');
      });
    }
  },

  async navigateTo(viewName) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // Actualizar nav activo
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`[data-target="${viewName}"]`)?.classList.add('active');

    switch (viewName) {
      case 'dashboard':
        await this.loadDashboard();
        break;
      case 'surtidores':
        await SurtidorController.init(mainContent);
        break;
      default:
        mainContent.innerHTML = `<div class="p-6 text-white">Vista <b>${viewName}</b> en construcción.</div>`;
    }
  },

  async loadDashboard() {
    const mainContent = document.getElementById('main-content');
    const sales = await VentaModel.getUltimasVentas();
    const surtidores = await SurtidorModel.getAll();
    
    mainContent.innerHTML = renderDashboardView(sales, surtidores);
    this.initCharts();
  },

  initCharts() {
    if (typeof Plotly === 'undefined') return;

    Plotly.newPlot('chart-ingresos', [{
      x: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00'],
      y: [1200, 3100, 2400, 4200, 1800, 1580],
      type: 'scatter', mode: 'lines+markers', line: { color: '#0EA5E9', width: 3 }
    }], {
      paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
      font: { color: '#CBD5E1', size: 10 },
      margin: { t: 10, r: 10, l: 30, b: 30 }
    }, { responsive: true, displayModeBar: false });

    Plotly.newPlot('chart-combustible', [{
      labels: ['GE', 'Diésel', 'Premium', 'GNV'],
      values: [45, 30, 15, 10],
      type: 'pie', hole: 0.5,
      marker: { colors: ['#0EA5E9', '#10B981', '#F59E0B', '#38BDF8'] }
    }], {
      paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
      font: { color: '#CBD5E1', size: 10 },
      showlegend: false,
      margin: { t: 10, r: 10, l: 10, b: 10 }
    }, { responsive: true, displayModeBar: false });
  }
};