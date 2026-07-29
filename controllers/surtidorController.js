import { surtidorModel } from '../models/surtidorModel.js';
import { surtidoresView } from '../views/surtidoresView.js';

export const SurtidorController = {
  container: null,

  async init(container) {
    this.container = container;
    await this.cargarSurtidores();
  },

  async cargarSurtidores() {
    try {
      // Cargar en paralelo surtidores y tanques para la asignación
      const [surtidores, tanques] = await Promise.all([
        surtidorModel.obtenerTodos(),
        surtidorModel.obtenerTanques()
      ]);

      surtidoresView.render(surtidores, tanques, this.container);
      this.bindEvents();
    } catch (error) {
      console.error("Error al cargar módulo de surtidores:", error);
      if (this.container) {
        this.container.innerHTML = `<div class="p-6 text-red-400 font-semibold">Error al conectar con la base de datos de surtidores.</div>`;
      }
    }
  },

  async alternarEstadoRapido(id, estadoActual) {
    try {
      const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
      await surtidorModel.actualizarEstado(id, nuevoEstado);
      await this.cargarSurtidores();
    } catch (error) {
      alert('Error al alternar estado: ' + error.message);
    }
  },

  bindEvents() {
    const modal = document.getElementById('modal-editar-surtidor');
    const form = document.getElementById('form-editar-surtidor');
    const btnCancelar = document.getElementById('btn-cancelar-modal');
    const btnCancelarX = document.getElementById('btn-cancelar-modal-x');

    // Delegación de eventos para capturar el clic en el botón de edición
    if (this.container) {
      this.container.onclick = (e) => {
        const btnEdit = e.target.closest('[data-action="modificar-estado"]');
        if (btnEdit) {
          const id = btnEdit.getAttribute('data-id');
          const nombre = btnEdit.getAttribute('data-nombre');
          const estado = btnEdit.getAttribute('data-estado');
          const tanqueId = btnEdit.getAttribute('data-tanque');

          const elId = document.getElementById('edit-surtidor-id');
          const elNombre = document.getElementById('edit-surtidor-nombre');
          const elEstado = document.getElementById('edit-surtidor-estado');

          if (elId) elId.value = id;
          if (elNombre) elNombre.value = nombre;
          if (elEstado) elEstado.value = estado;

          surtidoresView.poblarSelectTanques(tanqueId);

          modal?.classList.remove('hidden');
        }
      };
    }

    // Funciones para cerrar modal
    const cerrarModal = () => modal?.classList.add('hidden');
    btnCancelar?.addEventListener('click', cerrarModal);
    btnCancelarX?.addEventListener('click', cerrarModal);

    // Guardar cambios en base de datos
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-surtidor-id')?.value;
        const nombre = document.getElementById('edit-surtidor-nombre')?.value;
        const tanque_id = document.getElementById('edit-surtidor-tanque')?.value;
        const estado = document.getElementById('edit-surtidor-estado')?.value;

        try {
          await surtidorModel.actualizarSurtidor(id, { nombre, tanque_id, estado });
          cerrarModal();
          await this.cargarSurtidores(); // Recargar datos de la vista
        } catch (err) {
          alert('Error al guardar cambios: ' + err.message);
        }
      };
    }
  }
};