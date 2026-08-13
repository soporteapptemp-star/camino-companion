// Gestor de síntesis de voz y vibración con control de Cooldown
class AudioAlertService {
  constructor() {
    this.lastSpokenTime = 0;
    this.cooldownMs = 25000; // 25 segundos de silencio mínimo entre alertas consecutivas
    this.lastState = 'ON_ROUTE';
  }

  // Comprueba si Web Speech API está disponible
  isSpeechAvailable() {
    return 'speechSynthesis' in window;
  }

  // Reproduce un mensaje hablado
  speak(message) {
    if (!this.isSpeechAvailable()) return;

    // Cancelar audios anteriores en cola
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0; // Velocidad normal
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  }

  // Ejecuta vibración física en dispositivos compatibles
  vibrate(pattern) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  // Evalúa y emite alertas según el estado y distancia
  processAlert(status, distanceMeters) {
    const now = Date.now();

    // 🟢 ESTADO: EN RUTA (< 30m)
    if (status === 'ON_ROUTE') {
      if (this.lastState !== 'ON_ROUTE') {
        // Notificación de recuperación al volver
        this.speak('Has vuelto a la ruta oficial.');
        this.vibrate([100, 50, 100]); // Pulsación doble corta
        this.lastState = 'ON_ROUTE';
        this.lastSpokenTime = now;
      }
      return;
    }

    // Comprobar Cooldown antes de alertas repetitivas
    if (now - this.lastSpokenTime < this.cooldownMs && this.lastState === status) {
      return;
    }

    // 🟡 ESTADO: PRE-ALERTA / COMPROBAR RUTA (30m - 50m)
    if (status === 'WARNING') {
      this.speak(`Atención. Te estás alejando de la ruta. Distancia: ${distanceMeters} metros.`);
      this.vibrate([200, 100, 200]); // Dos vibraciones medias
      this.lastState = 'WARNING';
      this.lastSpokenTime = now;
    }

    // 🔴 ESTADO: DESVÍO SOSTENIDO (> 50m)
    if (status === 'OFF_ROUTE') {
      this.speak(`Alerta. Te has desviado de la ruta ${distanceMeters} metros. Revisa el mapa.`);
      this.vibrate([400, 150, 400, 150, 400]); // Vibración fuerte y reiterada
      this.lastState = 'OFF_ROUTE';
      this.lastSpokenTime = now;
    }
  }
}

export const audioAlertService = new AudioAlertService();