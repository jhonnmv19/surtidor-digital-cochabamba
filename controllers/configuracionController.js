import { ConfiguracionModel } from '../models/configuracionModel.js';
import { renderConfiguracionView } from '../views/configuracionView.js';

export const ConfiguracionController = {
  datosActuales: null,

  async init(container) {
    try {
      container.innerHTML = `
        <div class="flex items-center justify-center p-12 text-slate-400 gap-3">
          <i class="fa-solid fa-circle-notch fa-spin text-2xl text-sky-400"></i>
          <span class="text-sm font-medium">Cargando parámetros operacionales...</span>
        </div>
      `;
      
      this.datosActuales = await ConfiguracionModel.obtenerTodo();
      container.innerHTML = renderConfiguracionView(this.datosActuales);
      
      this.bindEvents(container);
    } catch (error) {
      console.error("Error al inicializar configuración:", error);
      container.innerHTML = `
        <div class="m-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3">
          <i class="fa-solid fa-triangle-exclamation text-lg"></i>
          <span>Error al conectar con Supabase. Verifique la conexión a Internet o las políticas de tabla.</span>
        </div>
      `;
    }
  },

  bindEvents(container) {
    const formPrecios = container.querySelector('#form-config-precios');
    if (formPrecios) {
      formPrecios.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.guardarPrecios(formPrecios);
      });
    }

    const formTanques = container.querySelector('#form-config-tanques');
    if (formTanques) {
      formTanques.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.guardarTanques(formTanques);
      });
    }

    const formEstacion = container.querySelector('#form-config-estacion');
    if (formEstacion) {
      formEstacion.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.guardarEstacion(formEstacion);
      });
    }
  },

  async guardarPrecios(form) {
    try {
      const inputs = form.querySelectorAll('input[data-combustible-id]');
      const promesas = [];

      inputs.forEach(input => {
        const id = input.getAttribute('data-combustible-id');
        const precio = input.value;
        if (id && precio !== '') {
          promesas.push(ConfiguracionModel.actualizarPrecioCombustible(id, precio));
        }
      });

      await Promise.all(promesas);
      this.mostrarToast('Precios de combustibles actualizados correctamente', 'success');
    } catch (error) {
      console.error("Error al actualizar precios:", error);
      this.mostrarToast('Error al actualizar precios en la base de datos', 'error');
    }
  },

  async guardarTanques(form) {
    try {
      const inputs = form.querySelectorAll('input[data-tanque-id]');
      const promesas = [];

      inputs.forEach(input => {
        const id = input.getAttribute('data-tanque-id');
        const capacidad = input.value;
        if (id && capacidad !== '') {
          promesas.push(ConfiguracionModel.actualizarCapacidadTanque(id, capacidad));
        }
      });

      await Promise.all(promesas);
      this.mostrarToast('Capacidades de tanques actualizadas con éxito', 'success');
    } catch (error) {
      console.error("Error al actualizar tanques:", error);
      this.mostrarToast('Error al guardar capacidades de tanques', 'error');
    }
  },

  async guardarEstacion(form) {
    try {
      const estacionId = this.datosActuales?.estacion?.id;
      if (!estacionId) {
        this.mostrarToast('No se encontró el ID de la estación para actualizar', 'error');
        return;
      }

      const datos = {
        nombre_estacion: form.querySelector('#cfg-nombre')?.value || '',
        ubicacion: form.querySelector('#cfg-ubicacion')?.value || '',
        telefono: form.querySelector('#cfg-telefono')?.value || '',
        nit: form.querySelector('#cfg-nit')?.value || '',
        direccion: form.querySelector('#cfg-direccion')?.value || ''
      };

      await ConfiguracionModel.actualizarDatosEstacion(estacionId, datos);
      this.mostrarToast('Datos de la estación guardados exitosamente', 'success');
    } catch (error) {
      console.error("Error al actualizar datos de la estación:", error);
      this.mostrarToast('Error al guardar datos de la estación', 'error');
    }
  },

  mostrarToast(mensaje, tipo = 'success') {
    if (typeof window.showToast === 'function') {
      window.showToast(mensaje, tipo);
    } else {
      alert(mensaje);
    }
  },

  destroy() {
    this.datosActuales = null;
  }
};

window.switchConfigTab = function(tabId, btn) {
  document.querySelectorAll('.config-panel').forEach(panel => panel.classList.add('hidden'));
  document.querySelectorAll('.config-tab').forEach(b => b.classList.remove('active'));

  const target = document.getElementById(`config-${tabId}`);
  if (target) target.classList.remove('hidden');
  if (btn) btn.classList.add('active');
};