// views/usuariosView.js

export function renderUsuariosView(usuarios = []) {
  const filasUsuarios = usuarios.map(u => {
    // Definición de badges de Rol según BD
    const badgeRol = u.rol === 'administrador' 
      ? '<span class="badge badge-red">Administrador</span>' 
      : '<span class="badge badge-blue">Operador</span>';

    // Estado del usuario
    const badgeEstado = u.activo 
      ? '<span class="badge badge-green">Activo</span>' 
      : '<span class="badge badge-yellow">Inactivo</span>';

    // Formateo de último acceso
    const ultimoAcceso = u.ultimo_acceso 
      ? new Date(u.ultimo_acceso).toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' })
      : 'Sin accesos';

    // Generar avatar dinámico por iniciales
    const iniciales = u.nombre_completo ? u.nombre_completo.substring(0, 2).toUpperCase() : 'US';

    return `
      <tr>
        <td>
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full bg-slate-700 text-cyan-400 font-bold text-xs flex items-center justify-center border border-cyan-500/30">
              ${iniciales}
            </div>
            <span class="font-semibold text-white">${u.nombre_completo}</span>
          </div>
        </td>
        <td class="text-slate-300">${u.email}</td>
        <td>${badgeRol}</td>
        <td class="text-slate-400 text-xs">${ultimoAcceso}</td>
        <td>${badgeEstado}</td>
        <td>
          <button class="btn btn-ghost text-xs btn-toggle-estado" data-id="${u.id}" data-activo="${u.activo}" title="Cambiar estado">
            <i class="fa-solid ${u.activo ? 'fa-user-slash text-red-400' : 'fa-user-check text-green-400'}"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div id="view-usuarios" class="page-view p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-xl font-bold text-white">Gestión de Usuarios</h1>
          <p class="text-xs mt-0.5" style="color:#64748B;">Control de acceso al sistema SurtirSoft</p>
        </div>
        <button class="btn btn-primary text-xs" id="btn-open-modal-user">
          <i class="fa-solid fa-plus mr-1"></i>Nuevo Usuario
        </button>
      </div>

      <!-- Tabla de usuarios -->
      <div class="glass-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="data-table w-full text-left border-collapse">
            <thead>
              <tr class="text-slate-400 border-b border-slate-700 text-xs">
                <th class="p-3">Usuario</th>
                <th class="p-3">Email</th>
                <th class="p-3">Rol</th>
                <th class="p-3">Último Acceso</th>
                <th class="p-3">Estado</th>
                <th class="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-sm">
              ${usuarios.length > 0 ? filasUsuarios : '<tr><td colspan="6" class="p-4 text-center text-slate-500">No hay usuarios registrados.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Crear Usuario -->
      <div id="modal-user" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center hidden z-50">
        <div class="glass-card w-full max-w-md p-6 rounded-xl border border-slate-700 bg-slate-900/90 shadow-2xl">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-white">Añadir Nuevo Usuario</h3>
            <button id="btn-close-modal-user" class="text-slate-400 hover:text-white">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <form id="form-crear-usuario" class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Nombre Completo</label>
              <input type="text" id="user-nombre" required class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500" placeholder="Ej. Carlos Mamani" />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Correo Electrónico</label>
              <input type="email" id="user-email" required class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500" placeholder="ejemplo@estacion.bo" />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Rol</label>
              <select id="user-rol" class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500">
                <option value="operador">Operador</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Contraseña</label>
              <input type="password" id="user-password" required class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500" placeholder="••••••••" />
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <button type="button" id="btn-cancel-modal-user" class="btn btn-ghost text-xs">Cancelar</button>
              <button type="submit" class="btn btn-primary text-xs">Crear Usuario</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}