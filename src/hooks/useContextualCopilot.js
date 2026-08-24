import { useState, useEffect } from 'react';

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
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function useContextualCopilot(userCoords, activePois, totalKm = 24.1, kmCurrent = 0, lang = 'es') {
  const [contextualNotice, setContextualNotice] = useState(null);

  useEffect(() => {
    if (!userCoords || !userCoords[0] || !userCoords[1]) {
      setContextualNotice(null);
      return;
    }

    const [userLat, userLng] = userCoords;

    // 1. Detección de Fuentes Próximas (< 300m)
    const nearbyWater = activePois?.find((poi) => {
      if (poi.categoria !== 'agua') return false;
      const dist = getDistanceMeters(userLat, userLng, poi.coordenadas[0], poi.coordenadas[1]);
      return dist <= 300;
    });

    if (nearbyWater) {
      const distMeters = Math.round(
        getDistanceMeters(userLat, userLng, nearbyWater.coordenadas[0], nearbyWater.coordenadas[1])
      );
      setContextualNotice({
        type: 'WATER_NEAR',
        title: lang === 'en' ? 'Nearby Water Fountain 💧' : 'Fuente Próxima 💧',
        message: lang === 'en'
          ? `${nearbyWater.nombre} is about ${distMeters}m away. Good time to refill water.`
          : `${nearbyWater.nombre} a unos ${distMeters}m. Buen momento para rellenar agua.`,
        priority: 2,
      });
      return;
    }

    // 2. Detección de Meta / Final de Etapa (< 1 km)
    const kmRemaining = totalKm - kmCurrent;
    if (kmRemaining > 0 && kmRemaining <= 1.0) {
      setContextualNotice({
        type: 'FINISH_NEAR',
        title: lang === 'en' ? 'Stage Finish Ahead! 🏁' : '¡Final de Etapa cerca! 🏁',
        message: lang === 'en'
          ? `About ${(kmRemaining * 1000).toFixed(0)}m left to reach Hospital de Bruma.`
          : `Te quedan aprox. ${(kmRemaining * 1000).toFixed(0)}m para llegar a Hospital de Bruma.`,
        priority: 1,
      });
      return;
    }

    setContextualNotice(null);
  }, [userCoords, activePois, totalKm, kmCurrent, lang]);

  return contextualNotice;
}