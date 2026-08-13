// Calcula la distancia en kilómetros entre dos puntos geográficos (Haversine)
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en kilómetros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Resultado en kilómetros
}

// Alias utilitario por si necesitas el valor directo en metros
export function calculateDistanceInMeters(lat1, lon1, lat2, lon2) {
  return calculateHaversineDistance(lat1, lon1, lat2, lon2) * 1000;
}