import { surtidorModel } from '../models/surtidorModel.js';
import { surtidoresView } from '../views/surtidoresView.js';
import { ScadaAlert } from '/config/scadaAlert.js';

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
    // 1. Determinar el nuevo estado
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    
    // 2. Actualizar en base de datos / API
    await surtidorModel.actualizarEstado(id, nuevoEstado);
    
    // 3. Recargar la lista/UI
    await this.cargarSurtidores();
    
    // 4. Feedback visual de éxito (Toast discreto en esquina superior derecha)
    ScadaAlert.toast(
      `Surtidor ID #${id} cambiado a [${nuevoEstado.toUpperCase()}]`,
      'success'
    );

  } catch (error) {
    // 5. Alerta modal de error crítica (Sombra resplandeciente roja + LED rojo)
    ScadaAlert.error(
      `No se pudo cambiar el estado del surtidor #${id}: ${error.message}`,
      'FALLO DE CONEXIÓN SCADA'
    );
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
    
    // Captura de valores del formulario
    const id = document.getElementById('edit-surtidor-id')?.value;
    const nombre = document.getElementById('edit-surtidor-nombre')?.value;
    const tanque_id = document.getElementById('edit-surtidor-tanque')?.value;
    const estado = document.getElementById('edit-surtidor-estado')?.value;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

    try {
      // 1. Efecto visual de procesamiento en el botón
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="led led-blue"></span> GUARDANDO...`;
      }

      // 2. Petición para actualizar en base de datos
      await surtidorModel.actualizarSurtidor(id, { nombre, tanque_id, estado });

      // 3. Cerrar el modal de edición
      cerrarModal();

      // 4. Recargar datos de la vista
      await this.cargarSurtidores();

      // 5. Notificación flotante de éxito
      ScadaAlert.toast(
        `Surtidor "${nombre}" actualizado correctamente`,
        'success'
      );

    } catch (err) {
      // 6. Alerta modal de error con estilo SCADA crítico
      ScadaAlert.error(
        `No se pudieron guardar los cambios: ${err.message}`,
        'ERROR DE ACTUALIZACIÓN'
      );

    } finally {
      // Restablecer el estado original del botón
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  };

    }
  }
};