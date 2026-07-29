export function renderSidebar() {
  return `
  <aside id="sidebar" class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between fixed lg:static inset-y-0 left-0 z-50 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out">
    
    <!-- HEADER SIDEBAR: LOGO + MARCA UNIFICADA -->
    <div>
      <div class="h-16 flex items-center gap-3 px-6 border-b border-slate-800 bg-slate-950/40">
        <div class="w-10 h-10 rounded-xl bg-slate-800 border border-sky-500/30 flex items-center justify-center p-1 shadow-md shadow-sky-500/10 flex-shrink-0">
          <img src="/imagen/yautja2.png" alt="Logo SurtirSoft" class="w-full h-full object-contain" />
        </div>
        <div class="overflow-hidden">
          <h1 class="text-sm font-bold tracking-wider text-white truncate">SURTIRSOFT <span class="text-sky-400">SCADA</span></h1>
          <p class="text-[9px] text-slate-400 tracking-widest uppercase truncate">Estación Cochabamba</p>
        </div>
      </div>

      <!-- NAVEGACIÓN SECCIONADA -->
      <div class="flex-1 overflow-y-auto py-3">
        <div class="nav-section">Principal</div>
        <div class="nav-item active" data-target="dashboard">
          <i class="fa-solid fa-chart-line"></i><span>Dashboard</span>
        </div>

        <div class="nav-section">Operaciones</div>
        <div class="nav-item" data-target="surtidores">
          <i class="fa-solid fa-gas-pump"></i><span>Gestión de Surtidores</span>
        </div>
        <div class="nav-item" data-target="tanques">
          <i class="fa-solid fa-database"></i><span>Tanques</span>
        </div>
        <div class="nav-item" data-target="registro-ventas">
          <i class="fa-solid fa-cash-register"></i><span>Registro de Ventas</span>
        </div>

        <div class="nav-section">Análisis</div>
        <div class="nav-item" data-target="historial">
          <i class="fa-solid fa-clock-rotate-left"></i><span>Historial de Ventas</span>
        </div>
        <div class="nav-item" data-target="alertas">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>Alertas</span>
          <span class="ml-auto badge badge-red text-xs hidden" id="alert-badge">0</span>
        </div>
        
        <!-- ICONO DE REPORTES CORREGIDO (fa-chart-column) -->
        <div class="nav-item" data-target="reportes">
          <i class="fa-solid fa-chart-column"></i><span>Reportes</span>
        </div>

        <div class="nav-section">Sistema</div>
        <div class="nav-item" data-target="configuracion">
          <i class="fa-solid fa-sliders"></i><span>Configuración</span>
        </div>
        <div class="nav-item" data-target="usuarios">
          <i class="fa-solid fa-users"></i><span>Usuarios</span>
        </div>
      </div>
    </div>

    <!-- SECCIÓN INFERIOR: CONTADOR DE ACCESOS Y CERRAR SESIÓN -->
    <div style="border-top:1px solid var(--border, #1E293B);">
      
      <!-- Contador de accesos auditados -->
      <div class="px-4 py-3 text-xs flex items-center justify-between" style="background: rgba(15, 23, 42, 0.4); border-bottom: 1px solid var(--border, #1E293B);">
        <div class="flex items-center gap-2 text-slate-400">
          <i class="fa-solid fa-user-check text-sky-400"></i>
          <span>Accesos Auditados:</span>
        </div>
        <span id="sidebar-visitas-count" class="font-bold text-sky-400 bg-sky-950/60 border border-sky-800/50 px-2 py-0.5 rounded-md">
          ...
        </span>
      </div>

      <!-- Botón Cerrar Sesión -->
      <div class="nav-item" style="color:#EF4444;" id="btn-logout">
        <i class="fa-solid fa-right-from-bracket"></i><span>Cerrar Sesión</span>
      </div>
    </div>
  </aside>
  `;
}