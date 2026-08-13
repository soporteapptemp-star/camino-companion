import React from 'react';
import CopilotCard from '../../components/copiloto/CopilotCard';
import { useGeolocation } from '../../hooks/useGeolocation';
import { calculateMinDistanceToGPX } from '../../utils/geoUtils'; // O la función de cálculo que use tu mapa
import etapa4Data from '../../data/routes/camino-ingles/etapa4.json';

export default function HomePage() {
  const location = useGeolocation();

  // Calcular la distancia actual al trazado GPX
  const distanceToGpx = React.useMemo(() => {
    if (!location.latitude || !location.longitude || !etapa4Data?.gpxPoints) {
      return 0;
    }
    return calculateMinDistanceToGPX(
      { lat: location.latitude, lng: location.longitude },
      etapa4Data.gpxPoints
    );
  }, [location.latitude, location.longitude]);

  return (
    <div className="space-y-4">
      <CopilotCard distanceToGpx={distanceToGpx} />
    </div>
  );
}