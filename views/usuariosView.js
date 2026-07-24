export function renderUsuariosView() {
  return `
    <div class="page-view">
      <div class="section-header">
        <h2>Gestión de Operadores y Accesos</h2>
        <div class="line"></div>
      </div>
      <div class="glass-card overflow-hidden">
        <table class="data-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-bold text-white">Admin Root</td>
              <td><span class="badge badge-blue">Administrador</span></td>
              <td><span class="badge badge-green">Activo</span></td>
              <td><button class="btn btn-ghost text-xs">Editar</button></td>
            </tr>
            <tr>
              <td class="font-bold text-white">Operador Turno A</td>
              <td><span class="badge badge-gray">Operador</span></td>
              <td><span class="badge badge-green">Activo</span></td>
              <td><button class="btn btn-ghost text-xs">Editar</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}