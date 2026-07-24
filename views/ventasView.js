export function renderVentasView(ventas = [], surtidores = []) {
  const listaVentas = Array.isArray(ventas) ? ventas : [];
  const listaSurtidores = Array.isArray(surtidores) ? surtidores : [];

  const surtidoresOptions = listaSurtidores.map(s => 
    `<option value="${s.id}">${s.nombre} (${s.tipo || 'Surtidor'})</option>`
  ).join('');

  const rows = listaVentas.length > 0
    ? listaVentas.map(v => `
        <tr>
          <td class="font-mono">${v.id}</td>
          <td><span class="font-bold text-white">${v.placa || 'S/N'}</span></td>
          <td>${v.cliente || 'Cliente Varios'}</td>
          <td>${v.combustible || '-'}</td>
          <td class="font-mono">${v.litros || 0} L</td>
          <td class="font-mono text-white">Bs ${v.total || 0}</td>
          <td><span class="badge badge-blue">${v.pago || 'EFECTIVO'}</span></td>
          <td class="text-xs">${v.fecha || ''} ${v.hora || ''}</td>
        </tr>
      `).join('')
    : `<tr><td colspan="8" class="text-center py-4 text-slate-500">No se encontraron ventas registradas.</td></tr>`;

  return `
  <div id="view-ventas" class="page-view">
    <div class="mb-6">
      <h1 class="text-xl font-bold text-white">Gestión de Ventas</h1>
      <p class="text-xs text-slate-400 mt-0.5">Registro de dispensación y consulta de historial</p>
    </div>

    <!-- Módulo de Registro -->
    <div class="glass-card p-5 mb-6">
      <h2 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
        <i class="fa-solid fa-gas-pump text-sky-400"></i> Registrar Nueva Venta
      </h2>
      <form id="form-registro-venta" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs text-slate-400 mb-1">Surtidor / Manguera</label>
          <select id="venta-surtidor" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white focus:border-sky-500 outline-none" required>
            <option value="">Seleccione Surtidor</option>
            ${surtidoresOptions}
          </select>
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">Placa Vehículo</label>
          <input type="text" id="venta-placa" placeholder="1234-XYZ" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white focus:border-sky-500 outline-none uppercase" required />
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">Litros Despachados</label>
          <input type="number" step="0.01" id="venta-litros" placeholder="0.00" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white focus:border-sky-500 outline-none" required />
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">Método de Pago</label>
          <select id="venta-pago" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white focus:border-sky-500 outline-none">
            <option value="EFECTIVO">Efectivo</option>
            <option value="QR">QR / Transferencia</option>
            <option value="TARJETA">Tarjeta</option>
          </select>
        </div>
        <div class="sm:col-span-2 lg:col-span-4 flex justify-end">
          <button type="submit" class="btn btn-primary text-xs"><i class="fa-solid fa-check mr-1"></i> Completar Venta</button>
        </div>
      </form>
    </div>

    <!-- Historial -->
    <div class="glass-card p-4">
      <div class="section-header">
        <h2>Historial de Ventas</h2>
        <div class="line"></div>
      </div>
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Placa</th><th>Cliente</th><th>Combustible</th>
              <th>Litros</th><th>Total</th><th>Pago</th><th>Fecha/Hora</th>
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