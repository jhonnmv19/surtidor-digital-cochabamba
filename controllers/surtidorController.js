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
      // Carga paralela de Surtidores, Tanques y Despachos de hoy
      const [surtidores, tanques, despachosHoyMap] = await Promise.all([
        surtidorModel.obtenerTodos(),
        surtidorModel.obtenerTanques(),
        surtidorModel.obtenerDespachosHoy()
      ]);

      // Inyectar el campo despachoHoy en cada objeto de surtidor
      const surtidoresConDespacho = surtidores.map(s => ({
        ...s,
        despachoHoy: despachosHoyMap[s.id] || 0
      }));

      surtidoresView.render(surtidoresConDespacho, tanques, this.container);
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
      
      ScadaAlert.toast(
        `Surtidor ID #${id} cambiado a [${nuevoEstado.toUpperCase()}]`,
        'success'
      );
    } catch (error) {
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

    const cerrarModal = () => modal?.classList.add('hidden');
    btnCancelar?.addEventListener('click', cerrarModal);
    btnCancelarX?.addEventListener('click', cerrarModal);

    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('edit-surtidor-id')?.value;
        const nombre = document.getElementById('edit-surtidor-nombre')?.value;
        const tanque_id = document.getElementById('edit-surtidor-tanque')?.value;
        const estado = document.getElementById('edit-surtidor-estado')?.value;

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

        try {
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="led led-blue"></span> GUARDANDO...`;
          }

          await surtidorModel.actualizarSurtidor(id, { nombre, tanque_id, estado });
          cerrarModal();
          await this.cargarSurtidores();

          ScadaAlert.toast(
            `Surtidor "${nombre}" actualizado correctamente`,
            'success'
          );
        } catch (err) {
          ScadaAlert.error(
            `No se pudieron guardar los cambios: ${err.message}`,
            'ERROR DE ACTUALIZACIÓN'
          );
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
        }
      };
    }
  }
};