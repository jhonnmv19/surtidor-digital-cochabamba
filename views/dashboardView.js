export function renderDashboardView(sales, surtidores) {
  const salesRows = sales.map(s => `
    <tr>
      <td>${s.id}</td>
      <td><span class="font-bold text-white">${s.placa}</span></td>
      <td>${s.cliente}</td>
      <td>${s.combustible}</td>
      <td>${s.litros}</td>
      <td class="font-mono text-white">${s.total}</td>
      <td><span class="badge badge-blue">${s.pago}</span></td>
      <td class="text-xs">${s.hora}</td>
    </tr>
  `).join('');

  const surtidoresCards = surtidores.slice(0, 6).map(st => `
    <div class="glass-card p-3 flex items-center justify-between">
      <div>
        <div class="text-xs font-bold text-white">${st.nombre}</div>
        <div class="text-xs" style="color:#64748B;">${st.tipo}</div>
      </div>
      <span class="badge ${st.estado === 'activo' ? 'badge-green' : st.estado === 'mantenimiento' ? 'badge-yellow' : 'badge-gray'}">${st.estado}</span>
    </div>
  `).join('');

  return `
  <div id="view-dashboard" class="page-view active">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-white">Dashboard Operacional</h1>
        <p class="text-xs mt-0.5" style="color:#64748B;">Vista general en tiempo real · Sistema SCADA</p>
      </div>
      <div class="flex gap-2">
        <span class="badge badge-green"><i class="fa-solid fa-circle text-xs mr-1" style="font-size:0.5rem;"></i>EN LÍNEA</span>
        <button class="btn btn-ghost text-xs" id="btn-refresh-dash"><i class="fa-solid fa-rotate-right mr-1"></i>Actualizar</button>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 kpi-grid">
      <div class="kpi-card" style="--accent-color:#0EA5E9;">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background:rgba(14,165,233,0.15);">
            <i class="fa-solid fa-bolivian-boliviano" style="color:#0EA5E9;"></i>
          </div>
          <span class="badge badge-blue">HOY</span>
        </div>
        <div class="text-2xl font-bold num-display counter" id="kpi-ingresos">Bs 14,280</div>
        <div class="text-xs mt-1" style="color:#64748B;">Ingresos del día</div>
      </div>

      <div class="kpi-card" style="--accent-color:#10B981;">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background:rgba(16,185,129,0.15);">
            <i class="fa-solid fa-receipt" style="color:#10B981;"></i>
          </div>
          <span class="badge badge-green">HOY</span>
        </div>
        <div class="text-2xl font-bold num-display counter" id="kpi-ventas">247</div>
        <div class="text-xs mt-1" style="color:#64748B;">Ventas realizadas</div>
      </div>

      <div class="kpi-card" style="--accent-color:#F59E0B;">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background:rgba(245,158,11,0.15);">
            <i class="fa-solid fa-droplet" style="color:#F59E0B;"></i>
          </div>
          <span class="badge badge-yellow">HOY</span>
        </div>
        <div class="text-2xl font-bold num-display counter" id="kpi-litros">8,450 L</div>
        <div class="text-xs mt-1" style="color:#64748B;">Litros despachados</div>
      </div>

      <div class="kpi-card" style="--accent-color:#EF4444;">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background:rgba(239,68,68,0.15);">
            <i class="fa-solid fa-triangle-exclamation" style="color:#EF4444;"></i>
          </div>
          <span class="badge badge-red">ACTIVAS</span>
        </div>
        <div class="text-2xl font-bold num-display counter" id="kpi-alertas">3</div>
        <div class="text-xs mt-1" style="color:#64748B;">Alertas activas</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <div class="glass-card p-4">
        <h3 class="text-sm font-bold text-white mb-2">Ingresos por Hora</h3>
        <div id="chart-ingresos" style="height:220px;"></div>
      </div>
      <div class="glass-card p-4">
        <h3 class="text-sm font-bold text-white mb-2">Combustible Despachado</h3>
        <div id="chart-combustible" style="height:220px;"></div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <div class="glass-card p-4 lg:col-span-2">
        <div class="section-header">
          <h2>Estado de Surtidores</h2>
          <div class="line"></div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          ${surtidoresCards}
        </div>
      </div>

      <div class="glass-card p-4">
        <div class="section-header">
          <h2>Alertas Recientes</h2>
          <div class="line"></div>
        </div>
        <div id="dash-alerts">
          <div class="alert-item alert-critical">
            <div class="flex items-start gap-2">
              <div class="led led-red mt-1"></div>
              <div>
                <div class="text-xs font-semibold text-white">Tanque GE Bajo</div>
                <div class="text-xs" style="color:#64748B;">Nivel crítico 12%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="glass-card p-4">
      <div class="section-header">
        <h2>Últimas Ventas</h2>
        <div class="line"></div>
      </div>
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Placa</th><th>Cliente</th><th>Combustible</th>
              <th>Litros</th><th>Total</th><th>Pago</th><th>Hora</th>
            </tr>
          </thead>
          <tbody>${salesRows}</tbody>
        </table>
      </div>
    </div>
  </div>
  `;
}