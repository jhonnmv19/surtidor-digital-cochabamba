// controllers/reporteController.js
import { ReporteModel } from '../models/reporteModel.js';
import { renderReportesView } from '../views/reportesView.js';
import { ScadaAlert } from '/config/scadaAlert.js';

export const ReporteController = {
  async init(container) {
    try {
      // 1. Carga dinámica de librerías externas para exportación
      await this.cargarLibreriasExternas();

      // 2. Obtener todos los datos del modelo de forma paralela
      const [kpis, diarios, mensuales, porCombustible] = await Promise.all([
        ReporteModel.obtenerResumenKPIs(),
        ReporteModel.obtenerIngresosDiarios(7),
        ReporteModel.obtenerIngresosMensuales(),
        ReporteModel.obtenerVentasPorCombustible()
      ]);

      // 3. Renderizar estructura de la vista
      container.innerHTML = renderReportesView(kpis);

      // 4. Renderizar gráficos Plotly dinámicos
      this.renderCharts(diarios, mensuales, porCombustible);

      // 5. Conectar eventos de exportación a los botones
      this.bindExportEvents();

    } catch (error) {
      console.error('Error al inicializar la vista de Reportes:', error);
      container.innerHTML = `<div class="p-6 text-red-400">Error al cargar los reportes dinámicos.</div>`;
    }
  },

  /**
   * Carga scripts CDN bajo demanda si no existen previamente en el entorno window
   */
  async cargarLibreriasExternas() {
    if (!window.html2canvas) {
      await this.cargarScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    }
    if (!window.jspdf) {
      await this.cargarScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    }
    if (!window.XLSX) {
      await this.cargarScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
    }
  },

  cargarScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      document.head.appendChild(script);
    });
  },

  /**
   * Vincula los botones de la vista con sus correspondientes funciones de descarga
   */
  bindExportEvents() {
    document.getElementById('btn-captura-panel')?.addEventListener('click', () => this.capturarPanel());
    document.getElementById('btn-export-pdf')?.addEventListener('click', () => this.exportarPDF());
    document.getElementById('btn-export-excel')?.addEventListener('click', () => this.exportarExcel());
  },

  /**
   * Captura el contenedor del reporte como imagen PNG de alta calidad
   */
  async capturarPanel() {
    const panel = document.getElementById('panel-reporte-contenido');
    if (!panel) return;

    const canvas = await html2canvas(panel, { scale: 2, backgroundColor: '#0f172a' });
    const link = document.createElement('a');
    link.download = `Reporte_SurtirSoft_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  },

  /**
   * Exporta la vista del reporte a formato PDF respetando las dimensiones A4
   */
  async exportarPDF() {
    const panel = document.getElementById('panel-reporte-contenido');
    if (!panel) return;

    const canvas = await html2canvas(panel, { scale: 2, backgroundColor: '#0f172a' });
    const imgData = canvas.toDataURL('image/png');

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`Reporte_SurtirSoft_${new Date().toISOString().slice(0, 10)}.pdf`);
  },

  /**
   * Extrae los valores actualizados de los KPIs e indicadores para generar una hoja de Excel
   */
  exportarExcel() {
    if (!window.XLSX) return;

    const recaudacion = document.getElementById('kpi-recaudacion')?.innerText || '0.00 Bs';
    const volumen = document.getElementById('kpi-volumen')?.innerText || '0.00 L';
    const transacciones = document.getElementById('kpi-transacciones')?.innerText || '0';
    const ticketPromedio = document.getElementById('kpi-ticket')?.innerText || '0.00 Bs';

    const resumenData = [
      { Indicador: 'Recaudación Total', Valor: recaudacion },
      { Indicador: 'Volumen Total Despachado', Valor: volumen },
      { Indicador: 'Transacciones Registradas', Valor: transacciones },
      { Indicador: 'Ticket Promedio', Valor: ticketPromedio },
      { Indicador: 'Fecha de Generación', Valor: new Date().toLocaleString('es-BO') }
    ];

    const hoja = XLSX.utils.json_to_sheet(resumenData);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Resumen Operativo");
    XLSX.writeFile(libro, `Reporte_Resumen_SurtirSoft_${new Date().toISOString().slice(0, 10)}.xlsx`);
  },

  renderCharts(diarios, mensuales, porCombustible) {
    if (typeof Plotly === 'undefined') {
      console.warn('Plotly no está disponible.');
      return;
    }

    // --- Gráfico 1: Ingresos Diarios (Barras + Línea) ---
    const elDiarios = document.getElementById('chart-reporte-diario');
    if (elDiarios) {
      Plotly.newPlot('chart-reporte-diario', [
        {
          x: diarios.labels,
          y: diarios.ingresos,
          type: 'bar',
          name: 'Ingresos (Bs)',
          marker: { color: '#0EA5E9' }
        },
        {
          x: diarios.labels,
          y: diarios.volumen,
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Volumen (L)',
          yaxis: 'y2',
          line: { color: '#10B981', width: 3 }
        }
      ], {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: '#CBD5E1', size: 10 },
        margin: { t: 20, r: 40, l: 40, b: 40 },
        legend: { orientation: 'h', y: 1.1 },
        xaxis: { color: '#64748B', showgrid: false },
        yaxis: { title: 'Bs', color: '#0EA5E9', showgrid: true, gridcolor: '#334155' },
        yaxis2: { title: 'Litros', color: '#10B981', overlaying: 'y', side: 'right', showgrid: false }
      }, { responsive: true, displayModeBar: false });
    }

    // --- Gráfico 2: Ventas por Tipo de Combustible (Pie / Donut) ---
    const elComb = document.getElementById('chart-reporte-combustible');
    if (elComb) {
      Plotly.newPlot('chart-reporte-combustible', [{
        labels: porCombustible.labels.length ? porCombustible.labels : ['Sin registros'],
        values: porCombustible.ingresos.length ? porCombustible.ingresos : [1],
        type: 'pie',
        hole: 0.4,
        marker: { colors: ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'] },
        textinfo: 'label+percent',
        textposition: 'inside'
      }], {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: '#CBD5E1', size: 10 },
        showlegend: true,
        legend: { font: { color: '#CBD5E1' } },
        margin: { t: 20, r: 20, l: 20, b: 20 }
      }, { responsive: true, displayModeBar: false });
    }

    // --- Gráfico 3: Proyección Mensual (Línea Continua) ---
    const elMensual = document.getElementById('chart-reporte-mensual');
    if (elMensual) {
      Plotly.newPlot('chart-reporte-mensual', [{
        x: mensuales.labels,
        y: mensuales.values,
        type: 'scatter',
        mode: 'lines+markers',
        fill: 'tozeroy',
        fillcolor: 'rgba(14, 165, 233, 0.1)',
        line: { color: '#38BDF8', width: 3 },
        marker: { color: '#0EA5E9', size: 6 }
      }], {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: '#CBD5E1', size: 10 },
        margin: { t: 20, r: 20, l: 45, b: 30 },
        xaxis: { color: '#64748B', showgrid: false },
        yaxis: { color: '#64748B', showgrid: true, gridcolor: '#334155' }
      }, { responsive: true, displayModeBar: false });
    }

    // Forzar ajuste de tamaño en contenedores flexibles
    setTimeout(() => {
      if (elDiarios) Plotly.Plots.resize(elDiarios);
      if (elComb) Plotly.Plots.resize(elComb);
      if (elMensual) Plotly.Plots.resize(elMensual);
    }, 100);
  },

  destroy() {
    // Limpieza de eventos si es requerido
  }
};