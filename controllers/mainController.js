// controllers/mainController.js

// Importaciones de Autenticación y Vistas Generales
import { renderLogin } from '../views/loginView.js';
import { AuthController } from './authController.js';
import { renderSidebar } from '../views/componentes/sidebar.js';
import { renderNavbar } from '../views/componentes/navbar.js';

// Modelos Supabase
import { VentaModel } from '../models/ventaModel.js';
import { surtidorModel } from '../models/surtidorModel.js';
import { AlertaModel } from '../models/alertaModel.js';
import { VisitaModel } from '../models/visitaModel.js';

// Controladores Módulos SCADA
import { SurtidorController } from './surtidorController.js';
import { TanqueController } from './tanqueController.js';
import { VentaController } from './ventaController.js';
import { AlertaController } from './alertaController.js';
import { voiceCtrl } from './voiceController.js';
import { ReporteController } from './reporteController.js';
import { ConfiguracionController } from './configuracionController.js';
import { UsuarioController } from './usuarioController.js';

// Vistas
import { renderDashboardView } from '../views/dashboardView.js';

export const MainController = {
  activeController: null,
  alertCheckInterval: null,
  previousAlertCount: 0,

  async init() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.bindGlobalEvents();

    // Verificación de Autenticación
    if (AuthController.isAuthenticated()) {
      this.showAppLayout();
      await this.incrementarContadorVisitas();
      await this.initScadaServices();
      await this.navigateTo('dashboard');
    } else {
      this.showLoginView();
    }
  },

  /**
   * Renderiza e inicializa los layouts principales (Sidebar y Navbar)
   * y aplica el fondo oscuro al contenedor principal
   */
  showAppLayout() {
    const sidebar = document.getElementById('app-sidebar');
    const navbar = document.getElementById('app-navbar');
    const mainContent = document.getElementById('main-content');

    // Asegurar fondo oscuro en el contenedor principal para evitar bordes claros
    if (mainContent) {
      mainContent.className = 'bg-slate-950 text-slate-100 min-h-screen';
    }

    // Renderizar y mostrar Sidebar y Navbar
    if (sidebar) {
      sidebar.innerHTML = renderSidebar();
      sidebar.style.display = 'block';
    }
    if (navbar) {
      navbar.innerHTML = renderNavbar();
      navbar.style.display = 'block';
    }
  },

  /**
   * Oculta completamente el layout principal (destruye contenido y style.display = 'none')
   * y renderiza únicamente la vista de Login en pantalla completa
   */
  showLoginView() {
    const sidebar = document.getElementById('app-sidebar');
    const navbar = document.getElementById('app-navbar');
    const mainContent = document.getElementById('main-content');

    // Detener intervalo de verificaciones en segundo plano
    if (this.alertCheckInterval) {
      clearInterval(this.alertCheckInterval);
      this.alertCheckInterval = null;
    }

    // Ocultar y limpiar componentes del layout
    if (sidebar) {
      sidebar.innerHTML = '';
      sidebar.style.display = 'none';
    }
    if (navbar) {
      navbar.innerHTML = '';
      navbar.style.display = 'none';
    }

    // Renderizar vista de Login en el contenedor principal
    if (mainContent) {
      mainContent.innerHTML = renderLogin();
      this.bindLoginEvents();
    }
  },

  /**
   * Vincula los eventos del formulario de Login
   */
  bindLoginEvents() {
    const form = document.getElementById('form-login');
    const btnQuick = document.getElementById('btn-quick-login');

    const executeLogin = async () => {
      AuthController.login();
      this.showAppLayout();
      await this.incrementarContadorVisitas();
      await this.initScadaServices();
      await this.navigateTo('dashboard');
    };

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        executeLogin();
      });
    }

    if (btnQuick) {
      btnQuick.addEventListener('click', () => {
        executeLogin();
      });
    }
  },

  /**
   * Inicializa las verificaciones en segundo plano para alertas del sistema SCADA
   */
  async initScadaServices() {
    await this.checkSystemAlerts();
    if (!this.alertCheckInterval) {
      this.alertCheckInterval = setInterval(() => this.checkSystemAlerts(), 10000);
    }

    window.removeEventListener('alerta-resuelta', this.handleAlertaResuelta);
    window.addEventListener('alerta-resuelta', this.handleAlertaResuelta);
  },

  handleAlertaResuelta() {
    MainController.checkSystemAlerts();
  },

  /**
   * Consulta las alertas activas en Supabase, actualiza el Navbar y emite un tono de advertencia
   */
  async checkSystemAlerts() {
    try {
      const activas = await AlertaModel.obtenerActivas();
      const count = activas ? activas.length : 0;

      const badge = document.getElementById('nav-alert-badge');
      if (badge) {
        badge.textContent = count;
        if (count === 0) {
          badge.classList.add('hidden');
        } else {
          badge.classList.remove('hidden');
        }
      }

      if (count > this.previousAlertCount && this.previousAlertCount !== 0) {
        this.playAlertSound();
      }
      this.previousAlertCount = count;

    } catch (e) {
      console.error('Error al verificar alertas SCADA:', e);
    }
  },

  playAlertSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('Audio Context bloqueado o no soportado en este navegador.');
    }
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
      // Evento Logout
      const btnLogout = e.target.closest('#btn-logout');
      if (btnLogout) {
        AuthController.logout();
        this.showLoginView();
        return;
      }

      // Navegación mediante items con data-target
      const navItem = e.target.closest('[data-target]');
      if (navItem) {
        const targetView = navItem.getAttribute('data-target');
        this.navigateTo(targetView);
      }

      // Comando de voz
      const voiceBtn = e.target.closest('#btn-voice-command');
      if (voiceBtn && voiceCtrl) {
        voiceCtrl.toggleListening();
      }
    });

    // Menú desplegable responsive en pantallas pequeñas
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

    if (this.activeController?.destroy) {
      this.activeController.destroy();
      this.activeController = null;
    }

    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`[data-target="${viewName}"]`)?.classList.add('active');

    mainContent.innerHTML = `<div class="p-6 text-slate-400">Cargando...</div>`;

    try {
      switch (viewName) {
        case 'dashboard':
          await this.loadDashboard(mainContent);
          break;
        case 'surtidores':
          this.activeController = SurtidorController;
          await SurtidorController.init(mainContent);
          break;
        case 'tanques':
          this.activeController = TanqueController;
          await TanqueController.init(mainContent);
          break;
        case 'registro-ventas':
          this.activeController = VentaController;
          await VentaController.initRegistro(mainContent);
          break;
        case 'historial':
        case 'historial-ventas':
          this.activeController = VentaController;
          await VentaController.initHistorial(mainContent);
          break;
        case 'alertas':
          this.activeController = AlertaController;
          await AlertaController.init(mainContent);
          break;
        case 'reportes':
          this.activeController = ReporteController;
          await ReporteController.init(mainContent);
          break;
        case 'configuracion':
          this.activeController = ConfiguracionController;
          await ConfiguracionController.init(mainContent);
          break;
        case 'usuarios':
          this.activeController = UsuarioController;
          await UsuarioController.init(mainContent);
          break;
        default:
          mainContent.innerHTML = `<div class="p-6 text-white">Vista <b>${viewName}</b> en construcción.</div>`;
      }
    } catch (error) {
      console.error(`Error al cargar la vista ${viewName}:`, error);
      mainContent.innerHTML = `<div class="p-6 text-red-400">Ocurrió un error al cargar el módulo. Por favor, reintente.</div>`;
    }
  },

  async loadDashboard(container) {
    try {
      const [turnoActivo, surtidores, alertasActivas, kpisHoy, ultimasVentas, ventasPorHora, totalVisitas] = await Promise.all([
        VentaModel.obtenerTurnoActivo(),
        surtidorModel.obtenerTodos(),
        AlertaModel.obtenerActivas(),
        VentaModel.obtenerKpisHoy(),
        VentaModel.obtenerHistorialVentas(10),
        VentaModel.obtenerVentasPorHoraHoy(),
        VisitaModel.obtenerTotalVisitas()
      ]);

      const salesFormatted = (ultimasVentas || []).map(v => ({
        id: `#V-${v.id}`,
        placa: v.placa_vehiculo || 'S/P',
        cliente: v.nombre_cliente || 'Consumidor Final',
        combustible: v.combustibles_surtirsoft?.codigo || 'N/A',
        litros: `${Number(v.cantidad || 0).toFixed(2)} ${v.combustibles_surtirsoft?.unidad_medida || 'L'}`,
        total: `${Number(v.total_cobrado || 0).toFixed(2)} Bs`,
        pago: v.metodo_pago || 'Efectivo',
        hora: new Date(v.fecha_hora).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })
      }));

      const surtidoresFormatted = (surtidores || []).map(s => ({
        nombre: s.nombre,
        tipo: s.tanques_surtirsoft?.combustibles_surtirsoft?.nombre || 'General',
        estado: s.estado
      }));

      const kpis = {
        ingresos: `${(kpisHoy?.totalIngresos || 0).toFixed(2)} Bs`,
        ventas: kpisHoy?.totalVentas || 0,
        litros: `${(kpisHoy?.totalLitros || 0).toFixed(2)} L`,
        alertas: (alertasActivas || []).length,
        visitas: totalVisitas || 1
      };

      container.innerHTML = renderDashboardView(salesFormatted, surtidoresFormatted, kpis, alertasActivas || []);

      this.initChartsDinamicos(ventasPorHora || { labels: [], values: [] }, surtidores || []);

      const btnRefresh = document.getElementById('btn-refresh-dash');
      if (btnRefresh) {
        btnRefresh.onclick = () => this.loadDashboard(container);
      }

    } catch (error) {
      console.error('Error al cargar el Dashboard dinámico:', error);
      container.innerHTML = `<div class="p-6 text-red-400">Error al consultar la base de datos para el Dashboard.</div>`;
    }
  },

  initChartsDinamicos(ventasHora, surtidores) {
    if (typeof Plotly === 'undefined') return;

    const chartIngresos = document.getElementById('chart-ingresos');
    if (chartIngresos) {
      const xData = ventasHora.labels && ventasHora.labels.length > 0 ? ventasHora.labels : ['08:00', '10:00', '12:00', '14:00', '16:00'];
      const yData = ventasHora.values && ventasHora.values.length > 0 ? ventasHora.values : [0, 0, 0, 0, 0];

      const maxVal = Math.max(...yData, 10);
      const minVal = 0;

      Plotly.newPlot('chart-ingresos', [{
        x: xData,
        y: yData,
        type: 'scatter', 
        mode: 'lines+markers', 
        line: { color: '#0EA5E9', width: 3, shape: 'spline' },
        marker: { color: '#38BDF8', size: 6 },
        hoverinfo: 'x+y'
      }], {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: '#CBD5E1', size: 10 },
        margin: { t: 10, r: 15, l: 45, b: 30 },
        xaxis: {
          showgrid: false,
          zeroline: false,
          color: '#64748B'
        },
        yaxis: {
          range: [minVal, maxVal * 1.15],
          showgrid: true,
          gridcolor: '#334155',
          zeroline: true,
          zerolinecolor: '#334155',
          color: '#64748B'
        },
        hovermode: 'closest'
      }, { 
        responsive: true, 
        displayModeBar: false,
        scrollZoom: false 
      });
    }

    const chartCombustible = document.getElementById('chart-combustible');
    if (chartCombustible) {
      const tiposCombustible = {};
      surtidores.forEach(s => {
        const nombreComb = s.tanques_surtirsoft?.combustibles_surtirsoft?.codigo || 'Otros';
        tiposCombustible[nombreComb] = (tiposCombustible[nombreComb] || 0) + 1;
      });

      const labels = Object.keys(tiposCombustible);
      const values = Object.values(tiposCombustible);

      Plotly.newPlot('chart-combustible', [{
        labels: labels.length > 0 ? labels : ['Sin datos'],
        values: values.length > 0 ? values : [1],
        type: 'pie', 
        hole: 0.5,
        marker: { colors: ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'] },
        textinfo: 'label+percent',
        textposition: 'inside'
      }], {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: '#CBD5E1', size: 10 },
        showlegend: false,
        margin: { t: 10, r: 10, l: 10, b: 10 }
      }, { 
        responsive: true, 
        displayModeBar: false 
      });
    }

    setTimeout(() => {
      if (chartIngresos) Plotly.Plots.resize(chartIngresos);
      if (chartCombustible) Plotly.Plots.resize(chartCombustible);
    }, 100);
  },

  /**
   * Registra la visita en Supabase (evita duplicados en la sesión)
   * y actualiza de inmediato la etiqueta dinámica `#sidebar-visitas-count` en el Sidebar.
   */
  async incrementarContadorVisitas() {
    try {
      if (!sessionStorage.getItem('surtirsoft_visita_registrada')) {
        await VisitaModel.registrarVisita();
        sessionStorage.setItem('surtirsoft_visita_registrada', 'true');
      }

      const totalVisitas = await VisitaModel.obtenerTotalVisitas();

      const visitsBadge = document.getElementById('sidebar-visitas-count');
      if (visitsBadge) {
        visitsBadge.textContent = totalVisitas || 1;
      }
    } catch (error) {
      console.error('Error al registrar o cargar las visitas en Supabase:', error);
      const visitsBadge = document.getElementById('sidebar-visitas-count');
      if (visitsBadge) visitsBadge.textContent = '1';
    }
  }
};