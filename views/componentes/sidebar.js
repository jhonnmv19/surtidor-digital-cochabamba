export function renderSidebar() {
  return `
  <nav id="sidebar">
    <div class="sidebar-logo">
      <div class="flex items-center gap-3 mb-1">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: linear-gradient(135deg,#0EA5E9,#0284C7);">
          <i class="fa-solid fa-gas-pump text-white text-sm"></i>
        </div>
        <div>
          <div class="text-xs font-bold text-white leading-tight">EL SURTIDOR</div>
          <div class="text-xs" style="color:#0EA5E9;">COCHABAMBINO</div>
        </div>
      </div>
      <div class="text-xs mt-2 px-1" style="color:#475569;">SCADA · Sistema de Control Industrial</div>
    </div>

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
      <div class="nav-item" data-target="reportes">
        <i class="fa-solid fa-file-chart-column"></i><span>Reportes</span>
      </div>

      <div class="nav-section">Sistema</div>
      <div class="nav-item" data-target="configuracion">
        <i class="fa-solid fa-sliders"></i><span>Configuración</span>
      </div>
      <div class="nav-item" data-target="usuarios">
        <i class="fa-solid fa-users"></i><span>Usuarios</span>
      </div>
    </div>

    <!-- SECCIÓN INFERIOR: CONTADOR DE ACCESOS Y CERRAR SESIÓN -->
    <div style="border-top:1px solid var(--border)">
      
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
  </nav>
  `;
}