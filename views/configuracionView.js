export function renderConfiguracionView(data = {}) {
  const combustibles = data.combustibles || [];
  const tanques = data.tanques || [];
  const estacion = data.estacion || {};

  return `
  <div id="view-configuracion" class="page-view max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <i class="fa-solid fa-sliders text-sky-400"></i> Configuración del Sistema
        </h1>
        <p class="text-xs text-slate-400 mt-1">Gestión de parámetros operacionales sincronizados con Supabase</p>
      </div>
    </div>

    <!-- Pestañas de Navegación -->
    <div class="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-3">
      <button class="config-tab active" onclick="switchConfigTab('precios', this)">
        <i class="fa-solid fa-tags"></i> Precios Combustible
      </button>
      <button class="config-tab" onclick="switchConfigTab('tanques-config', this)">
        <i class="fa-solid fa-database"></i> Capacidad Tanques
      </button>
      <button class="config-tab" onclick="switchConfigTab('estacion', this)">
        <i class="fa-solid fa-gas-station"></i> Datos Estación
      </button>
      <button class="config-tab" onclick="switchConfigTab('supabase', this)">
        <i class="fa-solid fa-network-wired"></i> Estado Supabase
      </button>
    </div>

    <!-- Tab 1: Precios (Renderizado Dinámico) -->
    <div id="config-precios" class="config-panel">
      <form id="form-config-precios" class="glass-card p-6">
        <div class="mb-5">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-coins text-sky-400"></i> Precios por Unidad de Medida
          </h3>
          <p class="text-xs text-slate-400">Valores de venta al público en bolivianos (Bs).</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${combustibles.length > 0 ? combustibles.map(item => `
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-200">
                ${item.nombre} (${item.codigo}) - <span class="text-xs text-slate-400">Por ${item.unidad_medida}</span>
              </label>
              <div class="relative rounded-lg shadow-sm">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span class="text-cyan-400 font-semibold sm:text-sm">Bs</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  data-combustible-id="${item.id}"
                  value="${item.precio_unidad ?? 0}"
                  class="block w-full rounded-lg border border-slate-700 bg-slate-900/80 pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm transition-all duration-200 outline-none"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          `).join('') : `
            <p class="text-sm text-slate-400 col-span-2">No se encontraron combustibles registrados en la base de datos.</p>
          `}
        </div>

        <div class="mt-6 flex justify-end">
          <button type="submit" class="btn btn-primary">
            <i class="fa-solid fa-floppy-disk"></i> Guardar Precios
          </button>
        </div>
      </form>
    </div>

    <!-- Tab 2: Tanques (Renderizado Dinámico) -->
    <div id="config-tanques-config" class="config-panel hidden">
      <form id="form-config-tanques" class="glass-card p-6">
        <div class="mb-5">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-cubes-stacked text-sky-400"></i> Capacidades de Tanques
          </h3>
          <p class="text-xs text-slate-400">Límite tope de volumen por cada tanque en almacenamiento.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          ${tanques.length > 0 ? tanques.map(t => {
            const combNombre = t.combustibles_surtirsoft?.nombre || 'Combustible';
            const um = t.combustibles_surtirsoft?.unidad_medida || 'L';
            return `
              <div class="form-group space-y-2">
                <label class="block text-sm font-medium text-slate-200">
                  ${t.nombre} (${combNombre})
                </label>
                <div class="relative rounded-lg shadow-sm">
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    data-tanque-id="${t.id}" 
                    class="block w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm outline-none" 
                    value="${t.capacidad_total ?? 0}" 
                    required 
                  />
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span class="text-slate-400 font-mono text-xs">${um}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('') : `
            <p class="text-sm text-slate-400 col-span-2">No se encontraron tanques configurados.</p>
          `}
        </div>

        <div class="mt-6 flex justify-end">
          <button type="submit" class="btn btn-primary">
            <i class="fa-solid fa-floppy-disk"></i> Guardar Capacidades
          </button>
        </div>
      </form>
    </div>

    <!-- Tab 3: Estación -->
    <div id="config-estacion" class="config-panel hidden">
      <form id="form-config-estacion" class="glass-card p-6">
        <div class="mb-5">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-id-card text-sky-400"></i> Datos de la Estación
          </h3>
          <p class="text-xs text-slate-400">Información institucional de la estación de servicio.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="form-group">
            <label class="block text-sm font-medium text-slate-200 mb-1">Nombre Estación</label>
            <input type="text" id="cfg-nombre" class="block w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm outline-none" value="${estacion?.nombre_estacion || ''}" required />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-slate-200 mb-1">Ubicación / Ciudad</label>
            <input type="text" id="cfg-ubicacion" class="block w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm outline-none" value="${estacion?.ubicacion || ''}" required />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-slate-200 mb-1">NIT</label>
            <input type="text" id="cfg-nit" class="block w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm outline-none" value="${estacion?.nit || ''}" />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-slate-200 mb-1">Teléfono de Contacto</label>
            <input type="text" id="cfg-telefono" class="block w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm outline-none" value="${estacion?.telefono || ''}" />
          </div>
          <div class="form-group md:col-span-2">
            <label class="block text-sm font-medium text-slate-200 mb-1">Dirección Fiscal</label>
            <input type="text" id="cfg-direccion" class="block w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm outline-none" value="${estacion?.direccion || ''}" />
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button type="submit" class="btn btn-primary">
            <i class="fa-solid fa-floppy-disk"></i> Guardar Datos Estación
          </button>
        </div>
      </form>
    </div>

    <!-- Tab 4: Supabase Status -->
    <div id="config-supabase" class="config-panel hidden">
      <div class="glass-card p-6">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-server text-sky-400"></i> Tablas de Estación Surtirsoft
          </h3>
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Sincronizado
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          ${[
            'combustibles_surtirsoft',
            'tanques_surtirsoft',
            'surtidores_surtirsoft',
            'ventas_surtirsoft',
            'alertas_surtirsoft',
            'configuracion_estacion_surtirsoft',
            'visitas_sistema_surtirsoft'
          ].map(table => `
            <div class="flex items-center gap-2.5 p-3 rounded-lg bg-slate-900/50 border border-slate-800">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span class="text-xs text-slate-300 font-mono">${table}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </div>
  `;
}