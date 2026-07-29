// views/tanquesView.js

export const renderTanquesView = () => {
  return `
  <div id="view-tanques" class="page-view p-6 text-white">
    <!-- Encabezado -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-white">Monitor de Tanques</h1>
        <p class="text-xs mt-0.5 text-slate-400">Niveles en tiempo real · Lógica Binaria SCADA</p>
      </div>
      <div class="flex gap-2">
        <button id="btn-sync-tanques" class="btn bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg transition border border-slate-700 flex items-center">
          <i class="fa-solid fa-rotate-right mr-1.5"></i>Sincronizar
        </button>
        <button id="btn-open-recarga-modal" class="btn bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-3 py-2 rounded-lg transition font-medium flex items-center">
          <i class="fa-solid fa-plus mr-1.5"></i>Recarga
        </button>
      </div>
    </div>

    <!-- Grid de Tanques SCADA -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6" id="tanques-grid">
      <!-- Carga dinámica desde el controlador -->
      <div class="col-span-full text-center py-10 text-slate-400">
        <i class="fa-solid fa-spinner fa-spin mr-2"></i> Cargando estado de los tanques...
      </div>
    </div>

    <!-- Leyenda Decodificador Binario SCADA -->
    <div class="bg-slate-900/60 backdrop-blur-md p-5 rounded-xl border border-slate-800">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-sm font-bold text-white uppercase tracking-wider">Decodificador Binario SCADA</h2>
        <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">LÓGICA BINARIA</span>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 00 VACÍO -->
        <div class="p-4 rounded-lg bg-red-950/20 border border-red-900/30">
          <div class="flex items-center gap-1.5 mb-2">
            <span class="w-5 h-5 flex items-center justify-center rounded bg-slate-800 text-xs text-slate-500 font-mono">0</span>
            <span class="w-5 h-5 flex items-center justify-center rounded bg-slate-800 text-xs text-slate-500 font-mono">0</span>
          </div>
          <div class="w-2.5 h-2.5 rounded-full bg-red-500 mb-2 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
          <div class="font-bold text-xs text-red-500">VACÍO</div>
          <div class="text-[11px] text-slate-400 mt-1">Tanque sin combustible · Parada inmediata</div>
        </div>
        <!-- 01 NIVEL BAJO -->
        <div class="p-4 rounded-lg bg-amber-950/20 border border-amber-900/30">
          <div class="flex items-center gap-1.5 mb-2">
            <span class="w-5 h-5 flex items-center justify-center rounded bg-slate-800 text-xs text-slate-500 font-mono">0</span>
            <span class="w-5 h-5 flex items-center justify-center rounded bg-cyan-600 text-xs text-white font-mono">1</span>
          </div>
          <div class="w-2.5 h-2.5 rounded-full bg-amber-500 mb-2 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
          <div class="font-bold text-xs text-amber-500">NIVEL BAJO</div>
          <div class="text-[11px] text-slate-400 mt-1">Menos del 25% · Alerta de reabastecimiento</div>
        </div>
        <!-- 10 NIVEL MEDIO -->
        <div class="p-4 rounded-lg bg-sky-950/20 border border-sky-900/30">
          <div class="flex items-center gap-1.5 mb-2">
            <span class="w-5 h-5 flex items-center justify-center rounded bg-cyan-600 text-xs text-white font-mono">1</span>
            <span class="w-5 h-5 flex items-center justify-center rounded bg-slate-800 text-xs text-slate-500 font-mono">0</span>
          </div>
          <div class="w-2.5 h-2.5 rounded-full bg-sky-400 mb-2 shadow-[0_0_8px_rgba(56,189,248,0.8)]"></div>
          <div class="font-bold text-xs text-sky-400">NIVEL MEDIO</div>
          <div class="text-[11px] text-slate-400 mt-1">25% – 75% · Operación normal</div>
        </div>
        <!-- 11 ÓPTIMO -->
        <div class="p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
          <div class="flex items-center gap-1.5 mb-2">
            <span class="w-5 h-5 flex items-center justify-center rounded bg-cyan-600 text-xs text-white font-mono">1</span>
            <span class="w-5 h-5 flex items-center justify-center rounded bg-cyan-600 text-xs text-white font-mono">1</span>
          </div>
          <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 mb-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          <div class="font-bold text-xs text-emerald-400">ÓPTIMO</div>
          <div class="text-[11px] text-slate-400 mt-1">Más del 75% · Capacidad óptima</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Recarga de Tanque -->
  <div id="modal-recargar-tanque" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center hidden">
    <div class="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 shadow-2xl relative">
      <div class="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-truck-droplet text-cyan-500"></i> Registrar Recarga de Tanque
        </h3>
        <button id="btn-close-recarga-modal" class="text-slate-400 hover:text-white transition">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <form id="form-recargar-tanque" class="space-y-4" novalidate>
        <!-- Selección de Tanque -->
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Tanque a Recargar <span class="text-red-400">*</span></label>
          <select id="recarga-tanque-select" required class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500">
            <option value="">Seleccione un tanque...</option>
          </select>
          <p id="info-capacidad-tanque" class="text-[11px] text-slate-400 mt-1 hidden"></p>
        </div>

        <!-- Litros a Recargar -->
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Litros a Recargar <span class="text-red-400">*</span></label>
          <div class="relative">
            <input type="number" id="recarga-litros" step="0.01" min="1" placeholder="Ej: 5000.00" required
              class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 pr-8" />
            <span class="absolute right-3 top-2 text-xs text-slate-500 font-bold">L</span>
          </div>
        </div>

        <!-- Proveedor -->
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Proveedor / Cisterna <span class="text-red-400">*</span></label>
          <input type="text" id="recarga-proveedor" placeholder="Ej: YPFB Logística" required
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500" />
        </div>

        <!-- Mensaje de Error / Estado -->
        <div id="modal-recarga-error" class="hidden p-2.5 rounded-lg bg-red-950/40 border border-red-800/50 text-red-400 text-xs"></div>

        <!-- Botones de Acción -->
        <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button type="button" id="btn-cancel-recarga" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition">
            Cancelar
          </button>
          <button type="submit" id="btn-submit-recarga" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5">
            <i class="fa-solid fa-floppy-disk"></i> Registrar Recarga
          </button>
        </div>
      </form>
    </div>
  </div>
  `;
};

/**
 * Renderiza la tarjeta visual SCADA de cada tanque según el estado real de la BD
 */
export const renderTanqueCard = (tanque) => {
  const capacidad = parseFloat(tanque.capacidad_total || 0);
  const nivel = parseFloat(tanque.nivel_actual || 0);
  const porcentaje = capacidad > 0 ? Math.min(100, Math.max(0, (nivel / capacidad) * 100)) : 0;
  const pctFormatted = porcentaje.toFixed(0);

  const scada = tanque.codigo_binario_scada || '11';
  const bit1 = scada.charAt(0) || '0';
  const bit2 = scada.charAt(1) || '0';

  // Configuración de colores e indicadores SCADA
  let estadoText = 'ÓPTIMO';
  let estadoClass = 'text-emerald-400 bg-emerald-950/30 border-emerald-800/50';
  let levelColor = '#10B981'; // Verde
  let glowColor = 'rgba(16,185,129,0.3)';

  if (scada === '00') {
    estadoText = 'VACÍO';
    estadoClass = 'text-red-500 bg-red-950/30 border-red-800/50';
    levelColor = '#EF4444';
    glowColor = 'rgba(239,68,68,0.3)';
  } else if (scada === '01') {
    estadoText = 'BAJO';
    estadoClass = 'text-amber-500 bg-amber-950/30 border-amber-800/50';
    levelColor = '#F59E0B';
    glowColor = 'rgba(245,158,11,0.3)';
  } else if (scada === '10') {
    estadoText = 'MEDIO';
    estadoClass = 'text-sky-400 bg-sky-950/30 border-sky-800/50';
    levelColor = '#38BDF8';
    glowColor = 'rgba(56,189,248,0.3)';
  }

  const combustibleNombre = tanque.combustibles_surtirsoft?.nombre || 'Combustible';

  return `
  <div class="bg-slate-900/80 backdrop-blur-md rounded-xl p-5 border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition">
    <!-- Header Tanque -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="font-bold text-white text-base">${tanque.nombre}</h3>
        <p class="text-xs text-slate-400">${combustibleNombre}</p>
      </div>
      <div class="w-2.5 h-2.5 rounded-full" style="background-color: ${levelColor}; box-shadow: 0 0 10px ${glowColor};"></div>
    </div>

    <!-- Indicador SCADA Visual Vertical (Silo/Tanque SCADA) -->
    <div class="my-3 flex justify-center items-center">
      <div class="relative w-28 h-44 rounded-2xl bg-slate-950/80 border-2 border-slate-800 p-1 flex items-end overflow-hidden shadow-inner">
        <!-- Líneas de graduación 50% y 100% -->
        <div class="absolute inset-x-0 top-3 border-b border-slate-800/80 text-[9px] text-slate-600 pr-1 text-right">100%</div>
        <div class="absolute inset-x-0 top-1/2 border-b border-slate-800/80 text-[9px] text-slate-600 pr-1 text-right">50%</div>
        <div class="absolute inset-x-0 bottom-3 border-b border-slate-800/80 text-[9px] text-slate-600 pr-1 text-right">0%</div>

        <!-- Fluido animado con altura dinámica -->
        <div class="w-full rounded-b-xl transition-all duration-1000 relative" 
             style="height: ${porcentaje}%; background: linear-gradient(180deg, ${levelColor}dd 0%, ${levelColor}77 100%); box-shadow: 0 0 15px ${glowColor};">
          <div class="absolute top-0 inset-x-0 h-1 bg-white/40 blur-[1px]"></div>
        </div>
      </div>
    </div>

    <!-- Porcentaje y Capacidad -->
    <div class="text-center my-2">
      <div class="text-2xl font-extrabold font-mono tracking-tight" style="color: ${levelColor};">${pctFormatted}%</div>
      <div class="text-[11px] text-slate-400 font-mono mt-0.5">
        ${nivel.toLocaleString('es-BO')} / ${capacidad.toLocaleString('es-BO')} L
      </div>
    </div>

    <!-- Status Bar SCADA & Bits -->
    <div class="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between">
      <div class="flex items-center gap-1">
        <span class="w-5 h-5 flex items-center justify-center rounded text-xs font-mono font-bold ${bit1 === '1' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-500'}">${bit1}</span>
        <span class="w-5 h-5 flex items-center justify-center rounded text-xs font-mono font-bold ${bit2 === '1' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-500'}">${bit2}</span>
      </div>
      <div class="text-right">
        <span class="text-[10px] font-bold px-2 py-0.5 rounded border ${estadoClass}">${estadoText}</span>
        <div class="text-[9px] text-slate-500 font-mono mt-0.5">Código ${scada}</div>
      </div>
    </div>
  </div>
  `;
};