export function renderRegistroVentasView(surtidores) {
  const options = surtidores.map(s => `<option value="${s.id}">${s.nombre} - ${s.tipo}</option>`).join('');

  return `
    <div class="page-view">
      <div class="section-header">
        <h2>Registro Directo de Venta</h2>
        <div class="line"></div>
      </div>
      <div class="max-w-xl glass-card p-6 mx-auto">
        <form id="form-venta" class="space-y-4" onsubmit="event.preventDefault();">
          <div>
            <label class="block text-xs font-medium text-slate-400 mb-1">Surtidor Seleccionado</label>
            <select class="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-white focus:outline-none focus:border-sky-500">
              ${options}
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Volumen (Litros)</label>
              <input type="number" step="0.01" class="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-white num-display focus:outline-none focus:border-sky-500" placeholder="0.00">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Monto Total (Bs.)</label>
              <input type="number" step="0.10" class="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-white num-display focus:outline-none focus:border-sky-500" placeholder="0.00">
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-400 mb-1">Placa del Vehículo</label>
            <input type="text" class="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-white focus:outline-none focus:border-sky-500" placeholder="Ej. 1234-XYZ">
          </div>
          <button type="submit" class="btn btn-primary w-full justify-center py-2.5 mt-2">
            Procesar Transacción
          </button>
        </form>
      </div>
    </div>
  `;
}