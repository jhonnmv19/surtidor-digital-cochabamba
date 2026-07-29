export function renderLogin() {
  return `
  <div class="fixed inset-0 z-[9999] w-screen h-screen flex bg-slate-950 overflow-hidden font-sans">
    
    <!-- COLUMNA IZQUIERDA: Branding SCADA + SurtirSoft (Pantallas L/XL) -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-slate-900 flex-col justify-between p-12 border-r border-slate-800 overflow-hidden">
      <!-- Efecto de Luz de Fondo SCADA -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <!-- Grid Tecnológico -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      <!-- Header Marca -->
      <div class="relative z-10 flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-slate-800 border border-sky-500/30 flex items-center justify-center p-1.5 shadow-lg shadow-sky-500/10">
          <img src="/imagen/yautja2.png" alt="Logo SurtirSoft" class="w-full h-full object-contain" />
        </div>
        <div>
          <h1 class="text-lg font-bold tracking-wider text-white">SURTIRSOFT <span class="text-sky-400">SCADA</span></h1>
          <p class="text-[10px] text-slate-400 tracking-widest uppercase">Sistema de Control Industrial</p>
        </div>
      </div>

      <!-- Presentación Central -->
      <div class="relative z-10 my-auto space-y-6 max-w-lg">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider">
          <span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
          Estación Cochabamba v2.4
        </div>
        
        <h2 class="text-4xl font-extrabold text-white tracking-tight leading-tight">
          El Surtidor <br/>
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">Cochabambino</span>
        </h2>
        
        <p class="text-slate-400 text-sm leading-relaxed">
          Plataforma de telemetría y monitoreo automatizado en tiempo real para surtidores, tanques de combustible, registro operacional de ventas y control de seguridad.
        </p>

        <!-- Indicadores SCADA -->
        <div class="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
          <div class="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
            <span class="block text-xs text-slate-500">Tanques</span>
            <span class="text-sm font-bold text-sky-400">Monitoreo 24/7</span>
          </div>
          <div class="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
            <span class="block text-xs text-slate-500">Ventas</span>
            <span class="text-sm font-bold text-emerald-400">Auditoría Live</span>
          </div>
          <div class="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
            <span class="block text-xs text-slate-500">Alertas</span>
            <span class="text-sm font-bold text-amber-400">Telemetría</span>
          </div>
        </div>
      </div>

      <!-- Footer Marca -->
      <div class="relative z-10 text-xs text-slate-500 flex items-center justify-between">
        <span>&copy; 2026 SurtirSoft Cochabamba</span>
        <span class="flex items-center gap-1"><i class="fa-solid fa-signal text-emerald-500 text-[10px]"></i> Sistema En Línea</span>
      </div>
    </div>

    <!-- COLUMNA DERECHA: Formulario de Acceso -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-950 relative">
      <div class="w-full max-w-md space-y-8">
        
        <!-- Header Móvil -->
        <div class="lg:hidden text-center space-y-2 mb-6">
          <div class="inline-flex w-16 h-16 rounded-2xl bg-slate-900 border border-sky-500/30 items-center justify-center p-2 mb-2 shadow-lg shadow-sky-500/10">
            <img src="/imagen/yautja2.png" alt="Logo SurtirSoft" class="w-full h-full object-contain" />
          </div>
          <h2 class="text-2xl font-bold text-white">SURTIRSOFT <span class="text-sky-400">SCADA</span></h2>
          <p class="text-xs text-slate-400">El Surtidor Cochabambino</p>
        </div>

        <!-- Título Formulario -->
        <div>
          <h3 class="text-2xl font-bold text-white tracking-tight">Iniciar Sesión</h3>
          <p class="text-xs text-slate-400 mt-1">Ingrese credenciales de operador para acceder al panel industrial.</p>
        </div>

        <!-- Formulario -->
        <form id="form-login" class="space-y-5">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Operador / Usuario</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                <i class="fa-solid fa-user text-sm"></i>
              </span>
              <input type="text" id="login-user" value="operador@surtidor.bo" class="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all" placeholder="usuario@surtidor.bo" required />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Contraseña</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                <i class="fa-solid fa-lock text-sm"></i>
              </span>
              <input type="password" id="login-password" value="••••••••" class="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all" placeholder="••••••••" required />
            </div>
          </div>

          <button type="submit" class="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2">
            <i class="fa-solid fa-right-to-bracket"></i>
            <span>Ingresar al Sistema</span>
          </button>
        </form>

        <!-- Divisor Modo Evaluación -->
        <div class="relative flex py-2 items-center">
          <div class="flex-grow border-t border-slate-800/80"></div>
          <span class="flex-shrink mx-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Evaluación Docente</span>
          <div class="flex-grow border-t border-slate-800/80"></div>
        </div>

        <!-- Acceso Rápido -->
        <button id="btn-quick-login" type="button" class="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-sky-400 border border-sky-500/30 hover:border-sky-500/60 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm">
          <i class="fa-solid fa-bolt text-amber-400 animate-pulse"></i>
          <span>Ingreso Rápido Demo (1-Click)</span>
        </button>

      </div>
    </div>

  </div>
  `;
}