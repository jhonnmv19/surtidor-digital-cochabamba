export function renderConfiguracionView() {
  return `
    <div class="page-view">
      <div class="section-header">
        <h2>Parámetros de Configuración SCADA</h2>
        <div class="line"></div>
      </div>
      <div class="glass-card p-6 max-w-2xl">
        <div class="space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div class="text-sm font-bold text-white">Límite Crítico de Tanque</div>
              <div class="text-xs text-slate-400">Porcentaje mínimo para disparar alerta crítica</div>
            </div>
            <input type="number" value="15" class="bg-slate-900 border border-slate-700 rounded p-1.5 w-20 text-center font-mono text-sm text-white">
          </div>
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div class="text-sm font-bold text-white">Frecuencia de Muestreo (ms)</div>
              <div class="text-xs text-slate-400">Intervalo de refresco de lecturas en vivo</div>
            </div>
            <input type="number" value="1000" class="bg-slate-900 border border-slate-700 rounded p-1.5 w-24 text-center font-mono text-sm text-white">
          </div>
        </div>
      </div>
    </div>
  `;
}