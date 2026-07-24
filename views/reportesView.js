export function renderReportesView() {
  return `
    <div class="page-view">
      <div class="section-header">
        <h2>Generación de Reportes del Sistema</h2>
        <div class="line"></div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="glass-card p-5 text-center">
          <h3 class="text-sm font-bold text-white mb-2">Ventas Diarias</h3>
          <p class="text-xs text-slate-400 mb-4">Exporta el total acumulado en las últimas 24 horas.</p>
          <button class="btn btn-primary w-full justify-center">Descargar PDF</button>
        </div>
        <div class="glass-card p-5 text-center">
          <h3 class="text-sm font-bold text-white mb-2">Balance de Inventario</h3>
          <p class="text-xs text-slate-400 mb-4">Registro detallado de entrada y salida de combustible.</p>
          <button class="btn btn-primary w-full justify-center">Descargar Excel</button>
        </div>
        <div class="glass-card p-5 text-center">
          <h3 class="text-sm font-bold text-white mb-2">Bitácora SCADA</h3>
          <p class="text-xs text-slate-400 mb-4">Eventos, fallas e incidencias de surtidores.</p>
          <button class="btn btn-ghost w-full justify-center">Exportar CSV</button>
        </div>
      </div>
    </div>
  `;
}