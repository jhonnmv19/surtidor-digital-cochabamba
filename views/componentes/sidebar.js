export function renderSidebar() {
  return `
  <!-- OVERLAY / BACKDROP PARA MÓVILES -->
  <div id="sidebar-overlay" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 hidden lg:hidden transition-opacity"></div>

  <!-- ASIDE / SIDEBAR -->
  <aside id="sidebar" class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between fixed lg:static inset-y-0 left-0 z-50 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out h-screen">
    
    <!-- HEADER DEL SIDEBAR: LOGO + TITULO + BOTÓN X EN MÓVIL -->
    <div class="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/40 flex-shrink-0">
      <div class="flex items-center gap-3 overflow-hidden">
        <div class="w-10 h-10 rounded-xl bg-slate-800 border border-sky-500/30 flex items-center justify-center p-1 shadow-md shadow-sky-500/10 flex-shrink-0">
          <img src="/imagen/yautja2.png" alt="Logo SurtirSoft" class="w-full h-full object-contain" />
        </div>
        <div class="overflow-hidden">
          <h1 class="text-sm font-bold tracking-wider text-white truncate">SURTIRSOFT <span class="text-sky-400">SCADA</span></h1>
          <p class="text-[9px] text-slate-400 tracking-widest uppercase truncate">Estación Cochabamba</p>
        </div>
      </div>

      <!-- Botón para cerrar el menú en móviles -->
      <button id="close-sidebar-btn" class="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition cursor-pointer">
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>
    </div>

    <!-- NAVEGACIÓN SECCIONADA (CON SCROLL ACTIVO) -->
    <div class="flex-1 overflow-y-auto py-3 px-2 space-y-1">
      <div class="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Principal</div>
      <div class="nav-item active flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-sky-400 transition cursor-pointer" data-target="dashboard">
        <i class="fa-solid fa-chart-line w-5 text-center"></i><span>Dashboard</span>
      </div>

      <div class="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-4">Operaciones</div>
      <div class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-sky-400 transition cursor-pointer" data-target="surtidores">
        <i class="fa-solid fa-gas-pump w-5 text-center"></i><span>Gestión de Surtidores</span>
      </div>
      <div class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-sky-400 transition cursor-pointer" data-target="tanques">
        <i class="fa-solid fa-database w-5 text-center"></i><span>Tanques</span>
      </div>
      <div class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-sky-400 transition cursor-pointer" data-target="registro-ventas">
        <i class="fa-solid fa-cash-register w-5 text-center"></i><span>Registro de Ventas</span>
      </div>

      <div class="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-4">Análisis</div>
      <div class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-sky-400 transition cursor-pointer" data-target="historial">
        <i class="fa-solid fa-clock-rotate-left w-5 text-center"></i><span>Historial de Ventas</span>
      </div>
      <div class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-sky-400 transition cursor-pointer" data-target="alertas">
        <i class="fa-solid fa-triangle-exclamation w-5 text-center"></i>
        <span>Alertas</span>
        <span class="ml-auto badge bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full hidden" id="alert-badge">0</span>
      </div>
      <div class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-sky-400 transition cursor-pointer" data-target="reportes">
        <i class="fa-solid fa-chart-column w-5 text-center"></i><span>Reportes</span>
      </div>

      <div class="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-4">Sistema</div>
      <div class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-sky-400 transition cursor-pointer" data-target="configuracion">
        <i class="fa-solid fa-sliders w-5 text-center"></i><span>Configuración</span>
      </div>
      <div class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-sky-400 transition cursor-pointer" data-target="usuarios">
        <i class="fa-solid fa-users w-5 text-center"></i><span>Usuarios</span>
      </div>
    </div>

    <!-- SECCIÓN INFERIOR: CONTADOR DE ACCESOS Y CERRAR SESIÓN -->
    <div class="border-t border-slate-800 flex-shrink-0 bg-slate-950/60">
      <div class="px-4 py-3 text-xs flex items-center justify-between border-b border-slate-800/80">
        <div class="flex items-center gap-2 text-slate-400">
          <i class="fa-solid fa-user-check text-sky-400"></i>
          <span>Accesos:</span>
        </div>
        <span id="sidebar-visitas-count" class="font-bold text-sky-400 bg-sky-950/60 border border-sky-800/50 px-2 py-0.5 rounded-md">
          ...
        </span>
      </div>

      <div class="nav-item flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition cursor-pointer" id="btn-logout">
        <i class="fa-solid fa-right-from-bracket w-5 text-center"></i>
        <span class="font-semibold text-sm">Cerrar Sesión</span>
      </div>
    </div>
  </aside>
  `;
}