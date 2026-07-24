export function renderTanquesView(tanques) {
  const cards = tanques.map(t => {
    const porcentaje = Math.round((t.nivelActual / t.capacidad) * 100);
    const colorClass = porcentaje < 20 ? 'bg-red-500' : porcentaje < 50 ? 'bg-amber-500' : 'bg-emerald-500';

    return `
      <div class="glass-card p-5">
        <div class="flex justify-between items-center mb-3">
          <span class="text-sm font-bold text-white">${t.nombre}</span>
          <span class="badge ${porcentaje < 20 ? 'badge-red' : 'badge-green'}">${t.combustible}</span>
        </div>
        <div class="mb-3">
          <div class="flex justify-between text-xs mb-1">
            <span style="color:#CBD5E1;">Nivel de Carga</span>
            <span class="font-mono text-sky-400">${porcentaje}%</span>
          </div>
          <div class="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
            <div class="${colorClass} h-full transition-all duration-500" style="width: ${porcentaje}%"></div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs text-slate-400 border-t border-slate-800 pt-3">
          <div>Actual: <b class="text-white font-mono">${t.nivelActual} L</b></div>
          <div>Capacidad: <b class="text-white font-mono">${t.capacidad} L</b></div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="page-view">
      <div class="section-header">
        <h2>Monitoreo de Tanques de Almacenamiento</h2>
        <div class="line"></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${cards}
      </div>
    </div>
  `;
}