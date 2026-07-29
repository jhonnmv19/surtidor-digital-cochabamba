// views/historialVentasView.js
export function renderHistorialVentasView() {
  return `
    <div id="view-historial" class="page-view p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-xl font-bold text-white">Historial de Ventas</h1>
          <p class="text-xs mt-0.5" style="color:#64748B;">Registro completo de transacciones</p>
        </div>
        <div class="flex gap-2">
          <button id="btn-export-pdf" class="btn btn-ghost text-xs cursor-pointer px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">
            <i class="fa-solid fa-file-pdf mr-1 text-red-400"></i>PDF
          </button>
          <button id="btn-export-excel" class="btn btn-success text-xs cursor-pointer px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">
            <i class="fa-solid fa-file-excel mr-1 text-emerald-400"></i>Excel
          </button>
        </div>
      </div>

      <!-- Filtros con fondo oscuro -->
      <div class="glass-card p-4 mb-5 rounded-xl border border-slate-800 bg-slate-900/60">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs" style="color:#64748B;"></i>
            <input type="text" class="form-input pl-8 text-sm w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2.5 focus:border-sky-500 focus:outline-none" placeholder="Buscar placa, cliente..." id="hist-search" />
          </div>

          <select class="form-input text-sm w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2.5 focus:border-sky-500 focus:outline-none cursor-pointer" id="hist-fuel">
            <option value="" class="bg-slate-900 text-slate-200">Todos los combustibles</option>
            <option value="GE" class="bg-slate-900 text-slate-200">GE — Gasolina Especial</option>
            <option value="GP" class="bg-slate-900 text-slate-200">GP — Gasolina Premium</option>
            <option value="DO" class="bg-slate-900 text-slate-200">DO — Diésel Oil</option>
            <option value="GNB" class="bg-slate-900 text-slate-200">GNB — Gas Natural</option>
          </select>

          <select class="form-input text-sm w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2.5 focus:border-sky-500 focus:outline-none cursor-pointer" id="hist-pago">
            <option value="" class="bg-slate-900 text-slate-200">Todos los pagos</option>
            <option value="efectivo" class="bg-slate-900 text-slate-200">Efectivo</option>
            <option value="qr" class="bg-slate-900 text-slate-200">QR</option>
            <option value="tarjeta" class="bg-slate-900 text-slate-200">Tarjeta</option>
          </select>

          <input type="date" class="form-input text-sm w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2.5 focus:border-sky-500 focus:outline-none [color-scheme:dark]" id="hist-date" />
        </div>
      </div>

      <!-- Tabla -->
      <div class="glass-card overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <div class="overflow-x-auto">
          <table class="data-table w-full text-left">
            <thead>
              <tr class="text-xs text-slate-400 border-b border-slate-700 bg-slate-950/40">
                <th class="p-3 cursor-pointer" id="sort-id">ID <i class="fa-solid fa-sort ml-1 opacity-40"></i></th>
                <th class="p-3">Placa</th>
                <th class="p-3">Cliente</th>
                <th class="p-3">Surtidor</th>
                <th class="p-3">Combustible</th>
                <th class="p-3 cursor-pointer" id="sort-litros">Litros <i class="fa-solid fa-sort ml-1 opacity-40"></i></th>
                <th class="p-3 cursor-pointer" id="sort-total">Total <i class="fa-solid fa-sort ml-1 opacity-40"></i></th>
                <th class="p-3">Pago</th>
                <th class="p-3">Fecha</th>
              </tr>
            </thead>
            <tbody id="hist-table-body" class="divide-y divide-slate-800 text-sm text-slate-200">
              <!-- Filas dinámicas -->
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between p-4 border-t border-slate-800">
          <span class="text-xs text-slate-400" id="hist-count">Mostrando 0-0 de 0 registros</span>
          <div class="flex gap-1" id="pagination-btns"></div>
        </div>
      </div>
    </div>
  `;
}