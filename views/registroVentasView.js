// views/registroVentasView.js
export function renderRegistroVentasView(surtidores = [], resumenTurno = {}, ultimasVentas = []) {
  return `
    <div class="p-6 text-slate-100 max-w-7xl mx-auto space-y-6">
      
      <!-- Encabezado -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-white">Registro de Ventas</h1>
          <p class="text-sm text-slate-400">Despacho de combustible · Punto de venta</p>
        </div>
        <div class="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/20">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          SISTEMA ACTIVO
        </div>
      </div>

      <!-- Grid Principal -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Formulario de Transacción (2 Columnas) -->
        <div class="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 space-y-5">
          
          <div class="flex justify-between items-center border-b border-slate-800 pb-4">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              </div>
              <div>
                <h2 class="text-base font-semibold text-white">Nueva Transacción</h2>
                <p class="text-xs text-slate-400">Complete todos los campos</p>
              </div>
            </div>
            <span class="text-xs font-mono bg-slate-800 text-sky-400 px-2.5 py-1 rounded-md border border-slate-700">POS-ON</span>
          </div>

          <form id="form-venta" class="space-y-4">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Placa -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Placa del Vehículo</label>
                <input type="text" id="venta-placa" required placeholder="Ej: 1234-ABC" class="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 uppercase">
              </div>

              <!-- Nombre Cliente -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Nombre del Cliente</label>
                <input type="text" id="venta-cliente" placeholder="Sin Nombre / Cliente Varios" class="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Surtidor -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Surtidor</label>
                <select id="venta-surtidor" required class="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500">
                  <option value="">Seleccionar surtidor</option>
                  ${surtidores.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')}
                </select>
              </div>

              <!-- Tipo Combustible (Autocompletado) -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Tipo de Combustible</label>
                <input type="text" id="venta-combustible-nombre" readonly placeholder="Seleccione un surtidor" class="w-full bg-slate-950/40 border border-slate-800/80 rounded-xl px-4 py-3 text-slate-400 focus:outline-none cursor-not-allowed">
                <input type="hidden" id="venta-combustible-id">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Litros / m3 -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5" id="label-cantidad">Litros / m³</label>
                <input type="number" id="venta-cantidad" step="0.01" min="0.1" required placeholder="0.00" class="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-sky-500">
              </div>

              <!-- Precio Unitario -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Precio Unitario (Bs)</label>
                <input type="number" id="venta-precio-unitario" readonly placeholder="0.00" class="w-full bg-slate-950/40 border border-slate-800/80 rounded-xl px-4 py-3 text-slate-400 font-mono cursor-not-allowed focus:outline-none">
              </div>
            </div>

            <!-- Display Total -->
            <div class="bg-slate-950/80 border border-sky-500/20 rounded-2xl p-4 flex justify-between items-center">
              <span class="text-sm font-semibold tracking-wide text-slate-400 uppercase">Total a Cobrar</span>
              <div class="text-right">
                <span class="text-xs font-semibold text-sky-400 mr-1">Bs</span>
                <span id="venta-total-display" class="text-3xl font-extrabold text-sky-400 font-mono tracking-tight">0.00</span>
              </div>
            </div>

            <!-- Método de Pago -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Método de Pago</label>
              <div class="grid grid-cols-3 gap-3">
                <button type="button" data-metodo="efectivo" class="btn-metodo-pago active border border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 rounded-xl p-3 flex flex-col items-center gap-1.5 transition-all text-slate-300">
                  <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  <span class="text-xs font-semibold">EFECTIVO</span>
                </button>
                <button type="button" data-metodo="qr" class="btn-metodo-pago border border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 rounded-xl p-3 flex flex-col items-center gap-1.5 transition-all text-slate-300">
                  <svg class="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
                  <span class="text-xs font-semibold">QR</span>
                </button>
                <button type="button" data-metodo="tarjeta" class="btn-metodo-pago border border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 rounded-xl p-3 flex flex-col items-center gap-1.5 transition-all text-slate-300">
                  <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <span class="text-xs font-semibold">TARJETA</span>
                </button>
              </div>
              <input type="hidden" id="venta-metodo-pago" value="efectivo">
            </div>

            <!-- Botón de Envío -->
            <button type="submit" id="btn-submit-venta" class="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              REGISTRAR VENTA
            </button>
          </form>
        </div>

        <!-- Panel Lateral Derecha: Turno Actual y Últimas Ventas -->
        <div class="space-y-6">
          
          <!-- Turno Actual -->
          <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 class="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">Turno Actual</h2>
            
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-xs text-slate-400">Ventas en turno</span>
                <span class="text-base font-bold text-white font-mono" id="turno-ventas-conteo">${resumenTurno.totalVentas || 0}</span>
              </div>
              <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div class="bg-sky-400 h-full rounded-full" style="width: ${Math.min(resumenTurno.totalVentas || 0, 100)}%"></div>
              </div>

              <div class="flex justify-between items-center pt-2">
                <span class="text-xs text-slate-400">Ingresos turno</span>
                <span class="text-sm font-bold text-emerald-400 font-mono" id="turno-ingresos">Bs ${(resumenTurno.totalIngresos || 0).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-xs text-slate-400">Litros / m³ despachados</span>
                <span class="text-sm font-bold text-amber-400 font-mono" id="turno-litros">${(resumenTurno.totalCantidad || 0).toLocaleString('es-BO', { minimumFractionDigits: 1 })} L</span>
              </div>
            </div>
          </div>

          <!-- Últimas del Turno -->
          <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 class="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">Últimas del Turno</h2>
            
            <div class="space-y-3" id="lista-ultimas-ventas">
              ${ultimasVentas.length === 0 
                ? `<p class="text-xs text-slate-500 py-2">No hay transacciones en el turno actual.</p>`
                : ultimasVentas.map(v => `
                    <div class="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="p-2 bg-slate-800 text-sky-400 rounded-lg">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        </div>
                        <div>
                          <div class="text-xs font-bold text-white">${v.placa_vehiculo} · <span class="text-sky-400">${v.combustibles_surtirsoft?.codigo || 'COMB'}</span></div>
                          <div class="text-[10px] text-slate-400">${v.cantidad} ${v.combustibles_surtirsoft?.unidad_medida || 'L'} · <span class="capitalize">${v.metodo_pago}</span></div>
                        </div>
                      </div>
                      <div class="text-xs font-bold text-sky-400 font-mono">Bs ${Number(v.total_cobrado).toFixed(2)}</div>
                    </div>
                  `).join('')
              }
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}