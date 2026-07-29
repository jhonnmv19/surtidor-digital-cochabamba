// controllers/tanqueController.js
import { renderTanquesView, renderTanqueCard } from '../views/tanquesView.js';
import { TanqueModel } from '../models/tanqueModel.js';
import { supabase } from '../config/supabase.js';
import { ScadaAlert } from '/config/scadaAlert.js';
export const TanqueController = {
  container: null,
  tanquesCache: [],

  /**
   * Método de inicialización invocado directamente por mainController.js
   */
  async init(mainContent) {
    this.container = mainContent;

    // 1. Inyectar la plantilla visual en el contenedor principal
    this.container.innerHTML = renderTanquesView();

    // 2. Asociar los event listeners de los botones e interactividad
    this.bindEvents();

    // 3. Cargar los tanques desde Supabase
    await this.loadTanques();
  },

  /**
   * Carga los tanques desde la base de datos y actualiza la grilla dinámica
   */
  async loadTanques() {
    const grid = document.getElementById('tanques-grid');
    if (!grid) return;

    try {
      grid.innerHTML = `
        <div class="col-span-full text-center py-12 text-slate-400">
          <i class="fa-solid fa-arrows-rotate fa-spin text-xl mb-2 text-cyan-500"></i>
          <p class="text-xs">Sincronizando con los sensores SCADA de Supabase...</p>
        </div>
      `;

      const tanques = await TanqueModel.obtenerTodos();
      this.tanquesCache = tanques || [];

      if (this.tanquesCache.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full text-center py-10 bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400">
            No hay tanques registrados en la base de datos.
          </div>
        `;
        return;
      }

      // Renderizar cada tarjeta de tanque dinámicamente
      grid.innerHTML = this.tanquesCache.map(t => renderTanqueCard(t)).join('');

      // Actualizar el selector del modal de recarga
      this.populateTanqueSelect();

    } catch (error) {
      console.error("Error al cargar los tanques:", error);
      grid.innerHTML = `
        <div class="col-span-full p-4 rounded-lg bg-red-950/30 border border-red-800/50 text-red-400 text-xs text-center">
          Ocurrió un error al cargar la información de los tanques desde la base de datos.
        </div>
      `;
    }
  },

  /**
   * Asocia los eventos de la vista (Botones, Modal, Formulario)
   */
  bindEvents() {
    // Botón de Sincronización
    const btnSync = document.getElementById('btn-sync-tanques');
    if (btnSync) {
      btnSync.addEventListener('click', async () => {
        const icon = btnSync.querySelector('i');
        if (icon) icon.classList.add('fa-spin');
        await this.loadTanques();
        if (icon) setTimeout(() => icon.classList.remove('fa-spin'), 500);
      });
    }

    // Abrir modal de recarga
    const btnOpenModal = document.getElementById('btn-open-recarga-modal');
    if (btnOpenModal) {
      btnOpenModal.addEventListener('click', () => this.openModal());
    }

    // Cerrar modal de recarga
    const btnCloseModal = document.getElementById('btn-close-recarga-modal');
    const btnCancelModal = document.getElementById('btn-cancel-recarga');
    if (btnCloseModal) btnCloseModal.addEventListener('click', () => this.closeModal());
    if (btnCancelModal) btnCancelModal.addEventListener('click', () => this.closeModal());

    // Evento de cambio en la selección del tanque para mostrar espacio disponible
    const selectTanque = document.getElementById('recarga-tanque-select');
    if (selectTanque) {
      selectTanque.addEventListener('change', (e) => this.handleTanqueSelectChange(e.target.value));
    }

    // Submit del formulario de recarga
    const formRecarga = document.getElementById('form-recargar-tanque');
    if (formRecarga) {
      formRecarga.addEventListener('submit', (e) => this.handleRecargaSubmit(e));
    }
  },

  /**
   * Puebla el <select> del modal con los tanques actualmente cargados
   */
  populateTanqueSelect() {
    const select = document.getElementById('recarga-tanque-select');
    if (!select) return;

    select.innerHTML = '<option value="">Seleccione un tanque...</option>' + 
      this.tanquesCache.map(t => `<option value="${t.id}">${t.nombre} (${t.combustibles_surtirsoft?.nombre || 'Combustible'})</option>`).join('');
  },

  /**
   * Muestra la capacidad restante disponible al seleccionar un tanque en el modal
   */
  handleTanqueSelectChange(tanqueId) {
    const infoCapacidad = document.getElementById('info-capacidad-tanque');
    if (!infoCapacidad) return;

    if (!tanqueId) {
      infoCapacidad.classList.add('hidden');
      return;
    }

    const tanque = this.tanquesCache.find(t => t.id === tanqueId);
    if (tanque) {
      const disponible = parseFloat(tanque.capacidad_total) - parseFloat(tanque.nivel_actual);
      infoCapacidad.textContent = `Capacidad actual: ${parseFloat(tanque.nivel_actual).toLocaleString('es-BO')} L / Máx: ${parseFloat(tanque.capacidad_total).toLocaleString('es-BO')} L (Espacio libre: ${disponible.toLocaleString('es-BO')} L)`;
      infoCapacidad.classList.remove('hidden');
    }
  },

  /**
   * Abre el modal de recarga limpiando datos previos
   */
  openModal() {
    const modal = document.getElementById('modal-recargar-tanque');
    const form = document.getElementById('form-recargar-tanque');
    const errDiv = document.getElementById('modal-recarga-error');
    const infoCap = document.getElementById('info-capacidad-tanque');

    if (form) form.reset();
    if (errDiv) errDiv.classList.add('hidden');
    if (infoCap) infoCap.classList.add('hidden');
    if (modal) modal.classList.remove('hidden');
  },

  /**
   * Cierra el modal de recarga
   */
  closeModal() {
    const modal = document.getElementById('modal-recargar-tanque');
    if (modal) modal.classList.add('hidden');
  },

  /**
   * Procesa y valida el registro de la recarga
   */
  async handleRecargaSubmit(e) {
    e.preventDefault();

    const errDiv = document.getElementById('modal-recarga-error');
    const btnSubmit = document.getElementById('btn-submit-recarga');
    if (errDiv) errDiv.classList.add('hidden');

    const tanqueId = document.getElementById('recarga-tanque-select')?.value;
    const litrosVal = document.getElementById('recarga-litros')?.value;
    const proveedorVal = document.getElementById('recarga-proveedor')?.value;

    // 1. Validaciones de presencia
    if (!tanqueId || !litrosVal || !proveedorVal || proveedorVal.trim() === '') {
      this.showModalError('Todos los campos marcados con (*) son obligatorios.');
      return;
    }

    const litros = parseFloat(litrosVal);

    if (isNaN(litros) || litros <= 0) {
      this.showModalError('La cantidad de litros a recargar debe ser un número mayor a cero.');
      return;
    }

    // 2. Validación de capacidad límite
    const tanque = this.tanquesCache.find(t => t.id === tanqueId);
    if (tanque) {
      const capacidadTotal = parseFloat(tanque.capacidad_total);
      const nivelActual = parseFloat(tanque.nivel_actual);
      const espacioDisponible = capacidadTotal - nivelActual;

      if (litros > espacioDisponible) {
        this.showModalError(`No se puede exceder la capacidad del tanque. El espacio máximo disponible es de ${espacioDisponible.toLocaleString('es-BO')} L.`);
        return;
      }
    }

    try {
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Registrando...`;
      }

      // Obtener el ID del usuario actualmente autenticado en Supabase
      const { data: { user } } = await supabase.auth.getUser();
      let usuarioId = user?.id;

      // Si no existe sesión activa, consultar un usuario operador/admin por defecto de la BD
      if (!usuarioId) {
        const { data: usuarios } = await supabase.from('usuarios_surtirsoft').select('id').limit(1);
        if (usuarios && usuarios.length > 0) {
          usuarioId = usuarios[0].id;
        }
      }

      if (!usuarioId) {
        throw new Error('No se pudo identificar al usuario que realiza la operación.');
      }

      // 3. Insertar la recarga (el Trigger de la BD actualizará el nivel y el SCADA)
      await TanqueModel.registrarRecarga({
        tanque_id: tanqueId,
        usuario_id: usuarioId,
        litros_cargados: litros,
        proveedor: proveedorVal
      });

      // 4. Finalizar y sincronizar
      this.closeModal();
      await this.loadTanques();

    } catch (error) {
      console.error('Error al registrar la recarga:', error);
      this.showModalError(error.message || 'Error al guardar la recarga en la base de datos.');
    } finally {
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Registrar Recarga`;
      }
    }
  },

  /**
   * Muestra mensajes de error en el modal de recarga
   */
  showModalError(mensaje) {
    const errDiv = document.getElementById('modal-recarga-error');
    if (errDiv) {
      errDiv.textContent = mensaje;
      errDiv.classList.remove('hidden');
    }
  },

  /**
   * Limpieza de recursos al cambiar de sección
   */
  destroy() {
    this.container = null;
    this.tanquesCache = [];
  }
};