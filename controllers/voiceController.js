import { MainController } from './mainController.js';

export const VoiceController = {
  recognition: null,
  isListening: false,

  init() {
    // Comprobar soporte del navegador (Chrome, Edge, Safari)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('La Web Speech API no está soportada en este navegador.');
      return false;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'es-BO'; // Configurado para español
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    // Escuchar el resultado de la voz
    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log('Comando detectado:', transcript);
      this.processCommand(transcript);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.updateMicUI(false);
    };

    this.recognition.onerror = (e) => {
      console.error('Error de reconocimiento de voz:', e.error);
      this.isListening = false;
      this.updateMicUI(false);
    };

    return true;
  },

  toggleListening() {
    if (!this.recognition && !this.init()) {
      alert('Tu navegador no soporta control por voz.');
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
    } else {
      try {
        this.recognition.start();
        this.isListening = true;
        this.updateMicUI(true);
      } catch (err) {
        console.error(err);
      }
    }
  },

  // Mapear comandos hablados a las rutas existentes en MainController
  processCommand(text) {
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
    } else {
      console.log('Comando no reconocido:', text);
    }
  },

  updateMicUI(active) {
    const btn = document.getElementById('btn-voice-command');
    if (btn) {
      if (active) {
        btn.classList.add('bg-red-500/20', 'text-red-400', 'animate-pulse', 'border-red-500');
      } else {
        btn.classList.remove('bg-red-500/20', 'text-red-400', 'animate-pulse', 'border-red-500');
      }
    }
  }
};