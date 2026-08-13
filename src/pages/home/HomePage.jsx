import React from 'react';
import CopilotCard from '../../components/copiloto/CopilotCard';
import { useGeolocation } from '../../hooks/useGeolocation';
import etapa4Data from '../../data/routes/camino-ingles/etapa4.json';

// Función auxiliar Haversine para calcular distancia entre 2 coordenadas en metros
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radio de la Tierra en metros
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function HomePage() {
  const location = useGeolocation();

  // Calcular distancia mínima al trazado GPX en metros
  const distanceToGpx = React.useMemo(() => {
    if (!location.latitude || !location.longitude || !etapa4Data?.gpxPoints?.length) {
      return 0;
    }

    let minDistance = Infinity;
    const userLat = location.latitude;
    const userLng = location.longitude;

    // Recorre los puntos GPX para encontrar el más cercano al peregrino
    for (const point of etapa4Data.gpxPoints) {
      const ptLat = Array.isArray(point) ? point[0] : point.lat;
      const ptLng = Array.isArray(point) ? point[1] : point.lng;

      if (ptLat && ptLng) {
        const dist = getDistanceFromLatLonInMeters(userLat, userLng, ptLat, ptLng);
        if (dist < minDistance) {
          minDistance = dist;
        }
      }
    }

    return minDistance === Infinity ? 0 : Math.round(minDistance);
  }, [location.latitude, location.longitude]);

  return (
    <div className="space-y-4">
      <CopilotCard distanceToGpx={distanceToGpx} />
    </div>
  );
}