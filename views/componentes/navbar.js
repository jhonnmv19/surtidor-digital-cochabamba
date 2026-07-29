export function renderNavbar() {
  return `
    <header id="header" class="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-40">
      
      <!-- LADO IZQUIERDO: Menú Hamburguesa, Logo Móvil, Ubicación y Reloj -->
      <div class="flex items-center gap-3 sm:gap-4">
        <button id="toggle-sidebar-btn" class="p-2 text-slate-400 hover:text-white lg:hidden btn btn-ghost focus:outline-none">
          <i class="fa-solid fa-bars text-lg"></i>
        </button>

        <!-- Identificador Visual en Navbar para Móviles -->
        <div class="flex items-center gap-2 lg:hidden border-l border-slate-800 pl-3">
          <div class="w-8 h-8 rounded-lg bg-slate-800 border border-sky-500/30 flex items-center justify-center p-1">
            <img src="/imagen/yautja2.png" alt="Logo SurtirSoft" class="w-full h-full object-contain" />
          </div>
          <span class="text-xs font-bold text-white tracking-wider">SURTIRSOFT</span>
        </div>

        <div class="hidden md:flex items-center gap-3 border-l border-slate-800 pl-4">
          <i class="fa-solid fa-location-dot text-xs text-sky-400"></i>
          <span class="text-xs text-slate-400">Cochabamba – Bolivia</span>
          <span class="text-slate-700">|</span>
          <div class="flex flex-col">
            <span id="live-clock" class="text-xs font-mono text-sky-400 font-bold">00:00:00</span>
            <span id="live-date" class="text-[10px] text-slate-500 uppercase">--/--/----</span>
          </div>
        </div>
      </div>

      <!-- CENTRO: Título del Sistema (Desktop) -->
      <div class="hidden lg:block text-center">
        <h1 class="text-sm font-bold tracking-wide text-white uppercase">
          ESTACIÓN DE SERVICIO — EL SURTIDOR COCHABAMBINO
        </h1>
        <span class="text-[10px] text-sky-400 font-semibold tracking-wider">SURTIRSOFT SCADA</span>
      </div>

      <!-- LADO DERECHO: Botón Voz, Estado Conexión, Notificaciones y Usuario -->
      <div class="flex items-center gap-3">

        <!-- BOTÓN DE COMANDO POR VOZ -->
        <button id="btn-voice-command" title="Dictar comando por voz" class="p-2 border border-slate-700 rounded-lg text-slate-300 hover:text-sky-400 hover:border-sky-500/50 transition-all flex items-center gap-2 text-xs font-medium bg-slate-800/40">
          <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
          </svg>
          <span class="hidden sm:inline">Hablar</span>
        </button>

        <!-- ESTADO DE CONEXIÓN -->
        <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
          <div id="sb-dot" class="sb-dot led-green led animate-pulse"></div>
          <span id="sb-label" class="text-xs font-semibold text-emerald-500">Conectado</span>
        </div>

        <!-- BOTÓN DE ALERTAS / NOTIFICACIONES -->
        <button id="nav-alert-btn" data-target="alertas" class="nav-item relative p-2 text-slate-300 hover:text-white transition-colors cursor-pointer">
          <i class="fa-solid fa-bell text-base"></i>
          <span id="nav-alert-badge" class="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">0</span>
        </button>

        <!-- PERFIL DE USUARIO -->
        <div class="flex items-center gap-2 cursor-pointer border-l border-slate-800 pl-3">
          <img src="https://i.pinimg.com/1200x/86/d8/bb/86d8bbb2cf99f13b0d16f1f9bd22afd8.jpg" class="w-8 h-8 rounded-full border-2 border-slate-700 object-cover" alt="Avatar Operador" />
          <div class="hidden sm:block text-left">
            <div class="text-xs font-semibold text-white leading-tight">Operador</div>
            <div class="text-[10px] text-slate-400">Admin</div>
          </div>
        </div>

      </div>
    </header>
  `;
}