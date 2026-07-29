// controllers/usuarioController.js
import { UsuarioModel } from '../models/usuarioModel.js';
import { renderUsuariosView } from '../views/usuariosView.js';
import { ScadaAlert } from '/config/scadaAlert.js';

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

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

  try {
    // 1. Deshabilitar botón y mostrar indicador de carga SCADA
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="led led-blue"></span> REGISTRANDO...`;
    }

    // 2. Petición para crear usuario
    await UsuarioModel.crear(usuarioData);

    // 3. Cerrar el modal y recargar la lista
    toggleModal(false);
    await this.cargarYRenderizar();

    // 4. Alerta de confirmación estilo SCADA
    ScadaAlert.success(
      `Se ha creado correctamente el usuario <strong>${usuarioData.nombre_completo}</strong> (${usuarioData.rol.toUpperCase()}) para su supervisión.`,
      'REGISTRO COMPLETADO'
    );

  } catch (error) {
    // 5. Alerta de error con resaltado para duplicados o fallos
    const mensajeDetalle = error?.message || 'Verifique si el correo electrónico ya se encuentra registrado en el sistema.';
    
    ScadaAlert.error(
      `No se pudo registrar el usuario: ${mensajeDetalle}`,
      'ERROR DE REGISTRO'
    );

  } finally {
    // Restablecer el estado original del botón
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  }
});

   // Delegación de eventos para cambiar estado (Activar/Desactivar)
this.container.querySelectorAll('.btn-toggle-estado').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const id = btn.getAttribute('data-id');
    const estaActivo = btn.getAttribute('data-activo') === 'true';
    const accionText = estaActivo ? 'desactivar' : 'activar';
    const accionUpper = accionText.toUpperCase();

    // 1. Modal de confirmación estilizado estilo SCADA
    const result = await ScadaAlert.confirm(
      `¿Está seguro de que desea <strong>${accionText}</strong> los permisos de acceso para este usuario en el sistema?`,
      `CONTROL DE ACCESO: ${accionUpper}`,
      `SÍ, ${accionUpper}`
    );

    // 2. Si el operador confirma la acción
    if (result.isConfirmed) {
      try {
        // Deshabilitar botón temporalmente
        btn.disabled = true;

        // Actualizar en base de datos
        await UsuarioModel.cambiarEstado(id, !estaActivo);
        
        // Recargar la tabla/lista
        await this.cargarYRenderizar();

        // Feedback flotante de éxito
        ScadaAlert.toast(
          `Estado de usuario actualizado correctamente a: [${!estaActivo ? 'ACTIVO' : 'INACTIVO'}]`,
          'success'
        );

      } catch (err) {
        // Alerta modal de error crítica
        ScadaAlert.error(
          `No se pudo cambiar el estado del usuario: ${err?.message || 'Error en la consulta de base de datos.'}`,
          'FALLO EN CONTROL DE ACCESO'
        );
      } finally {
        btn.disabled = false;
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