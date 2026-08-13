import React from 'react';
import CopilotCard from '../../components/copiloto/CopilotCard';
import { useGeolocation } from '../../hooks/useGeolocation';
import etapa4Data from '../../data/routes/camino-ingles/etapa4.json';

// Función Haversine para medir metros entre dos coordenadas GPS
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function HomePage() {
  const location = useGeolocation();

  // Calcular la distancia más cercana al trazado GPX
  const distanceToGpx = React.useMemo(() => {
    if (!location?.latitude || !location?.longitude) return 0;

    // Buscar puntos GPX en el JSON de la etapa
    const points = etapa4Data?.gpxPoints || etapa4Data?.track || [];
    if (!points.length) return 0;

    let minDistance = Infinity;

    for (const pt of points) {
      const lat = Array.isArray(pt) ? pt[0] : (pt.lat || pt.latitude);
      const lng = Array.isArray(pt) ? pt[1] : (pt.lng || pt.longitude);

      if (lat && lng) {
        const dist = getDistanceInMeters(location.latitude, location.longitude, lat, lng);
        if (dist < minDistance) minDistance = dist;
      }
    }

    return minDistance === Infinity ? 0 : Math.round(minDistance);
  }, [location?.latitude, location?.longitude]);

  return (
    <div className="space-y-4">
      <CopilotCard distanceToGpx={distanceToGpx} />
    </div>
  );
}