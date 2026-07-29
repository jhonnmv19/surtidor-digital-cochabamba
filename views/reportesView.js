// views/reportesView.js

export function renderReportesView(kpis = {}) {
  const recaudacion = Number(kpis.totalRecaudado || 0).toFixed(2);
  const volumen = Number(kpis.totalLitros || 0).toFixed(2);
  const transacciones = kpis.totalTransacciones || 0;
  const ticketPromedio = Number(kpis.ticketPromedio || 0).toFixed(2);

  return `
    <div class="p-6 space-y-6">
      
      <!-- 1. Barra superior con botones de exportación -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
        <div>
          <h1 class="text-xl font-bold text-white">Reportes Operativos y Financieros</h1>
          <p class="text-xs text-slate-400 mt-0.5">Análisis dinámico del comportamiento de ventas y despacho</p>
        </div>
        
        <div class="flex items-center gap-2">
          <button id="btn-captura-panel" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer">
            <i class="fa-solid fa-camera"></i>
            <span>Capturar Imagen</span>
          </button>
          
          <button id="btn-export-excel" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer">
            <i class="fa-solid fa-file-excel"></i>
            <span>Excel</span>
          </button>
          
          <button id="btn-export-pdf" class="bg-rose-600 hover:bg-rose-500 text-white text-xs px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer">
            <i class="fa-solid fa-file-pdf"></i>
            <span>PDF</span>
          </button>
        </div>
      </div>

      <!-- 2. Contenedor capturable envuelto con id="panel-reporte-contenido" -->
      <div id="panel-reporte-contenido" class="space-y-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800">

        <!-- Tarjetas KPI Globales -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl">
            <p class="text-xs text-slate-400 font-medium">Recaudación Total</p>
            <p id="kpi-recaudacion" class="text-2xl font-bold text-sky-400 mt-1 font-mono">${recaudacion} Bs</p>
          </div>
          
          <div class="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl">
            <p class="text-xs text-slate-400 font-medium">Volumen Total Despachado</p>
            <p id="kpi-volumen" class="text-2xl font-bold text-emerald-400 mt-1 font-mono">${volumen} L</p>
          </div>
          
          <div class="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl">
            <p class="text-xs text-slate-400 font-medium">Transacciones Registradas</p>
            <p id="kpi-transacciones" class="text-2xl font-bold text-amber-400 mt-1 font-mono">${transacciones}</p>
          </div>
          
          <div class="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl">
            <p class="text-xs text-slate-400 font-medium">Ticket Promedio</p>
            <p id="kpi-ticket" class="text-2xl font-bold text-purple-400 mt-1 font-mono">${ticketPromedio} Bs</p>
          </div>
        </div>

        <!-- Sección de Gráficas principales -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Gráfico Diarios -->
          <div class="lg:col-span-2 bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl">
            <h2 class="text-sm font-semibold text-slate-200 mb-3">Ventas y Volumen (Últimos 7 días)</h2>
            <div id="chart-reporte-diario" class="w-full h-72"></div>
          </div>

          <!-- Gráfico Distribución por Combustible -->
          <div class="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl">
            <h2 class="text-sm font-semibold text-slate-200 mb-3">Ingresos por Tipo de Combustible</h2>
            <div id="chart-reporte-combustible" class="w-full h-72"></div>
          </div>
        </div>

        <!-- Gráfico Anual Mensual -->
        <div class="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl">
          <h2 class="text-sm font-semibold text-slate-200 mb-3">Comportamiento Anual de Ventas (Año Actual)</h2>
          <div id="chart-reporte-mensual" class="w-full h-64"></div>
        </div>

      </div>

    </div>
  `;
}