import { SurtidorController } from '../controllers/surtidorController.js';

let surtidoresCache = [];
let tanquesCache = [];
let filtroActual = 'all';

export const surtidoresView = {
  render(rawData = [], tanquesData = [], container) {
    tanquesCache = tanquesData;

    // Procesar datos y calcular porcentajes de capacidad de tanque
    surtidoresCache = (rawData || []).map(s => {
      const tanque = s.tanques_surtirsoft || {};
      const nivel = tanque.nivel_actual || 0;
      const capacidad = tanque.capacidad_total || 1;
      const porcentaje = Math.round((nivel / capacidad) * 100);

      return {
        ...s,
        porcentajeTanque: porcentaje,
        despachoHoy: s.despachoHoy || 0
      };
    });

    // Inyectar layout base y modal si no existen aún
    if (container) {
      container.innerHTML = `
        <div class="p-6 space-y-6">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-bold text-white">Gestión de Surtidores</h2>
              <p class="text-xs text-slate-400">Control de estado y asignación de tanques de combustible</p>
            </div>
            
            <div class="flex flex-wrap items-center gap-2">
              <div id="badges-resumen" class="flex gap-2"></div>
            </div>
          </div>

          <!-- Barra de Filtros Rápidos -->
          <div class="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 w-fit">
            <button onclick="window.filterSurtidores('all')" class="px-3 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors">Todos</button>
            <button onclick="window.filterSurtidores('activo')" class="px-3 py-1 rounded-lg text-xs font-semibold text-emerald-400 hover:bg-slate-800 transition-colors">Activos</button>
            <button onclick="window.filterSurtidores('mantenimiento')" class="px-3 py-1 rounded-lg text-xs font-semibold text-amber-400 hover:bg-slate-800 transition-colors">Mantenimiento</button>
            <button onclick="window.filterSurtidores('inactivo')" class="px-3 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors">Inactivos</button>
          </div>

          <!-- Grid de Surtidores -->
          <div id="surtidores-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
        </div>

        <!-- Modal para Editar Surtidor -->
        <div id="modal-editar-surtidor" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center hidden">
          <div class="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-5">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 class="text-lg font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-pen-to-square text-emerald-400"></i> Editar Surtidor
              </h3>
              <button id="btn-cancelar-modal-x" class="text-slate-400 hover:text-white transition-colors text-lg">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form id="form-editar-surtidor" class="space-y-4">
              <input type="hidden" id="edit-surtidor-id" />

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Nombre / Identificador del Surtidor</label>
                <input type="text" id="edit-surtidor-nombre" required 
                       class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Ej. Surtidor 01 (GE)">
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Tanque / Tipo de Combustible Asignado</label>
                <select id="edit-surtidor-tanque" required 
                        class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors">
                  <!-- Opciones cargadas dinámicamente -->
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Estado de Operación</label>
                <select id="edit-surtidor-estado" required 
                        class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors">
                  <option value="activo">ACTIVO</option>
                  <option value="mantenimiento">MANTENIMIENTO</option>
                  <option value="inactivo">INACTIVO</option>
                </select>
              </div>

              <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" id="btn-cancelar-modal" 
                        class="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors">
                  Cancelar
                </button>
                <button type="submit" 
                        class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-lg shadow-emerald-950/50">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      `;
    }

    this.actualizarContadores();
    this.renderGrid();
  },

  actualizarContadores() {
    const activos = surtidoresCache.filter(s => s.estado === 'activo').length;
    const mantenimiento = surtidoresCache.filter(s => s.estado === 'mantenimiento').length;
    const inactivos = surtidoresCache.filter(s => s.estado === 'inactivo').length;

    const badgesContainer = document.getElementById('badges-resumen');
    if (badgesContainer) {
      badgesContainer.innerHTML = `
        <span class="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
          <i class="fa-solid fa-circle text-[0.4rem]"></i>${activos} ACTIVOS
        </span>
        <span class="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
          <i class="fa-solid fa-triangle-exclamation text-[0.6rem]"></i>${mantenimiento} MANTENIMIENTO
        </span>
        <span class="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1.5">
          <i class="fa-solid fa-power-off text-[0.6rem]"></i>${inactivos} INACTIVOS
        </span>
      `;
    }
  },

  renderGrid() {
    const grid = document.getElementById('surtidores-grid');
    if (!grid) return;

    const filtrados = surtidoresCache.filter(s => {
      if (filtroActual === 'all') return true;
      return s.estado === filtroActual;
    });

    if (filtrados.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full p-8 text-center bg-slate-900/40 border border-slate-800/80 rounded-xl text-slate-400">
          No se encontraron surtidores con el filtro seleccionado (<strong>${filtroActual.toUpperCase()}</strong>).
        </div>
      `;
      return;
    }

    grid.innerHTML = filtrados.map(surtidor => {
      const combustible = surtidor.tanques_surtirsoft?.combustibles_surtirsoft?.nombre || 'N/A';
      const unidad = surtidor.tanques_surtirsoft?.combustibles_surtirsoft?.unidad_medida || 'L';
      
      const esActivo = surtidor.estado === 'activo';
      const esMantenimiento = surtidor.estado === 'mantenimiento';
      
      let borderStyle = 'border-emerald-500/40 shadow-emerald-950/20';
      let ledClass = 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]';
      let estadoTexto = 'ACTIVO';
      let badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

      if (esMantenimiento) {
        borderStyle = 'border-amber-500/40 shadow-amber-950/20';
        ledClass = 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]';
        estadoTexto = 'MANTENIMIENTO';
        badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      } else if (!esActivo) {
        borderStyle = 'border-slate-800 bg-slate-900/60 opacity-75';
        ledClass = 'bg-slate-600';
        estadoTexto = 'INACTIVO';
        badgeStyle = 'bg-slate-800 text-slate-400 border-slate-700';
      }

      return `
        <div class="bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border ${borderStyle} transition-all duration-300 flex flex-col justify-between space-y-3">
          <div>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full ${ledClass}"></div>
                <h3 class="font-bold text-white text-base">${surtidor.nombre}</h3>
              </div>
              
              <div class="flex items-center gap-1">
                <button onclick="window.alternarSurtidor('${surtidor.id}', '${surtidor.estado}')" 
                        title="${esActivo ? 'Desactivar Surtidor' : 'Activar Surtidor'}" 
                        class="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                  <i class="fa-solid ${esActivo ? 'fa-circle-pause text-amber-400' : 'fa-circle-play text-emerald-400'}"></i>
                </button>

                <button data-action="modificar-estado" 
                        data-id="${surtidor.id}" 
                        data-nombre="${surtidor.nombre}" 
                        data-estado="${surtidor.estado}"
                        data-tanque="${surtidor.tanque_id}"
                        title="Editar Surtidor"
                        class="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
              </div>
            </div>

            <div class="text-xs text-slate-400 mb-3 flex items-center justify-between">
              <span>Combustible: <strong class="text-slate-200">${combustible}</strong></span>
              <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${badgeStyle}">${estadoTexto}</span>
            </div>

            <div class="mb-2">
              <div class="flex justify-between text-xs mb-1">
                <span class="text-slate-400">Nivel de Tanque</span>
                <span class="text-slate-200 font-mono font-bold">${surtidor.porcentajeTanque}%</span>
              </div>
              <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div class="h-1.5 rounded-full ${surtidor.porcentajeTanque < 25 ? 'bg-red-500' : 'bg-emerald-500'}" 
                     style="width: ${surtidor.porcentajeTanque}%"></div>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
            <span class="text-slate-400"><i class="fa-solid fa-gas-pump mr-1 text-slate-500"></i>Despacho hoy:</span>
            <span class="font-bold font-mono text-emerald-400 text-sm">${(surtidor.despachoHoy || 0).toLocaleString()} ${unidad}</span>
          </div>
        </div>
      `;
    }).join('');
  },

  poblarSelectTanques(selectedTanqueId) {
    const select = document.getElementById('edit-surtidor-tanque');
    if (!select) return;

    select.innerHTML = tanquesCache.map(t => {
      const nomCombust = t.combustibles_surtirsoft?.nombre || 'General';
      const isSelected = t.id === selectedTanqueId ? 'selected' : '';
      return `<option value="${t.id}" ${isSelected}>${t.nombre} (${nomCombust})</option>`;
    }).join('');
  }
};

window.filterSurtidores = (estado) => {
  filtroActual = estado;
  surtidoresView.renderGrid();
};

window.alternarSurtidor = async (id, estadoActual) => {
  await SurtidorController.alternarEstadoRapido(id, estadoActual);
};