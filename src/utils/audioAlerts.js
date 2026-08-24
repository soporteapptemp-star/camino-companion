class AudioAlertService {
  constructor() {
    this.lastSpokenTime = 0;
    this.cooldownMs = 25000;
    this.lastState = 'ON_ROUTE';
  }

  isSpeechAvailable() {
    return 'speechSynthesis' in window;
  }

  speak(message, lang = 'es') {
    if (!this.isSpeechAvailable()) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    // Configura la voz según el idioma activo
    utterance.lang = lang === 'en' ? 'en-US' : 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  }

  vibrate(pattern) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  processAlert(status, distanceMeters, lang = 'es') {
    const now = Date.now();

    if (status === 'ON_ROUTE') {
      if (this.lastState !== 'ON_ROUTE') {
        const msg = lang === 'en' 
          ? 'You are back on the official route.' 
          : 'Has vuelto a la ruta oficial.';
        this.speak(msg, lang);
        this.vibrate([100, 50, 100]);
        this.lastState = 'ON_ROUTE';
        this.lastSpokenTime = now;
      }
      return;
    }

    if (now - this.lastSpokenTime < this.cooldownMs && this.lastState === status) {
      return;
    }

    if (status === 'WARNING') {
      const msg = lang === 'en'
        ? `Warning. You are moving away from the route. Distance: ${distanceMeters} meters.`
        : `Atención. Te estás alejando de la ruta. Distancia: ${distanceMeters} metros.`;
      this.speak(msg, lang);
      this.vibrate([200, 100, 200]);
      this.lastState = 'WARNING';
      this.lastSpokenTime = now;
    }

    if (status === 'OFF_ROUTE') {
      const msg = lang === 'en'
        ? `Alert. Off route by ${distanceMeters} meters. Check your map.`
        : `Alerta. Te has desviado de la ruta ${distanceMeters} metros. Revisa el mapa.`;
      this.speak(msg, lang);
      this.vibrate([400, 150, 400, 150, 400]);
      this.lastState = 'OFF_ROUTE';
      this.lastSpokenTime = now;
    }
  }
}

export const audioAlertService = new AudioAlertService();