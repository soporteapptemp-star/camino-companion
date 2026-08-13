import React, { useMemo } from 'react';
import CopilotCard from '../../components/copiloto/CopilotCard';
import { useGeolocation } from '../../hooks/useGeolocation';
import etapa4Data from '../../data/routes/camino-ingles/etapa4.json';

// Matemática idéntica a MapView para medir metros reales
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
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

// Snapping idéntico a MapView.jsx
function calculateDistanceToRoute(userLat, userLng, routeCoords) {
  if (!routeCoords || routeCoords.length < 2 || !userLat || !userLng) {
    return 0;
  }

  let minDistance = Infinity;

  for (let i = 0; i < routeCoords.length - 1; i++) {
    const p1 = routeCoords[i];
    const p2 = routeCoords[i + 1];

    const distP1 = getDistanceMeters(userLat, userLng, p1[0], p1[1]);
    const distP2 = getDistanceMeters(userLat, userLng, p2[0], p2[1]);
    const distToSegment = Math.min(distP1, distP2);

    if (distToSegment < minDistance) {
      minDistance = distToSegment;
    }
  }

  return minDistance === Infinity ? 0 : Math.round(minDistance);
}

export default function HomePage() {
  const location = useGeolocation();
  const routePath = useMemo(() => etapa4Data?.coordenadas || [], []);

  // Calcula exactamente la misma distancia que el Mapa en tiempo real
  const distanceToGpx = useMemo(() => {
    if (!location.latitude || !location.longitude) return 0;
    return calculateDistanceToRoute(location.latitude, location.longitude, routePath);
  }, [location.latitude, location.longitude, routePath]);

  return (
    <div className="space-y-4">
      <CopilotCard distanceToGpx={distanceToGpx} />
    </div>
  );
}