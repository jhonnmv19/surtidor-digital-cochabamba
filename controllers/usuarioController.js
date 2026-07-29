// controllers/usuarioController.js
import { UsuarioModel } from '../models/usuarioModel.js';
import { renderUsuariosView } from '../views/usuariosView.js';

export const UsuarioController = {
  container: null,

  async init(container) {
    this.container = container;
    await this.cargarYRenderizar();
  },

  async cargarYRenderizar() {
    try {
      const usuarios = await UsuarioModel.obtenerTodos();
      this.container.innerHTML = renderUsuariosView(usuarios);
      this.bindEvents();
    } catch (error) {
      this.container.innerHTML = `<div class="p-6 text-red-400">Error al cargar la lista de usuarios.</div>`;
    }
  },

  bindEvents() {
    const modal = document.getElementById('modal-user');
    const btnOpen = document.getElementById('btn-open-modal-user');
    const btnClose = document.getElementById('btn-close-modal-user');
    const btnCancel = document.getElementById('btn-cancel-modal-user');
    const form = document.getElementById('form-crear-usuario');

    // Abrir/Cerrar Modal
    const toggleModal = (show) => {
      if (modal) {
        if (show) modal.classList.remove('hidden');
        else modal.classList.add('hidden');
      }
    };

    btnOpen?.addEventListener('click', () => toggleModal(true));
    btnClose?.addEventListener('click', () => toggleModal(false));
    btnCancel?.addEventListener('click', () => toggleModal(false));

    // Guardar nuevo usuario
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const usuarioData = {
        nombre_completo: document.getElementById('user-nombre').value.trim(),
        email: document.getElementById('user-email').value.trim(),
        rol: document.getElementById('user-rol').value,
        password_hash: document.getElementById('user-password').value // Idealmente aplicar hash
      };

      try {
        await UsuarioModel.crear(usuarioData);
        alert('Se ha creado un nuevo usuario para su supervisión.');
        toggleModal(false);
        await this.cargarYRenderizar(); // Recargar la tabla
      } catch (error) {
        alert('Error al crear el usuario. Verifique si el correo ya existe.');
      }
    });

    // Delegación de eventos para cambiar estado (Activar/Desactivar)
    this.container.querySelectorAll('.btn-toggle-estado').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = btn.getAttribute('data-id');
        const estaActivo = btn.getAttribute('data-activo') === 'true';

        if (confirm(`¿Desea ${estaActivo ? 'desactivar' : 'activar'} este usuario?`)) {
          try {
            await UsuarioModel.cambiarEstado(id, !estaActivo);
            await this.cargarYRenderizar();
          } catch (err) {
            alert('No se pudo cambiar el estado del usuario.');
          }
        }
      });
    });
  },

  destroy() {
    // Limpieza si fuera necesaria
    this.container = null;
  }
};