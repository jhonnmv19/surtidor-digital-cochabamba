export function renderAlertasView(alertas) {
  const list = alertas.map(a => `
    <div class="alert-item ${a.nivel === 'critical' ? 'alert-critical' : 'border-amber-500'} flex items-start justify-between">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="led ${a.nivel === 'critical' ? 'led-red' : 'led-yellow'}"></span>
          <span class="text-sm font-bold text-white">${a.titulo}</span>
          <span class="text-xs text-slate-400 font-mono">| ${a.timestamp}</span>
        </div>
        <p class="text-xs text-slate-300">${a.descripcion}</p>
      </div>
      <button class="btn btn-ghost text-xs">Atender</button>
    </div>
  `).join('');

  return `
    <div class="page-view">
      <div class="section-header">
        <h2>Centro de Eventos y Alertas del Sistema</h2>
        <div class="line"></div>
      </div>
      <div class="space-y-3">
        ${list}
      </div>
    </div>
  `;
}