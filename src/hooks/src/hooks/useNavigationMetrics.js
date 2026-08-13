import { useState, useEffect, useRef } from 'react';
import { calculateHaversineDistance } from '../services/gps/haversine';
import { useGeolocation } from './useGeolocation';

export function useNavigationMetrics(routeCoordinates = []) {
  const { location, error } = useGeolocation();
  const [distanceTraveled, setDistanceTraveled] = useState(0); // en km
  const [currentSpeed, setCurrentSpeed] = useState(0); // en km/h
  const [averageSpeed, setAverageSpeed] = useState(0); // en km/h
  const [etaMinutes, setEtaMinutes] = useState(null); // ETA en minutos al destino

  const lastPositionRef = useRef(null);
  const totalDistanceRef = useRef(0);
  const speedSamplesRef = useRef([]);

  useEffect(() => {
    if (!location || !location.latitude || !location.longitude) return;

    const currentPos = {
      lat: location.latitude,
      lng: location.longitude,
      timestamp: Date.now()
    };

    // 1. Filtrado de GPS basura (precisión muy baja > 30m)
    if (location.accuracy && location.accuracy > 30) {
      return;
    }

    if (lastPositionRef.current) {
      const prevPos = lastPositionRef.current;
      const distanceDeltaKm = calculateHaversineDistance(
        prevPos.lat,
        prevPos.lng,
        currentPos.lat,
        currentPos.lng
      );

      const timeDeltaHours = (currentPos.timestamp - prevPos.timestamp) / (1000 * 3600);

      // 2. Filtrado de saltos absurdos de GPS (ej. velocidad > 25 km/h caminando o movimientos < 3 metros)
      if (distanceDeltaKm > 0.003 && timeDeltaHours > 0) {
        const calculatedSpeed = distanceDeltaKm / timeDeltaHours;

        if (calculatedSpeed <= 25) {
          totalDistanceRef.current += distanceDeltaKm;
          setDistanceTraveled(Number(totalDistanceRef.current.toFixed(2)));
          
          setCurrentSpeed(Number(calculatedSpeed.toFixed(1)));

          // Muestreo de velocidad para media móvil
          speedSamplesRef.current.push(calculatedSpeed);
          if (speedSamplesRef.current.length > 10) speedSamplesRef.current.shift();

          const avgSpeed =
            speedSamplesRef.current.reduce((a, b) => a + b, 0) / speedSamplesRef.current.length;
          setAverageSpeed(Number(avgSpeed.toFixed(1)));

          // 3. Cálculo de ETA estimado si hay coordenadas de ruta restantes
          if (routeCoordinates && routeCoordinates.length > 0 && avgSpeed > 0.5) {
            const destination = routeCoordinates[routeCoordinates.length - 1];
            const distToDestKm = calculateHaversineDistance(
              currentPos.lat,
              currentPos.lng,
              destination[0],
              destination[1]
            );
            const remainingHours = distToDestKm / avgSpeed;
            setEtaMinutes(Math.round(remainingHours * 60));
          }
        }
      }
    }

    lastPositionRef.current = currentPos;
  }, [location, routeCoordinates]);

  return {
    location,
    error,
    distanceTraveled,
    currentSpeed,
    averageSpeed,
    etaMinutes
  };
}