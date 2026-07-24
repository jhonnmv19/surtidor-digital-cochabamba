export function renderHistorialVentasView(ventas) {
  const rows = ventas.map(v => `
    <tr>
      <td class="font-mono text-xs">${v.id}</td>
      <td class="font-bold text-white">${v.placa}</td>
      <td>${v.cliente}</td>
      <td><span class="badge badge-blue">${v.combustible}</span></td>
      <td class="num-display">${v.litros} L</td>
      <td class="num-display font-bold text-emerald-400">Bs ${v.total}</td>
      <td><span class="badge badge-gray">${v.pago}</span></td>
      <td class="text-xs">${v.hora}</td>
    </tr>
  `).join('');

  return `
    <div class="page-view">
      <div class="section-header">
        <h2>Historial General de Transacciones</h2>
        <div class="line"></div>
      </div>
      <div class="glass-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Placa</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Volumen</th>
                <th>Monto Total</th>
                <th>Pago</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}