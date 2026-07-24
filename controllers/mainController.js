import { VentaModel } from '../models/ventaModel.js';
import { SurtidorModel } from '../models/surtidorModel.js';
import { renderDashboardView } from '../views/dashboardView.js';

// Controladores
import { SurtidorController } from './surtidorController.js';
import { TanqueController } from './tanqueController.js';
import { VentaController } from './ventaController.js';
import { AlertaController } from './alertaController.js';
import { VoiceController } from './voiceController.js';

// Vistas directas (sin lógica compleja)
import { renderReportesView } from '../views/reportesView.js';
import { renderConfiguracionView } from '../views/configuracionView.js';
import { renderUsuariosView } from '../views/usuariosView.js';

export const MainController = {
  async init() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.bindGlobalEvents();
    
    // Carga inicial
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

    // Marcado activo en el Sidebar
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`[data-target="${viewName}"]`)?.classList.add('active');

    // Mapeo exacto de rutas
    switch (viewName) {
      case 'dashboard':
        await this.loadDashboard();
        break;
      case 'surtidores':
        await SurtidorController.init(mainContent);
        break;
      case 'tanques':
        await TanqueController.init(mainContent);
        break;
      case 'registro-ventas':
        await VentaController.initRegistro(mainContent);
        break;
      case 'historial':
      case 'historial-ventas':
        await VentaController.initHistorial(mainContent);
        break;
      case 'alertas':
        await AlertaController.init(mainContent);
        break;
      case 'reportes':
        mainContent.innerHTML = renderReportesView();
        break;
      case 'configuracion':
        mainContent.innerHTML = renderConfiguracionView();
        break;
      case 'usuarios':
        mainContent.innerHTML = renderUsuariosView();
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
  bindGlobalEvents() {
    // Delegación de clics para rutas
    document.body.addEventListener('click', (e) => {
      const navItem = e.target.closest('[data-target]');
      if (navItem) {
        const targetView = navItem.getAttribute('data-target');
        this.navigateTo(targetView);
      }

      // Evento para activar el micrófono
      const voiceBtn = e.target.closest('#btn-voice-command');
      if (voiceBtn) {
        VoiceController.toggleListening();
      }
    });

    const toggleBtn = document.getElementById('toggle-sidebar-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        document.getElementById('sidebar')?.classList.toggle('open');
      });
    }
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
