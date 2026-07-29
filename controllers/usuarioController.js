import { UsuarioModel } from '../models/usuarioModel.js';
import { renderUsuariosView } from '../views/usuariosView.js';
import { ScadaAlert } from '/config/scadaAlert.js';

export const UsuarioController = {
  container: null,

  async init(container) {
    this.container = container;
    await this.cargarYRenderizar();
    this.bindGlobalEvents();
  },

  async cargarYRenderizar() {
    try {
      const usuarios = await UsuarioModel.obtenerTodos();
      this.container.innerHTML = renderUsuariosView(usuarios);
      this.bindModalEvents();
    } catch (error) {
      this.container.innerHTML = `<div class="p-6 text-red-400">Error al cargar la lista de usuarios.</div>`;
    }
  },

  bindModalEvents() {
    const modal = document.getElementById('modal-user');
    const btnOpen = document.getElementById('btn-open-modal-user');
    const btnClose = document.getElementById('btn-close-modal-user');
    const btnCancel = document.getElementById('btn-cancel-modal-user');
    const form = document.getElementById('form-crear-usuario');

    // Función para mostrar/ocultar el modal
    const toggleModal = (show) => {
      if (modal) {
        if (show) {
          modal.classList.remove('hidden');
          this.limpiarErroresFormulario();
        } else {
          modal.classList.add('hidden');
          form?.reset();
          this.limpiarErroresFormulario();
        }
      }
    };

    btnOpen?.addEventListener('click', () => toggleModal(true));
    btnClose?.addEventListener('click', () => toggleModal(false));
    btnCancel?.addEventListener('click', () => toggleModal(false));

    // Guardar nuevo usuario
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      this.limpiarErroresFormulario();

      const nombre = document.getElementById('user-nombre').value.trim();
      const email = document.getElementById('user-email').value.trim();
      const rol = document.getElementById('user-rol').value;
      const password = document.getElementById('user-password').value;

      // -------------------------------------------------------------
      // 1. VALIDACIONES EN PANTALLA (SIN BLOQUEAR CON MODALES EXTERNOS)
      // -------------------------------------------------------------

      // Validar Nombre (Mínimo 3 letras, sin números)
      if (nombre.length < 3 || /\d/.test(nombre)) {
        this.mostrarErrorFormulario('El nombre completo debe tener al menos 3 letras y no contener números.');
        return;
      }

      // Validar Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        this.mostrarErrorFormulario('Ingrese un correo electrónico válido (ej. usuario@dominio.com).');
        return;
      }

      // Validar Contraseña (Mínimo 6 caracteres, 1 mayúscula, 1 número, 1 símbolo)
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
      if (!passwordRegex.test(password)) {
        this.mostrarErrorFormulario('La contraseña requiere: mínimo 6 caracteres, 1 mayúscula, 1 número y 1 símbolo (ej. @, #, $).');
        return;
      }

      const usuarioData = {
        nombre_completo: nombre,
        email: email,
        rol: rol,
        password_hash: password
      };

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<span class="led led-blue"></span> REGISTRANDO...`;
        }

        // 2. Insertar en base de datos
        await UsuarioModel.crear(usuarioData);

        // 3. Cerrar el modal inmediatamente
        toggleModal(false);

        // 4. Feedback con notificación flotante (Toast no bloquea la pantalla)
        ScadaAlert.toast(`Usuario [${usuarioData.nombre_completo}] registrado con éxito`, 'success');

        // 5. Recargar lista
        await this.cargarYRenderizar();

      } catch (error) {
        const mensajeDetalle = error?.message || 'Error al conectar con la base de datos.';
        this.mostrarErrorFormulario(`Fallo al registrar: ${mensajeDetalle}`);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  },

  // Método para mostrar advertencias dentro del mismo modal sin congelar el sistema
  mostrarErrorFormulario(mensaje) {
    let alertBox = document.getElementById('scada-form-error');
    const form = document.getElementById('form-crear-usuario');

    if (!alertBox && form) {
      alertBox = document.createElement('div');
      alertBox.id = 'scada-form-error';
      alertBox.className = 'mb-4 p-3 bg-red-900/40 border border-red-500/50 rounded text-red-300 text-xs font-mono flex items-center gap-2';
      form.insertBefore(alertBox, form.firstChild);
    }

    if (alertBox) {
      alertBox.innerHTML = `<span class="led led-red animate-pulse"></span> <span>${mensaje}</span>`;
      alertBox.classList.remove('hidden');
    }
  },

  limpiarErroresFormulario() {
    const alertBox = document.getElementById('scada-form-error');
    if (alertBox) {
      alertBox.classList.add('hidden');
      alertBox.innerHTML = '';
    }
  },

  bindGlobalEvents() {
    this.container.addEventListener('click', async (e) => {
      const btn = e.target.closest('.btn-toggle-estado');
      if (!btn) return;

      const id = btn.getAttribute('data-id');
      const estaActivo = btn.getAttribute('data-activo') === 'true';
      const accionText = estaActivo ? 'desactivar' : 'activar';
      const accionUpper = accionText.toUpperCase();

      const result = await ScadaAlert.confirm(
        `¿Está seguro de que desea <strong>${accionText}</strong> los permisos de este usuario?`,
        `CONTROL DE ACCESO: ${accionUpper}`,
        `SÍ, ${accionUpper}`
      );

      if (result.isConfirmed) {
        try {
          btn.disabled = true;

          await UsuarioModel.cambiarEstado(id, !estaActivo);
          await this.cargarYRenderizar();

          ScadaAlert.toast(
            `Estado actualizado a: [${!estaActivo ? 'ACTIVO' : 'INACTIVO'}]`,
            'success'
          );

        } catch (err) {
          ScadaAlert.toast(`Error en control de acceso: ${err?.message}`, 'error');
        } finally {
          btn.disabled = false;
        }
      }
    });
  },

  destroy() {
    this.container = null;
  }
};