import { MainController } from './mainController.js';

/**
 * VoiceController - Gestor estático de Reconocimiento y Síntesis de Voz
 */
export class VoiceController {
  static recognition = null;
  static synth = window.speechSynthesis;
  static isListening = false;
  static onDespachoCallback = null;

  static _getRecognition() {
    if (!this.recognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.warn('La Web Speech API no está soportada en este navegador.');
        return null;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'es-BO';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        console.log('Texto detectado:', transcript);

        if (this.onDespachoCallback) {
          const datosExtraidos = this.parsearComandoVenta(transcript);
          this.onDespachoCallback(datosExtraidos, transcript);
          this.onDespachoCallback = null;
        } else {
          this.processCommand(transcript);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.updateMicUI(false);
      };

      this.recognition.onerror = (event) => {
        console.error('Error de voz:', event.error);
        this.isListening = false;
        this.updateMicUI(false);
      };
    }
    return this.recognition;
  }

  static toggleListening() {
    const rec = this._getRecognition();
    if (!rec) {
      alert('Tu navegador no soporta control por voz.');
      return;
    }

    if (this.isListening) {
      rec.stop();
    } else {
      try {
        this.onDespachoCallback = null;
        rec.start();
        this.isListening = true;
        this.updateMicUI(true);
      } catch (err) {
        console.error(err);
      }
    }
  }

  static escucharDespacho(onResultCallback) {
    const rec = this._getRecognition();
    if (!rec) {
      alert('Tu navegador no soporta entrada por voz.');
      return;
    }

    this.onDespachoCallback = onResultCallback;
    try {
      rec.start();
      this.isListening = true;
      this.updateMicUI(true);
    } catch (err) {
      console.error(err);
    }
  }

  static hablar(mensaje) {
    if (!this.synth) return;
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(mensaje);
    utterance.lang = 'es-BO';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    this.synth.speak(utterance);
  }

  static processCommand(text) {
    if (text.includes('dashboard') || text.includes('inicio') || text.includes('principal')) {
      MainController.navigateTo('dashboard');
    } else if (text.includes('surtidor') || text.includes('surtidores')) {
      MainController.navigateTo('surtidores');
    } else if (text.includes('tanque') || text.includes('tanques')) {
      MainController.navigateTo('tanques');
    } else if (text.includes('registro') || text.includes('nueva venta')) {
      MainController.navigateTo('registro-ventas');
    } else if (text.includes('historial') || text.includes('ventas')) {
      MainController.navigateTo('historial');
    } else if (text.includes('alerta') || text.includes('alertas')) {
      MainController.navigateTo('alertas');
    } else if (text.includes('reporte') || text.includes('reportes')) {
      MainController.navigateTo('reportes');
    } else if (text.includes('configuracion') || text.includes('ajustes')) {
      MainController.navigateTo('configuracion');
    } else if (text.includes('usuario') || text.includes('usuarios')) {
      MainController.navigateTo('usuarios');
    }
  }

  static parsearComandoVenta(texto) {
    const resultado = {
      placa: null,
      cliente: 'Sin Nombre / Cliente Varios',
      monto: null,
      combustibleCodigo: null
    };

    const textoLower = texto.toLowerCase();

    // Extraer Placa
    const placaMatch = texto.match(/\b([0-9]{3,4}\s*[-–]?\s*[a-zA-Z]{3})\b/i);
    if (placaMatch) {
      resultado.placa = placaMatch[1].replace(/\s+/g, '').toUpperCase();
    }

    // Extraer Tipo de Combustible
    if (textoLower.includes('especial') || textoLower.includes('gasolina especial')) {
      resultado.combustibleCodigo = 'GE';
    } else if (textoLower.includes('premium')) {
      resultado.combustibleCodigo = 'GP';
    } else if (textoLower.includes('diesel') || textoLower.includes('diésel')) {
      resultado.combustibleCodigo = 'DO';
    } else if (textoLower.includes('gnb') || textoLower.includes('gas natural')) {
      resultado.combustibleCodigo = 'GNB';
    }

    // Extraer Monto
    const montoMatch = textoLower.match(/(\d+(\.\d+)?)\s*(bolivianos|bs|litros|m3)?/);
    if (montoMatch) {
      resultado.monto = parseFloat(montoMatch[1]);
    }

    // Extraer Nombre del Cliente
    const clienteMatch = texto.match(/cliente\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+?)(?=\s+(con|de|en|por|\d+|$))/i);
    if (clienteMatch) {
      resultado.cliente = clienteMatch[1].trim();
    }

    return resultado;
  }

  static updateMicUI(active) {
    const btn = document.getElementById('btn-voice-command') || document.getElementById('btn-dictado-voz');
    if (btn) {
      if (active) {
        btn.classList.add('bg-red-500/20', 'text-red-400', 'animate-pulse', 'border-red-500');
      } else {
        btn.classList.remove('bg-red-500/20', 'text-red-400', 'animate-pulse', 'border-red-500');
      }
    }
  }
}

export const voiceCtrl = VoiceController;