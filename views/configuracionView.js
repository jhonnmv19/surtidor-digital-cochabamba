// views/configuracionView.js

export function renderConfiguracionView(data = {}) {
  const combustibles = data.combustibles || [];
  const tanques = data.tanques || [];
  const estacion = data.estacion || {};

  const getPrecio = (cod, def) => combustibles.find(c => c.codigo === cod)?.precio_unidad ?? def;
  
  const getCapacidadTanque = (cod, def) => {
    const comb = combustibles.find(c => c.codigo === cod);
    if (!comb) return { id: '', capacidad: def };
    const t = tanques.find(tk => tk.combustible_id === comb.id);
    return t ? { id: t.id, capacidad: t.capacidad_total } : { id: '', capacidad: def };
  };

  const tGE = getCapacidadTanque('GE', 15000);
  const tGP = getCapacidadTanque('GP', 10000);
  const tDO = getCapacidadTanque('DO', 20000);
  const tGNB = getCapacidadTanque('GNB', 5000);

  return `
  <div id="view-configuracion" class="page-view max-w-7xl mx-auto">
    <!-- Header de la sección -->
    <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <i class="fa-solid fa-sliders text-sky-400"></i> Configuración del Sistema
        </h1>
        <p class="text-xs text-slate-400 mt-1">Gestión de parámetros operacionales y sincronización con Supabase</p>
      </div>
    </div>

    <!-- Navegación por Pestañas (Config Tabs) -->
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

    <!-- Tab 1: Precios -->
    <div id="config-precios" class="config-panel">
      <form id="form-config-precios" class="glass-card p-6">
        <div class="mb-5">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-coins text-sky-400"></i> Precios por Litro / m³
          </h3>
          <p class="text-xs text-slate-400">Ajuste de los valores unitarios comercializados en estación.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campo 1: Gasolina Especial */}
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-200">
              Gasolina Especial (GE)
            </label>
            <div class="relative rounded-lg shadow-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span class="text-cyan-400 font-semibold sm:text-sm">Bs</span>
              </div>
              <input
                type="number"
                step="0.01"
                data-codigo="GE"
                value="${getPrecio('GE', 3.74)}"
                className="block w-full rounded-lg border border-slate-700 bg-slate-900/80 pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm transition-all duration-200 outline-none"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Campo 2: Gasolina Premium */}
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-200">
              Gasolina Premium (GP)
            </label>
            <div class="relative rounded-lg shadow-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span class="text-cyan-400 font-semibold sm:text-sm">Bs</span>
              </div>
              <input
                type="number"
                step="0.01"
                data-codigo="GP"
                value="${getPrecio('GP', 4.79)}"
                className="block w-full rounded-lg border border-slate-700 bg-slate-900/80 pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm transition-all duration-200 outline-none"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Campo 3: Diésel Oil */}
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-200">
              Diésel Oil (DO)
            </label>
            <div class="relative rounded-lg shadow-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span class="text-cyan-400 font-semibold sm:text-sm">Bs</span>
              </div>
              <input
                type="number"
                step="0.01"
                data-codigo="DO"
                value="${getPrecio('DO', 3.72)}"
                className="block w-full rounded-lg border border-slate-700 bg-slate-900/80 pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm transition-all duration-200 outline-none"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Campo 4: Gas Natural Vehicular */}
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-200">
              Gas Natural Vehicular (GNB / GNV)
            </label>
            <div class="relative rounded-lg shadow-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span class="text-purple-400 font-semibold sm:text-sm">Bs</span>
              </div>
              <input
                type="number"
                step="0.01"
                data-codigo="GNB"
                value="${getPrecio('GNB', 1.66)}"
                className="block w-full rounded-lg border border-slate-700 bg-slate-900/80 pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm transition-all duration-200 outline-none"
                placeholder="0.00"
                required
              />
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button type="submit" class="btn btn-primary">
            <i class="fa-solid fa-floppy-disk"></i> Guardar Precios
          </button>
        </div>
      </form>
    </div>

        <div class="mt-6 flex justify-end">
          <button type="submit" class="btn btn-primary">
            <i class="fa-solid fa-floppy-disk"></i> Guardar Precios
          </button>
        </div>
      </form>
    </div>

    <!-- Tab 2: Tanques -->
    <div id="config-tanques-config" class="config-panel hidden">
      <form id="form-config-tanques" class="glass-card p-6">
        <div class="mb-5">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-cubes-stacked text-sky-400"></i> Capacidades de Tanques
          </h3>
          <p class="text-xs text-slate-400">Configuración del volumen tope soportado por tanque en almacenamiento.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="form-group">
            <label class="form-label">Tanque GE (Litros)</label>
            <input type="number" data-tanque-id="${tGE.id}" class="scada-input" value="${tGE.capacidad}" step="0.01" required />
          </div>
          <div class="form-group">
            <label class="form-label">Tanque GP (Litros)</label>
            <input type="number" data-tanque-id="${tGP.id}" class="scada-input" value="${tGP.capacidad}" step="0.01" />
          </div>
          <div class="form-group">
            <label class="form-label">Tanque DO (Litros)</label>
            <input type="number" data-tanque-id="${tDO.id}" class="scada-input" value="${tDO.capacidad}" step="0.01" required />
          </div>
          <div class="form-group">
            <label class="form-label">Tanque GNV (m³)</label>
            <input type="number" data-tanque-id="${tGNB.id}" class="scada-input" value="${tGNB.capacidad}" step="0.01" />
          </div>
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
          <p class="text-xs text-slate-400">Información legal y operativa emitida en notas de venta.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="form-group">
            <label class="form-label">Nombre Estación</label>
            <input type="text" id="cfg-nombre" class="scada-input" value="${estacion.nombre_estacion || 'Estación Cochabamba'}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Ubicación / Ciudad</label>
            <input type="text" id="cfg-ubicacion" class="scada-input" value="${estacion.ubicacion || 'Cochabamba, Bolivia'}" required />
          </div>
          <div class="form-group">
            <label class="form-label">NIT</label>
            <input type="text" id="cfg-nit" class="scada-input" value="${estacion.nit || '1234567890'}" />
          </div>
          <div class="form-group">
            <label class="form-label">Teléfono de Contacto</label>
            <input type="text" id="cfg-telefono" class="scada-input" value="${estacion.telefono || '+591 4 4500000'}" />
          </div>
          <div class="form-group md:col-span-2">
            <label class="form-label">Dirección Fiscal</label>
            <input type="text" id="cfg-direccion" class="scada-input" value="${estacion.direccion || estacion.ubicacion || 'Av. Blanco Galindo Km 6, Cochabamba'}" />
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
            <i class="fa-solid fa-server text-sky-400"></i> Estado de Conexión Supabase
          </h3>
          <span class="badge badge-green flex items-center gap-1.5">
            <span class="led led-green"></span> En línea
          </span>
        </div>

        <div class="space-y-4">
          <div>
            <label class="form-label mb-2 block">Tablas Detectadas en la Base de Datos</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              ${[
                'combustibles_surtirsoft',
                'tanques_surtirsoft',
                'surtidores_surtirsoft',
                'ventas_surtirsoft',
                'alertas_surtirsoft',
                'configuracion_estacion_surtirsoft'
              ].map(table => `
                <div class="flex items-center gap-2 p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                  <span class="led led-green"></span>
                  <span class="text-xs text-slate-300 font-mono">${table}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}