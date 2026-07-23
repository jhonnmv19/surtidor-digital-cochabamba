export function renderSurtidoresView(surtidores) {
  const list = surtidores.map(st => `
    <div class="surtidor-card ${st.estado === 'activo' ? 'active-state' : st.estado === 'mantenimiento' ? 'maint-state' : 'off-state'}">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-bold text-white">${st.nombre}</span>
        <span class="badge ${st.estado === 'activo' ? 'badge-green' : st.estado === 'mantenimiento' ? 'badge-yellow' : 'badge-gray'}">${st.estado}</span>
      </div>
      <div class="text-xs mb-2" style="color:#CBD5E1;">${st.tipo}</div>
      <div class="text-xs mb-4" style="color:#64748B;">Mangueras: ${st.mangueras}</div>
      <div class="text-xs font-mono mb-4 text-sky-400">Lectura: ${st.lecturaActual}</div>
      <button class="btn btn-ghost w-full justify-center text-xs">Mantenimiento</button>
    </div>
  `).join('');

  return `
  <div id="view-surtidores" class="page-view">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-white">Gestión de Surtidores</h1>
        <p class="text-xs mt-0.5" style="color:#64748B;">Control y monitoreo de dispensadores</p>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      ${list}
    </div>
  </div>
  `;
}