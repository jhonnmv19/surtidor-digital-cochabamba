// controllers/ventaController.js
import { VentaModel } from '../models/ventaModel.js';
import { renderRegistroVentasView } from '../views/registroVentasView.js';
import { renderHistorialVentasView } from '../views/historialVentasView.js';

export const VentaController = {
  surtidoresData: [],
  turnoActivo: null,
  container: null,
  ventasActuales: [], // Guarda la lista actual para las descargas

  // --- VISTA REGISTRO DE VENTAS ---
  async initRegistro(container) {
    this.container = container;
    
    try {
      const [surtidores, turno] = await Promise.all([
        VentaModel.obtenerSurtidoresYCombustibles(),
        VentaModel.obtenerTurnoActivo()
      ]);

      this.surtidoresData = surtidores || [];
      this.turnoActivo = turno;

      const resumenTurno = await VentaModel.obtenerResumenTurno(this.turnoActivo?.id);
      const ultimasVentas = await VentaModel.obtenerUltimasVentasPorTurno(this.turnoActivo?.id);

      this.container.innerHTML = renderRegistroVentasView(this.surtidoresData, resumenTurno, ultimasVentas);
      this.bindEvents();

    } catch (error) {
      console.error('Error al inicializar Registro de Ventas:', error);
      this.container.innerHTML = `<div class="p-6 text-red-400">Error al cargar datos de ventas.</div>`;
    }
  },

  bindEvents() {
    const selectSurtidor = document.getElementById('venta-surtidor');
    const inputCantidad = document.getElementById('venta-cantidad');
    const formVenta = document.getElementById('form-venta');
    const botonesMetodo = document.querySelectorAll('.btn-metodo-pago');

    if (selectSurtidor) {
      selectSurtidor.addEventListener('change', (e) => {
        const surtidorId = e.target.value;
        const surtidor = this.surtidoresData.find(s => s.id === surtidorId);

        if (surtidor && surtidor.tanques_surtirsoft?.combustibles_surtirsoft) {
          const comb = surtidor.tanques_surtirsoft.combustibles_surtirsoft;
          
          document.getElementById('venta-combustible-nombre').value = `${comb.nombre} (${comb.codigo})`;
          document.getElementById('venta-combustible-id').value = comb.id;
          document.getElementById('venta-precio-unitario').value = comb.precio_unidad;
          document.getElementById('label-cantidad').textContent = `Cantidad (${comb.unidad_medida})`;

          this.calcularTotal();
        } else {
          document.getElementById('venta-combustible-nombre').value = '';
          document.getElementById('venta-combustible-id').value = '';
          document.getElementById('venta-precio-unitario').value = '';
          this.calcularTotal();
        }
      });
    }

    if (inputCantidad) {
      inputCantidad.addEventListener('input', () => this.calcularTotal());
    }

    botonesMetodo.forEach(btn => {
      btn.addEventListener('click', () => {
        botonesMetodo.forEach(b => {
          b.classList.remove('border-sky-500', 'bg-sky-500/10', 'text-sky-400');
          b.classList.add('border-slate-800', 'bg-slate-950/60', 'text-slate-300');
        });

        btn.classList.remove('border-slate-800', 'bg-slate-950/60', 'text-slate-300');
        btn.classList.add('border-sky-500', 'bg-sky-500/10', 'text-sky-400');

        const metodo = btn.getAttribute('data-metodo');
        document.getElementById('venta-metodo-pago').value = metodo;
      });
    });

    if (botonesMetodo.length > 0) {
      botonesMetodo[0].click();
    }

    if (formVenta) {
      formVenta.addEventListener('submit', (e) => this.guardarVenta(e));
    }
  },

  calcularTotal() {
    const cantidad = parseFloat(document.getElementById('venta-cantidad')?.value) || 0;
    const precio = parseFloat(document.getElementById('venta-precio-unitario')?.value) || 0;
    const total = cantidad * precio;

    const totalDisplay = document.getElementById('venta-total-display');
    if (totalDisplay) {
      totalDisplay.textContent = total.toFixed(2);
    }
  },

  async guardarVenta(e) {
    e.preventDefault();
    
    const btnSubmit = document.getElementById('btn-submit-venta');
    if (btnSubmit) btnSubmit.disabled = true;

    try {
      const surtidorId = document.getElementById('venta-surtidor').value;
      const combustibleId = document.getElementById('venta-combustible-id').value;
      const placa = document.getElementById('venta-placa').value.trim().toUpperCase();
      const cliente = document.getElementById('venta-cliente').value.trim() || 'Sin Nombre / Cliente Varios';
      const cantidad = parseFloat(document.getElementById('venta-cantidad').value);
      const precioUnitario = parseFloat(document.getElementById('venta-precio-unitario').value);
      const totalCobrado = cantidad * precioUnitario;
      const metodoPago = document.getElementById('venta-metodo-pago').value;

      if (!surtidorId || !combustibleId || !cantidad || cantidad <= 0) {
        alert('Por favor complete correctamente todos los datos requeridos.');
        if (btnSubmit) btnSubmit.disabled = false;
        return;
      }

      const payloadVenta = {
        surtidor_id: surtidorId,
        combustible_id: combustibleId,
        usuario_id: this.turnoActivo?.usuario_id || null,
        turno_id: this.turnoActivo?.id || null,
        placa_vehiculo: placa,
        nombre_cliente: cliente,
        cantidad: cantidad,
        precio_unitario: precioUnitario,
        total_cobrado: totalCobrado,
        metodo_pago: metodoPago
      };

      await VentaModel.registrarVenta(payloadVenta);
      await this.initRegistro(this.container);

    } catch (error) {
      console.error('Error guardando la venta:', error);
      alert('Ocurrió un error al registrar la venta en la base de datos.');
      if (btnSubmit) btnSubmit.disabled = false;
    }
  },

  // --- VISTA HISTORIAL DE VENTAS ---
  async initHistorial(container) {
    this.container = container;

    try {
      this.container.innerHTML = renderHistorialVentasView();

      const ventas = await VentaModel.obtenerHistorialVentas();
      this.ventasActuales = ventas || [];

      this.renderTablaHistorial(this.ventasActuales);
      this.bindHistorialEvents(ventas || []);

    } catch (error) {
      console.error('Error al inicializar Historial de Ventas:', error);
      this.container.innerHTML = `<div class="p-6 text-red-400">Error al cargar el historial de ventas.</div>`;
    }
  },

  renderTablaHistorial(ventas) {
    const tbody = document.getElementById('hist-table-body');
    const histCount = document.getElementById('hist-count');

    if (!tbody) return;

    if (!ventas || ventas.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="p-4 text-center text-slate-400">No se encontraron registros de ventas.</td></tr>`;
      if (histCount) histCount.textContent = 'Mostrando 0-0 de 0 registros';
      return;
    }

    tbody.innerHTML = ventas.map(v => {
      const fechaFormat = v.fecha_hora ? new Date(v.fecha_hora).toLocaleString('es-BO') : 'N/A';
      const surtidorNombre = v.surtidores_surtirsoft?.nombre || 'S/D';
      const combustibleCod = v.combustibles_surtirsoft?.codigo || 'S/D';
      const unidad = v.combustibles_surtirsoft?.unidad_medida || 'L';

      return `
        <tr class="hover:bg-slate-800/50 transition-colors">
          <td class="p-3 font-mono text-xs text-sky-400">#${v.id}</td>
          <td class="p-3 font-semibold text-white">${v.placa_vehiculo || '—'}</td>
          <td class="p-3">${v.nombre_cliente || 'Cliente Varios'}</td>
          <td class="p-3">${surtidorNombre}</td>
          <td class="p-3"><span class="px-2 py-0.5 rounded text-xs bg-slate-800 font-semibold text-slate-300 border border-slate-700">${combustibleCod}</span></td>
          <td class="p-3">${Number(v.cantidad).toFixed(2)} ${unidad}</td>
          <td class="p-3 font-semibold text-emerald-400">${Number(v.total_cobrado).toFixed(2)} Bs</td>
          <td class="p-3 capitalize">${v.metodo_pago || 'Efectivo'}</td>
          <td class="p-3 text-xs text-slate-400">${fechaFormat}</td>
        </tr>
      `;
    }).join('');

    if (histCount) {
      histCount.textContent = `Mostrando 1-${ventas.length} de ${ventas.length} registros`;
    }
  },

  bindHistorialEvents(ventasOriginales) {
    const inputSearch = document.getElementById('hist-search');
    const selectFuel = document.getElementById('hist-fuel');
    const selectPago = document.getElementById('hist-pago');
    const inputDate = document.getElementById('hist-date');
    const btnPdf = document.getElementById('btn-export-pdf');
    const btnExcel = document.getElementById('btn-export-excel');

    const filtrar = () => {
      const q = inputSearch?.value.toLowerCase().trim() || '';
      const fuel = selectFuel?.value || '';
      const pago = selectPago?.value.toLowerCase() || '';
      const date = inputDate?.value || '';

      const filtrados = ventasOriginales.filter(v => {
        const matchSearch = (v.placa_vehiculo || '').toLowerCase().includes(q) ||
                            (v.nombre_cliente || '').toLowerCase().includes(q);
        
        const matchFuel = !fuel || v.combustibles_surtirsoft?.codigo === fuel;
        const matchPago = !pago || (v.metodo_pago || '').toLowerCase() === pago;
        
        let matchDate = true;
        if (date && v.fecha_hora) {
          const fechaVenta = v.fecha_hora.split('T')[0];
          matchDate = fechaVenta === date;
        }

        return matchSearch && matchFuel && matchPago && matchDate;
      });

      this.ventasActuales = filtrados;
      this.renderTablaHistorial(filtrados);
    };

    inputSearch?.addEventListener('input', filtrar);
    selectFuel?.addEventListener('change', filtrar);
    selectPago?.addEventListener('change', filtrar);
    inputDate?.addEventListener('change', filtrar);

    // Eventos de exportación
    btnPdf?.addEventListener('click', () => this.exportarPDF());
    btnExcel?.addEventListener('click', () => this.exportarExcel());
  },

  exportarExcel() {
    if (!this.ventasActuales || this.ventasActuales.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "ID,Placa,Cliente,Surtidor,Combustible,Cantidad,Total (Bs),Metodo Pago,Fecha\n";

    this.ventasActuales.forEach(v => {
      const fechaFormat = v.fecha_hora ? new Date(v.fecha_hora).toLocaleString('es-BO') : '';
      const row = [
        v.id,
        `"${v.placa_vehiculo || ''}"`,
        `"${v.nombre_cliente || ''}"`,
        `"${v.surtidores_surtirsoft?.nombre || ''}"`,
        `"${v.combustibles_surtirsoft?.codigo || ''}"`,
        v.cantidad || 0,
        v.total_cobrado || 0,
        `"${v.metodo_pago || ''}"`,
        `"${fechaFormat}"`
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Historial_Ventas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportarPDF() {
    if (!this.ventasActuales || this.ventasActuales.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    const printWindow = window.open('', '_blank');
    const filasHTML = this.ventasActuales.map(v => `
      <tr>
        <td>#${v.id}</td>
        <td>${v.placa_vehiculo || '—'}</td>
        <td>${v.nombre_cliente || 'Cliente Varios'}</td>
        <td>${v.surtidores_surtirsoft?.nombre || 'S/D'}</td>
        <td>${v.combustibles_surtirsoft?.codigo || 'S/D'}</td>
        <td>${Number(v.cantidad).toFixed(2)}</td>
        <td>${Number(v.total_cobrado).toFixed(2)} Bs</td>
        <td>${v.metodo_pago || 'Efectivo'}</td>
        <td>${v.fecha_hora ? new Date(v.fecha_hora).toLocaleString('es-BO') : ''}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte Historial de Ventas - SurtirSoft</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #1e293b; }
          h2 { margin-bottom: 5px; }
          p { color: #64748b; font-size: 12px; margin-top: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
          th { background-color: #0f172a; color: white; }
          tr:nth-child(even) { background-color: #f8fafc; }
        </style>
      </head>
      <body>
        <h2>Historial de Ventas — SurtirSoft</h2>
        <p>Generado el: ${new Date().toLocaleString('es-BO')}</p>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Placa</th><th>Cliente</th><th>Surtidor</th><th>Combustible</th><th>Cantidad</th><th>Total</th><th>Pago</th><th>Fecha</th>
            </tr>
          </thead>
          <tbody>${filasHTML}</tbody>
        </table>
        <script>
          window.onload = function() { window.print(); window.close(); };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  },

  destroy() {
    this.surtidoresData = [];
    this.turnoActivo = null;
    this.container = null;
    this.ventasActuales = [];
  }
};