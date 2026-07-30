export function renderLogin() {
  return `
  <div id="login-container" class="fixed inset-0 z-[9999] w-screen h-screen flex bg-slate-950 overflow-hidden font-sans animate-boot-in select-none">
    
    <!-- OVERLAY DE ANIMACIÓN SYSTEM STARTUP -->
    <div id="scada-boot-overlay" class="hidden absolute inset-0 z-[10000] bg-slate-950 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
      <div class="absolute inset-0 cyber-grid-bg animate-cyber-lines opacity-20 pointer-events-none"></div>
      <div class="absolute w-[500px] h-[500px] bg-sky-500/20 rounded-full blur-[120px] animate-glow-pulse pointer-events-none"></div>

      <div class="relative flex items-center justify-center mb-8 pointer-events-none">
        <div class="w-28 h-28 rounded-3xl bg-slate-900 border-2 border-sky-500/50 flex items-center justify-center p-4 shadow-[0_0_50px_rgba(14,165,233,0.4)] animate-logo-glow">
          <img src="/imagen/yautja2.png" alt="Logo SurtirSoft" class="w-full h-full object-contain" />
        </div>
        <div class="absolute -inset-3 border-2 border-dashed border-sky-400/30 rounded-[2.5rem] animate-[spin_12s_linear_infinite]"></div>
      </div>

      <h2 class="text-3xl font-extrabold tracking-widest text-white mb-2 pointer-events-none">
        SURTIRSOFT <span class="text-sky-400">SCADA</span>
      </h2>
      <p id="boot-status-text" class="text-xs font-mono text-sky-400 uppercase tracking-widest h-6 pointer-events-none">
        Iniciando Protocolos Telemetría Cochabamba...
      </p>

      <div class="w-72 h-1.5 bg-slate-900 rounded-full mt-6 overflow-hidden border border-slate-800 relative pointer-events-none">
        <div id="boot-progress-bar" class="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 w-0 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(14,165,233,0.9)]"></div>
      </div>
      <span class="text-[10px] text-slate-500 font-mono mt-4 pointer-events-none">ESTACIÓN COCHABAMBA v2.4 — AUTH SYSTEM</span>
    </div>

    <!-- COLUMNA IZQUIERDA: Branding SCADA Industrial -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-slate-900 flex-col justify-between p-12 border-r border-slate-800/80 overflow-hidden pointer-events-none">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl animate-glow-pulse pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-glow-pulse pointer-events-none"></div>
      
      <!-- Fondo de Malla Tecnológica Animada -->
      <div class="absolute inset-0 cyber-grid-bg animate-cyber-lines opacity-30 pointer-events-none"></div>
      <div class="absolute inset-x-0 h-32 bg-gradient-to-b from-sky-500/10 via-sky-400/5 to-transparent animate-scanline pointer-events-none"></div>

      <!-- Header Marca -->
      <div class="relative z-10 flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-slate-900/80 border border-sky-500/40 flex items-center justify-center p-1.5 shadow-lg shadow-sky-500/20 backdrop-blur-md">
          <img src="/imagen/yautja2.png" alt="Logo SurtirSoft" class="w-full h-full object-contain animate-logo-glow" />
        </div>
        <div>
          <h1 class="text-lg font-bold tracking-wider text-white">SURTIRSOFT <span class="text-sky-400">SCADA</span></h1>
          <p class="text-[10px] text-slate-400 tracking-widest uppercase">Sistema de Control Industrial</p>
        </div>
      </div>

      <!-- Presentación Central -->
      <div class="relative z-10 my-auto space-y-6 max-w-lg">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(14,165,233,0.2)]">
          <span class="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
          Estación Cochabamba v2.4
        </div>
        
        <h2 class="text-4xl font-extrabold text-white tracking-tight leading-tight">
          El Surtidor <br/>
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500">Cochabambino</span>
        </h2>
        
        <p class="text-slate-400 text-sm leading-relaxed">
          Plataforma de telemetría y monitoreo automatizado en tiempo real para surtidores, tanques de combustible, registro operacional de ventas y control de seguridad.
        </p>

        <!-- Indicadores SCADA -->
        <div class="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
          <div class="bg-slate-950/70 p-3 rounded-xl border border-slate-800 hover:border-sky-500/40 transition-all group">
            <span class="block text-[11px] text-slate-500 group-hover:text-slate-400">Tanques</span>
            <span class="text-xs font-bold text-sky-400">Monitoreo 24/7</span>
          </div>
          <div class="bg-slate-950/70 p-3 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-all group">
            <span class="block text-[11px] text-slate-500 group-hover:text-slate-400">Ventas</span>
            <span class="text-xs font-bold text-emerald-400">Auditoría Live</span>
          </div>
          <div class="bg-slate-950/70 p-3 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all group">
            <span class="block text-[11px] text-slate-500 group-hover:text-slate-400">Alertas</span>
            <span class="text-xs font-bold text-amber-400">Telemetría</span>
          </div>
        </div>
      </div>

      <!-- Footer Marca -->
      <div class="relative z-10 text-xs text-slate-500 flex items-center justify-between">
        <span>&copy; 2026 SurtirSoft Cochabamba</span>
        <span class="flex items-center gap-1.5"><i class="fa-solid fa-signal text-emerald-500 text-[10px] animate-pulse"></i> Sistema En Línea</span>
      </div>
    </div>

    <!-- COLUMNA DERECHA: Tarjeta de Acceso Holográfica -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-slate-950 relative overflow-hidden">
      
      <!-- Fondo de Líneas Cyber para el lado del formulario (Desactivada la interacción) -->
      <div class="absolute inset-0 cyber-grid-bg animate-cyber-lines opacity-20 pointer-events-none"></div>
      <div class="absolute w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <!-- Tarjeta Holográfica Contenedora -->
      <div class="w-full max-w-md p-8 rounded-3xl neon-glass-card space-y-7 transition-all relative z-50">
        
        <!-- Header del Formulario con LOGO Animado -->
        <div class="text-center space-y-3 pointer-events-none">
          <div class="relative inline-flex items-center justify-center">
            <div class="absolute w-20 h-20 bg-sky-500/30 rounded-full blur-xl animate-pulse"></div>
            <div class="relative w-20 h-20 rounded-2xl bg-slate-900 border border-sky-500/40 flex items-center justify-center p-3 shadow-2xl shadow-sky-500/30 animate-logo-glow">
              <img src="/imagen/yautja2.png" alt="Logo SurtirSoft" class="w-full h-full object-contain" />
            </div>
          </div>

          <div>
            <h2 class="text-2xl font-black text-white tracking-tight">
              SURTIRSOFT <span class="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">SCADA</span>
            </h2>
            <p class="text-[11px] font-mono text-sky-400/80 uppercase tracking-widest mt-1">
              [ Autenticación de Operador ]
            </p>
          </div>
        </div>

        <!-- Formulario (Elevar z-index para garantizar clics) -->
        <form id="form-login" class="space-y-4 relative z-50">
          <div>
            <label class="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Usuario / Operador</span>
              <span class="text-[9px] text-sky-400 font-normal">SYS_ID READY</span>
            </label>
            <div class="relative group">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500 group-focus-within:text-sky-400 transition-colors">
                <i class="fa-solid fa-user-gear text-sm"></i>
              </span>
              <input type="text" id="login-user" value="operador@surtidor.bo" class="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all font-mono shadow-inner cursor-text relative z-50" placeholder="usuario@surtidor.bo" required />
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Contraseña</span>
              <span class="text-[9px] text-slate-500">ENCRYPTED</span>
            </label>
            <div class="relative group">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500 group-focus-within:text-sky-400 transition-colors">
                <i class="fa-solid fa-key text-sm"></i>
              </span>
              <input type="password" id="login-password" value="••••••••" class="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all font-mono shadow-inner cursor-text relative z-50" placeholder="••••••••" required />
            </div>
          </div>

          <!-- Botón de Ingreso Principal -->
          <button id="btn-submit-login" type="submit" class="relative z-50 cursor-pointer overflow-hidden w-full py-3.5 px-4 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-sm rounded-xl shadow-[0_0_25px_rgba(14,165,233,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98]">
            <span class="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></span>
            <i class="fa-solid fa-right-to-bracket group-hover:translate-x-1 transition-transform pointer-events-none"></i>
            <span class="tracking-wide pointer-events-none">INGRESAR AL SISTEMA</span>
          </button>
        </form>

        <!-- Divisor Cyber -->
        <div class="relative flex py-1 items-center pointer-events-none">
          <div class="flex-grow border-t border-slate-800"></div>
          <span class="flex-shrink mx-3 text-[9px] font-mono uppercase tracking-widest text-slate-500">Evaluación Docente</span>
          <div class="flex-grow border-t border-slate-800"></div>
        </div>

        <!-- Acceso Rápido Demo -->
        <button id="btn-quick-login" type="button" class="relative z-50 cursor-pointer w-full py-3 px-4 bg-slate-900/80 hover:bg-slate-800 text-sky-400 border border-sky-500/30 hover:border-sky-500/60 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm group">
          <i class="fa-solid fa-bolt text-amber-400 animate-pulse group-hover:scale-125 transition-transform pointer-events-none"></i>
          <span class="pointer-events-none">Ingreso Rápido Demo (1-Click)</span>
        </button>

      </div>
    </div>

  </div>
  `;
}