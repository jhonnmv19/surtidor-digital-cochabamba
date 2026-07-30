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
import { ScadaAlert } from '../config/scadaAlert.js';

// Vistas
import { renderDashboardView } from '../views/dashboardView.js';

export const MainController = {
  activeController: null,
  alertCheckInterval: null,
  previousAlertCount: 0,
  audioInterval: null,

  async init() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.bindGlobalEvents();

    if (AuthController.isAuthenticated()) {
      this.showAppLayout();
      await this.incrementarContadorVisitas();
      await this.initScadaServices();
      await this.navigateTo('dashboard');
    } else {
      this.showLoginView();
    }
  },

  showAppLayout() {
    const sidebar = document.getElementById('app-sidebar');
    const navbar = document.getElementById('app-navbar');
    const mainContent = document.getElementById('main-content');

    if (mainContent) {
      mainContent.className = 'bg-slate-950 text-slate-100 min-h-screen';
    }

    if (sidebar) {
      sidebar.innerHTML = renderSidebar();
      sidebar.style.display = 'block';
    }
    if (navbar) {
      navbar.innerHTML = renderNavbar();
      navbar.style.display = 'block';
    }
  },

  showLoginView() {
    const sidebar = document.getElementById('app-sidebar');
    const navbar = document.getElementById('app-navbar');
    const mainContent = document.getElementById('main-content');

    if (this.alertCheckInterval) {
      clearInterval(this.alertCheckInterval);
      this.alertCheckInterval = null;
    }
    this.stopAlarmLoop();

    if (sidebar) {
      sidebar.innerHTML = '';
      sidebar.style.display = 'none';
    }
    if (navbar) {
      navbar.innerHTML = '';
      navbar.style.display = 'none';
    }

    if (mainContent) {
      mainContent.innerHTML = renderLogin();
      setTimeout(() => {
        this.bindLoginEvents();
      }, 50);
    }
  },

  bindLoginEvents() {
    const form = document.getElementById('form-login');
    const btnQuick = document.getElementById('btn-quick-login');

    const triggerBootSequence = async (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const userVal = document.getElementById('login-user')?.value;
      const passVal = document.getElementById('login-password')?.value;

      const overlay = document.getElementById('scada-boot-overlay');
      const progressBar = document.getElementById('boot-progress-bar');
      const statusText = document.getElementById('boot-status-text');
      const loginContainer = document.getElementById('login-container');

      if (overlay && progressBar && statusText) {
        overlay.classList.remove('hidden');

        const steps = [
          { percent: '30%', text: 'Estableciendo enlace Supabase Realtime...' },
          { percent: '65%', text: 'Sincronizando sensores de tanques...' },
          { percent: '85%', text: 'Cargando módulos SCADA Cochabamba...' },
          { percent: '100%', text: '¡Acceso Concedido! Inicializando UI...' }
        ];

        for (const step of steps) {
          progressBar.style.width = step.percent;
          statusText.textContent = step.text;
          await new Promise((res) => setTimeout(res, 180));
        }

        if (loginContainer) {
          loginContainer.classList.remove('animate-boot-in');
          loginContainer.classList.add('animate-boot-out');
          await new Promise((res) => setTimeout(res, 250));
        }
      }

      await AuthController.login(userVal, passVal);
      this.showAppLayout();
      await this.navigateTo('dashboard');

      this.incrementarContadorVisitas().catch(err => console.warn('Visita err:', err));
      this.initScadaServices().catch(err => console.warn('Services err:', err));
    };

    if (form) form.addEventListener('submit', triggerBootSequence);
    if (btnQuick) btnQuick.addEventListener('click', triggerBootSequence);
  },

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

  async checkSystemAlerts() {
    try {
      const activas = await AlertaModel.obtenerActivas();
      const count = activas ? activas.length : 0;

      const badge = document.getElementById('nav-alert-badge');
      const sidebarBadge = document.getElementById('alert-badge');

      [badge, sidebarBadge].forEach(b => {
        if (b) {
          b.textContent = count;
          if (count === 0) b.classList.add('hidden');
          else b.classList.remove('hidden');
        }
      });

      const alertasCriticas = (activas || []).filter(a => a.nivel === 'critico');

      if (alertasCriticas.length > 0) {
        this.mostrarModalAlertasCriticas(alertasCriticas);
        this.startAlarmLoop();
      } else {
        this.cerrarModalAlertas();
      }

      this.previousAlertCount = count;
    } catch (e) {
      console.error('Error al verificar alertas SCADA:', e);
    }
  },

  async incrementarContadorVisitas() {
    try {
      if (VisitaModel && typeof VisitaModel.registrarVisita === 'function') {
        const total = await VisitaModel.registrarVisita();
        const el = document.getElementById('sidebar-visitas-count');
        if (el) el.textContent = total;
      }
    } catch (e) {
      console.warn('Error registrando visita:', e);
    }
  },

  async navigateTo(viewTarget) {
    // 1. Cerrar Menú Lateral en pantallas móviles tras la selección
    this.closeSidebarMobile();

    // 2. Actualizar estado activo en los items del menú
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    navItems.forEach(item => {
      if (item.getAttribute('data-target') === viewTarget) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 3. Renderizar vista correspondiente
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    switch (viewTarget) {
      case 'dashboard':
        if (typeof renderDashboardView === 'function') {
          mainContent.innerHTML = renderDashboardView();
        }
        break;

      case 'surtidores':
        if (SurtidorController?.init) await SurtidorController.init();
        break;

      case 'tanques':
        if (TanqueController?.init) await TanqueController.init();
        break;

      case 'registro-ventas':
        if (VentaController?.init) await VentaController.init();
        break;

      case 'historial':
        if (VentaController?.initHistorial) await VentaController.initHistorial();
        break;

      case 'alertas':
        if (AlertaController?.init) await AlertaController.init();
        break;

      case 'reportes':
        if (ReporteController?.init) await ReporteController.init();
        break;

      case 'configuracion':
        if (ConfiguracionController?.init) await ConfiguracionController.init();
        break;

      case 'usuarios':
        if (UsuarioController?.init) await UsuarioController.init();
        break;

      default:
        console.warn(`Vista desconocida: ${viewTarget}`);
        break;
    }
  },

  /* Métodos auxiliares para la gestión responsive del Sidebar */
  openSidebarMobile() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('-translate-x-full');
    if (overlay) overlay.classList.remove('hidden');
  },

  closeSidebarMobile() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.add('-translate-x-full');
    if (overlay) overlay.classList.add('hidden');
  },

  mostrarModalAlertasCriticas(alertas) {
    let modal = document.getElementById('scada-critical-alert-modal');

    const alertasItemsHTML = alertas.map(a => `
      <div class="bg-rose-950/80 border border-rose-500/60 p-3 rounded-lg flex items-start gap-3 shadow-lg">
        <div class="w-3 h-3 rounded-full bg-rose-500 animate-ping mt-1 flex-shrink-0"></div>
        <div class="flex-1">
          <p class="text-sm font-bold text-rose-200">${a.descripcion || 'Falla Crítica en Sistema SCADA'}</p>
          <p class="text-xs text-rose-300/80 mt-1">Ubicación/Origen: ${a.origen || 'Surtidor / Tanque General'}</p>
          <p class="text-[10px] text-slate-400 mt-1">${new Date(a.created_at || Date.now()).toLocaleTimeString('es-BO')}</p>
        </div>
      </div>
    `).join('');

    const modalHTML = `
      <div id="scada-critical-alert-modal" class="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
        <div class="max-w-lg w-full bg-slate-900 border-2 border-rose-600 rounded-2xl shadow-2xl p-6 text-white space-y-5">
          <div class="flex items-center gap-3 border-b border-rose-800/50 pb-4">
            <div class="p-3 bg-rose-600/20 text-rose-500 rounded-full animate-pulse border border-rose-500/40">
              <i class="fa-solid fa-triangle-exclamation text-3xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-black tracking-wide text-rose-500">¡ALERTA CRÍTICA SCADA!</h2>
              <p class="text-xs text-slate-300">Se han detectado eventos que requieren atención inmediata.</p>
            </div>
          </div>
          <div class="max-h-60 overflow-y-auto space-y-2 pr-1">
            ${alertasItemsHTML}
          </div>
          <div class="flex gap-3 pt-2">
            <button id="btn-modal-go-alerts" class="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm">
              <i class="fa-solid fa-arrow-right font-bold"></i> Ir a Vista de Alertas
            </button>
            <button id="btn-modal-silence" class="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 px-4 rounded-xl border border-slate-700 text-sm transition">
              Silenciar
            </button>
          </div>
        </div>
      </div>
    `;

    if (!modal) {
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      this.bindModalEvents();
    } else {
      modal.outerHTML = modalHTML;
      this.bindModalEvents();
    }
  },

  bindModalEvents() {
    const btnGo = document.getElementById('btn-modal-go-alerts');
    const btnSilence = document.getElementById('btn-modal-silence');

    if (btnGo) {
      btnGo.onclick = () => {
        this.cerrarModalAlertas();
        this.navigateTo('alertas');
      };
    }

    if (btnSilence) {
      btnSilence.onclick = () => {
        this.stopAlarmLoop();
        const modal = document.getElementById('scada-critical-alert-modal');
        if (modal) modal.style.display = 'none';
      };
    }
  },

  cerrarModalAlertas() {
    this.stopAlarmLoop();
    const modal = document.getElementById('scada-critical-alert-modal');
    if (modal) modal.remove();
  },

  startAlarmLoop() {
    if (this.audioInterval) return;
    this.playAlertSound();
    this.audioInterval = setInterval(() => {
      this.playAlertSound();
    }, 1200);
  },

  stopAlarmLoop() {
    if (this.audioInterval) {
      clearInterval(this.audioInterval);
      this.audioInterval = null;
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
  
openSidebarMobile() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (sidebar && overlay) {
    sidebar.classList.add('open');
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  }
},

closeSidebarMobile() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (sidebar && overlay) {
    sidebar.classList.remove('open');
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  }
},


 bindGlobalEvents() {
  document.body.addEventListener('click', (e) => {
    // 1. Evento Logout
    const btnLogout = e.target.closest('#btn-logout');
    if (btnLogout) {
      AuthController.logout();
      this.showLoginView();
      return;
    }

    // 2. Abrir menú móvil
    if (e.target.closest('#toggle-sidebar-btn')) {
      this.openSidebarMobile();
      return;
    }

    // 3. Cerrar menú móvil (botón X o fondo oscuro)
    if (e.target.closest('#close-sidebar-btn') || e.target.closest('#sidebar-overlay')) {
      this.closeSidebarMobile();
      return;
    }

    // 4. Navegación mediante items con data-target
    const navItem = e.target.closest('[data-target]');
    if (navItem) {
      const targetView = navItem.getAttribute('data-target');
      this.navigateTo(targetView); // navigateTo ya ejecuta closeSidebarMobile() internamente
      return;
    }

    // 5. Comando de voz
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
    // Si navegamos manualmente o desde el modal a la vista de alertas, detenemos la alarma auditiva
    if (viewName === 'alertas') {
      this.stopAlarmLoop();
    }

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
      // En MainController.loadDashboard:
const [turnoActivo, surtidores, alertasActivas, kpisHoy, ultimasVentas, ventasPorHora, totalVisitas] = await Promise.all([
  VentaModel.obtenerTurnoActivo(),
  surtidorModel.obtenerTodos(),
  AlertaModel.obtenerActivas(),
  VentaModel.obtenerKpisHoy(),
  VentaModel.obtenerHistorialVentas(10), // <-- Manténlo en 10 o 15 máximo
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