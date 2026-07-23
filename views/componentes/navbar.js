export function renderNavbar() {
  return `
  <header id="header">
    <div class="flex items-center gap-4">
      <button id="toggle-sidebar-btn" class="md:hidden btn btn-ghost p-2">
        <i class="fa-solid fa-bars"></i>
      </button>
      <div class="hidden md:flex items-center gap-3">
        <i class="fa-solid fa-location-dot text-xs" style="color:#0EA5E9;"></i>
        <span class="text-xs" style="color:#64748B;">Cochabamba – Bolivia</span>
        <span style="color:#334155;">|</span>
        <span class="text-xs font-mono" style="color:#CBD5E1;" id="live-clock">00:00:00</span>
        <span class="text-xs" style="color:#64748B;" id="live-date"></span>
      </div>
    </div>

    <div class="hidden lg:block text-center">
      <div class="text-sm font-bold tracking-wide" style="color:#fff;">ESTACIÓN DE SERVICIO — EL SURTIDOR COCHABAMBINO</div>
    </div>

    <div class="flex items-center gap-3">
      <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);">
        <div class="sb-dot led-green led animate-pulse" id="sb-dot"></div>
        <span class="text-xs font-semibold" style="color:#10B981;" id="sb-label">Conectado</span>
      </div>

      <button class="relative btn btn-ghost p-2" id="nav-alert-btn">
        <i class="fa-solid fa-bell text-sm"></i>
        <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold" style="background:#EF4444;color:#fff;">3</span>
      </button>

      <div class="flex items-center gap-2 cursor-pointer">
        <img src="https://i.pinimg.com/1200x/86/d8/bb/86d8bbb2cf99f13b0d16f1f9bd22afd8.jpg" class="w-8 h-8 rounded-full border-2" style="border-color:#334155;" />
        <div class="hidden sm:block">
          <div class="text-xs font-semibold" style="color:#fff;">Operador</div>
          <div class="text-xs" style="color:#64748B;">Admin</div>
        </div>
      </div>
    </div>
  </header>
  `;
}