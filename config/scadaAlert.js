// config/scadaAlert.js

export const ScadaAlert = {
  // Alerta de Error / Crítica
  error(mensaje, titulo = 'ERROR EN SISTEMA') {
    return Swal.fire({
      title: `<span class="scada-alert-title"><span class="led led-red"></span> ${titulo}</span>`,
      html: `<div class="scada-alert-content">${mensaje}</div>`,
      customClass: {
        popup: 'scada-alert-box alert-error',
        confirmButton: 'scada-alert-btn'
      },
      buttonsStyling: false,
      confirmButtonText: 'ACEPTAR'
    });
  },

  // Alerta de Éxito
  success(mensaje, titulo = 'OPERACIÓN EXITOSA') {
    return Swal.fire({
      title: `<span class="scada-alert-title"><span class="led led-green"></span> ${titulo}</span>`,
      html: `<div class="scada-alert-content">${mensaje}</div>`,
      customClass: {
        popup: 'scada-alert-box alert-success',
        confirmButton: 'scada-alert-btn'
      },
      buttonsStyling: false,
      confirmButtonText: 'ENTENDIDO'
    });
  },

  // Alerta de Advertencia
  warning(mensaje, titulo = 'ADVERTENCIA DE SISTEMA') {
    return Swal.fire({
      title: `<span class="scada-alert-title"><span class="led led-yellow"></span> ${titulo}</span>`,
      html: `<div class="scada-alert-content">${mensaje}</div>`,
      customClass: {
        popup: 'scada-alert-box alert-warning',
        confirmButton: 'scada-alert-btn'
      },
      buttonsStyling: false,
      confirmButtonText: 'CORREGIR'
    });
  },

  // Diálogo de Confirmación (Aceptar/Cancelar)
  confirm(mensaje, titulo = 'CONFIRMACIÓN DE OPERACIÓN', btnText = 'ACEPTAR') {
    return Swal.fire({
      title: `<span class="scada-alert-title"><span class="led led-yellow"></span> ${titulo}</span>`,
      html: `<div class="scada-alert-content">${mensaje}</div>`,
      showCancelButton: true,
      confirmButtonText: btnText,
      cancelButtonText: 'CANCELAR',
      customClass: {
        popup: 'scada-alert-box alert-warning',
        confirmButton: 'scada-alert-btn',
        cancelButton: 'btn btn-ghost'
      },
      buttonsStyling: false,
      reverseButtons: true
    });
  },

  // Notificación flotante rápida Toast
  toast(mensaje, tipo = 'info') {
    const colorMap = {
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#0EA5E9'
    };
    
    return Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3500,
      timerProgressBar: true,
      title: `<span style="color: #F8FAFC; font-family: monospace; font-size: 0.85rem;">${mensaje}</span>`,
      background: '#1E293B',
      iconColor: colorMap[tipo] || colorMap.info,
      icon: tipo
    });
  }
};