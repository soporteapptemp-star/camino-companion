// src/services/gps/kalman.js

export class KalmanFilter {
  constructor(R = 0.0001, Q = 0.00001) {
    this.R = R; // Ruido de medición
    this.Q = Q; // Ruido de proceso
    this.lat = null;
    this.lng = null;
    this.variance = -1;
  }

  filter(lat, lng, accuracy) {
    if (this.variance < 0) {
      this.lat = lat;
      this.lng = lng;
      this.variance = accuracy * accuracy;
      return { lat, lng };
    }

    // Actualizar varianza
    this.variance += this.Q;
    const K = this.variance / (this.variance + this.R);

    // Aplicar filtro a las coordenadas
    this.lat += K * (lat - this.lat);
    this.lng += K * (lng - this.lng);

    // Actualizar varianza del estado
    this.variance = (1 - K) * this.variance;

    return { lat: this.lat, lng: this.lng };
  }
}