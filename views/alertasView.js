// views/alertasView.js

export function renderAlertasView(activas = [], historial = []) {
  // Conteo por niveles
  const criticas = activas.filter(a => a.nivel === 'critico').length;
  const bajasMedias = activas.filter(a => a.nivel === 'bajo' || a.nivel === 'medio').length;

  // Filas para Alertas Activas
  const rowsActivas = activas.length > 0 
    ? activas.map(a => {
        const origen = a.surtidores_surtirsoft?.nombre || a.tanques_surtirsoft?.nombre || 'General';
        const fechaObj = new Date(a.created_at);
        const fecha = fechaObj.toLocaleDateString('es-BO');
        const hora = fechaObj.toLocaleTimeString('es-BO');
        
        const badgeNivel = a.nivel === 'critico' 
          ? '<span class="badge badge-red">Crítico</span>' 
          : a.nivel === 'medio' 
            ? '<span class="badge badge-yellow">Medio</span>' 
            : '<span class="badge badge-blue">Bajo</span>';

        return `
          <tr class="hover:bg-slate-800/40 border-b border-slate-800/60 transition-colors">
            <td class="font-mono text-xs text-slate-400 py-3 px-4">${a.id.substring(0, 8)}...</td>
            <td class="py-3 px-4">${badgeNivel}</td>
            <td class="font-semibold text-white py-3 px-4">${origen}</td>
            <td class="text-slate-300 py-3 px-4 text-xs">${a.descripcion}</td>
            <td class="text-slate-400 py-3 px-4 text-xs">${fecha}</td>
            <td class="text-slate-400 py-3 px-4 text-xs font-mono">${hora}</td>
            <td class="py-3 px-4"><span class="badge badge-red">Activa</span></td>
            <td class="py-3 px-4 text-center">
              <button class="btn btn-ghost text-xs text-emerald-400 hover:text-emerald-300 btn-resolver-alerta" data-id="${a.id}">
                <i class="fa-solid fa-check mr-1"></i>Resolver
              </button>
            </td>
          </tr>
        `;
      }).join('')
    : `<tr><td colspan="8" class="text-center py-6 text-xs text-slate-500">No hay alertas activas registradas en el sistema.</td></tr>`;

  // Filas para Historial de Alertas
  const rowsHistorial = historial.length > 0 
    ? historial.map(h => {
        const origen = h.surtidores_surtirsoft?.nombre || h.tanques_surtirsoft?.nombre || 'General';
        const fechaObj = new Date(h.fecha_resuelto || h.created_at);
        const fechaHora = `${fechaObj.toLocaleDateString('es-BO')} ${fechaObj.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}`;
        const resueltoPor = h.usuarios_surtirsoft?.nombre_completo || 'Sistema Automático';

        return `
          <tr class="hover:bg-slate-800/20 border-b border-slate-800/40 transition-colors">
            <td class="font-mono text-xs text-slate-500 py-3 px-4">${h.id.substring(0, 8)}...</td>
            <td class="py-3 px-4">
              <span class="text-xs uppercase font-bold text-slate-400">${h.origen_tipo}</span>
            </td>
            <td class="font-medium text-slate-300 py-3 px-4">${origen}</td>
            <td class="text-slate-400 py-3 px-4 text-xs">${h.descripcion}</td>
            <td class="text-slate-400 py-3 px-4 text-xs font-mono">${fechaHora}</td>
            <td class="py-3 px-4 text-xs font-semibold text-sky-400">${resueltoPor}</td>
          </tr>
        `;
      }).join('')
    : `<tr><td colspan="6" class="text-center py-6 text-xs text-slate-500">Historial de alertas vacío.</td></tr>`;

  return `
  <div id="view-alertas" class="page-view active p-6">
    <!-- ENCABEZADO -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-bell text-sky-400"></i> Panel de Alertas SCADA
        </h1>
        <p class="text-xs mt-0.5 text-slate-400">Monitoreo de eventos críticos de tanques y surtidores en tiempo real</p>
      </div>
      <div class="flex gap-2">
        <span class="badge badge-red font-bold" id="active-alert-count">${activas.length} Activas</span>
        <button class="btn btn-ghost text-xs hover:bg-slate-800" id="btn-resolve-all">
          <i class="fa-solid fa-check-double mr-1 text-emerald-400"></i>Resolver Todas
        </button>
      </div>
    </div>

    <!-- TARJETAS DE ESTADÍSTICAS (KPIS) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="kpi-card p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur" style="--accent-color:#EF4444;">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-red-500/10 border border-red-500/20">
            <i class="fa-solid fa-circle-exclamation text-xl text-red-500"></i>
          </div>
          <div>
            <div class="text-2xl font-bold text-white font-mono">${criticas}</div>
            <div class="text-xs text-slate-400 font-medium">Nivel Crítico</div>
          </div>
        </div>
      </div>

      <div class="kpi-card p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur" style="--accent-color:#F59E0B;">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-amber-500/10 border border-amber-500/20">
            <i class="fa-solid fa-triangle-exclamation text-xl text-amber-500"></i>
          </div>
          <div>
            <div class="text-2xl font-bold text-white font-mono">${bajasMedias}</div>
            <div class="text-xs text-slate-400 font-medium">Nivel Bajo / Medio</div>
          </div>
        </div>
      </div>

      <div class="kpi-card p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur" style="--accent-color:#10B981;">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20">
            <i class="fa-solid fa-circle-check text-xl text-emerald-500"></i>
          </div>
          <div>
            <div class="text-2xl font-bold text-white font-mono">${historial.length}</div>
            <div class="text-xs text-slate-400 font-medium">Resueltas</div>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLA DE ALERTAS ACTIVAS -->
    <div class="glass-card rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden mb-6">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
          <span class="text-sm font-bold text-white tracking-wide uppercase">Alertas Activas</span>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-950/60 uppercase text-[10px] text-slate-400 border-b border-slate-800">
            <tr>
              <th class="py-3 px-4">ID</th>
              <th class="py-3 px-4">Tipo</th>
              <th class="py-3 px-4">Origen</th>
              <th class="py-3 px-4">Descripción</th>
              <th class="py-3 px-4">Fecha</th>
              <th class="py-3 px-4">Hora</th>
              <th class="py-3 px-4">Estado</th>
              <th class="py-3 px-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody id="alerts-table">
            ${rowsActivas}
          </tbody>
        </table>
      </div>
    </div>

    <!-- TABLA DE HISTORIAL DE ALERTAS -->
    <div class="glass-card rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between">
        <span class="text-sm font-bold text-white tracking-wide uppercase">Historial de Alertas Resueltas</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-950/60 uppercase text-[10px] text-slate-400 border-b border-slate-800">
            <tr>
              <th class="py-3 px-4">ID</th>
              <th class="py-3 px-4">Tipo</th>
              <th class="py-3 px-4">Origen</th>
              <th class="py-3 px-4">Descripción</th>
              <th class="py-3 px-4">Resuelto El</th>
              <th class="py-3 px-4">Resuelto Por</th>
            </tr>
          </thead>
          <tbody id="alerts-history">
            ${rowsHistorial}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `;
}