// views/dashboardView.js
export function renderDashboardView(sales = [], surtidores = [], kpis = { ingresos: '0.00 Bs', ventas: 0, litros: '0 L', alertas: 0, visitas: 1 }, alertas = []) {
  const safeSales = Array.isArray(sales) ? sales : [];
  const safeSurtidores = Array.isArray(surtidores) ? surtidores : [];
  const safeAlertas = Array.isArray(alertas) ? alertas : [];

  const salesRows = safeSales.length > 0 ? safeSales.map(s => `
    <tr class="border-b border-slate-700/50 hover:bg-slate-800/40 transition">
      <td class="font-mono text-xs text-sky-400 py-2.5 px-3">${s.id}</td>
      <td class="py-2.5 px-3"><span class="font-bold text-white">${s.placa}</span></td>
      <td class="py-2.5 px-3 text-slate-300 text-xs">${s.cliente}</td>
      <td class="py-2.5 px-3 text-xs"><span class="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-semibold">${s.combustible}</span></td>
      <td class="py-2.5 px-3 text-xs text-slate-200">${s.litros}</td>
      <td class="font-mono text-white py-2.5 px-3 font-semibold">${s.total}</td>
      <td class="py-2.5 px-3"><span class="badge badge-blue text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/50">${s.pago}</span></td>
      <td class="text-xs py-2.5 px-3 text-slate-400">${s.hora}</td>
    </tr>
  `).join('') : `<tr><td colspan="8" class="text-center py-6 text-xs text-slate-500">Sin ventas registradas el día de hoy</td></tr>`;

  const surtidoresCards = safeSurtidores.length > 0 ? safeSurtidores.map(st => `
    <div class="glass-card p-3 flex items-center justify-between bg-slate-800/50 rounded-lg border border-slate-700/50 mb-2">
      <div>
        <div class="text-xs font-bold text-white">${st.nombre}</div>
        <div class="text-xs text-slate-400">${st.tipo}</div>
      </div>
      <span class="text-xs px-2 py-0.5 rounded font-semibold ${
        st.estado === 'activo' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 
        st.estado === 'mantenimiento' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
      }">${st.estado.toUpperCase()}</span>
    </div>
  `).join('') : `<div class="text-xs text-slate-500 p-2">No hay surtidores configurados</div>`;

  const alertasHTML = safeAlertas.length > 0 ? safeAlertas.map(a => `
    <div class="alert-item ${a.nivel === 'critico' ? 'bg-rose-950/40 border-rose-800/50' : 'bg-amber-950/40 border-amber-800/50'} mb-2 p-2.5 rounded border">
      <div class="flex items-start gap-2">
        <div class="w-2 h-2 rounded-full ${a.nivel === 'critico' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'} mt-1.5"></div>
        <div>
          <div class="text-xs font-semibold text-white">${a.descripcion}</div>
          <div class="text-[10px] text-slate-400 mt-0.5">${new Date(a.created_at).toLocaleTimeString('es-BO')}</div>
        </div>
      </div>
    </div>
  `).join('') : `<div class="text-xs text-slate-400 p-2">Sin alertas activas en el sistema</div>`;

  return `
  <div id="view-dashboard" class="page-view active p-4 space-y-6">
    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-white">Dashboard Operacional</h1>
        <p class="text-xs text-slate-400 mt-0.5">Vista general en tiempo real · Sistema SCADA SurtirSoft</p>
      </div>
      <div class="flex gap-2 items-center">
        <span class="badge badge-green bg-emerald-950 text-emerald-400 text-xs px-2.5 py-1 rounded border border-emerald-800/60 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> EN LÍNEA
        </span>
        <button class="btn btn-ghost text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded transition flex items-center gap-1" id="btn-refresh-dash">
          <i class="fa-solid fa-rotate-right"></i> Actualizar
        </button>
      </div>
    </div>

    <!-- KPI GRID -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <div class="kpi-card bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-slate-400">Ingresos Hoy</span>
          <i class="fa-solid fa-bolivian-boliviano text-sky-400"></i>
        </div>
        <div class="text-xl font-bold text-white font-mono" id="kpi-ingresos">${kpis.ingresos}</div>
      </div>

      <div class="kpi-card bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-slate-400">Ventas Realizadas</span>
          <i class="fa-solid fa-receipt text-emerald-400"></i>
        </div>
        <div class="text-xl font-bold text-white font-mono" id="kpi-ventas">${kpis.ventas}</div>
      </div>

      <div class="kpi-card bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-slate-400">Litros Despachados</span>
          <i class="fa-solid fa-droplet text-amber-400"></i>
        </div>
        <div class="text-xl font-bold text-white font-mono" id="kpi-litros">${kpis.litros}</div>
      </div>

      <div class="kpi-card bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-slate-400">Alertas Activas</span>
          <i class="fa-solid fa-triangle-exclamation text-rose-400"></i>
        </div>
        <div class="text-xl font-bold text-white font-mono" id="kpi-alertas">${kpis.alertas}</div>
      </div>

      <div class="kpi-card bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-slate-400">Accesos Auditados</span>
          <i class="fa-solid fa-users-viewfinder text-purple-400"></i>
        </div>
        <div class="text-xl font-bold text-white font-mono" id="kpi-visitas-conteo">${kpis.visitas}</div>
      </div>
    </div>

    <!-- SECCIÓN DE GRÁFICOS -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
  <div class="lg:col-span-2 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 overflow-hidden relative">
    <h3 class="text-sm font-semibold text-white mb-2">Ventas por Hora (Hoy)</h3>
    <div id="chart-ingresos" class="w-full h-48 overflow-hidden"></div>
  </div>
  <div class="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 overflow-hidden relative">
    <h3 class="text-sm font-semibold text-white mb-2">Distribución Surtidores</h3>
    <div id="chart-combustible" class="w-full h-48 overflow-hidden"></div>
  </div>
</div>

    <!-- TABLAS Y ESTADO -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
        <h3 class="text-sm font-semibold text-white mb-3">Últimas Ventas Registradas</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-700 text-xs text-slate-400">
                <th class="py-2 px-3">ID</th>
                <th class="py-2 px-3">Placa</th>
                <th class="py-2 px-3">Cliente</th>
                <th class="py-2 px-3">Combustible</th>
                <th class="py-2 px-3">Cantidad</th>
                <th class="py-2 px-3">Total</th>
                <th class="py-2 px-3">Pago</th>
                <th class="py-2 px-3">Hora</th>
              </tr>
            </thead>
            <tbody>
              ${salesRows}
            </tbody>
          </table>
        </div>
      </div>

      <div class="space-y-4">
        <div class="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
          <h3 class="text-sm font-semibold text-white mb-3">Estado de Surtidores</h3>
          ${surtidoresCards}
        </div>
        <div class="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
          <h3 class="text-sm font-semibold text-white mb-3">Alertas SCADA</h3>
          ${alertasHTML}
        </div>
      </div>
    </div>
  </div>
  `;
}