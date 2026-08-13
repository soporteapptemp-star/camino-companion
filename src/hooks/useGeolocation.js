import { useState, useEffect, useRef } from 'react';
import etapa4Data from '../data/routes/camino-ingles/etapa4.json';

export function useGeolocation() {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    speed: 0,
    heading: 0,
    gpsStatus: 'SEARCHING',
    error: null,
  });

  // Estado del Simulador GPS
  const [isSimulating, setIsSimulating] = useState(() => {
    return new URLSearchParams(window.location.search).get('sim') === 'true';
  });
  const [simMode, setSimMode] = useState('ROUTE'); // 'ROUTE' | 'PAUSE' | 'OFF_ROUTE'
  const [simSpeedKmH, setSimSpeedKmH] = useState(4.5);
  const routeIndexRef = useRef(0);

  // 1. Efecto del GPS Real
  useEffect(() => {
    if (isSimulating) return;

    if (!('geolocation' in navigator)) {
      setLocation((prev) => ({ ...prev, error: 'GPS no soportado', gpsStatus: 'ERROR' }));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
          speed: pos.coords.speed || 0,
          heading: pos.coords.heading || 0,
          gpsStatus: 'ACTIVE',
          error: null,
        });
      },
      (err) => {
        setLocation((prev) => ({ ...prev, error: err.message, gpsStatus: 'ERROR' }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isSimulating]);

  // 2. Bucle del Simulador GPS
  useEffect(() => {
    if (!isSimulating) return;

    const coords = etapa4Data?.coordenadas || [];
    if (!coords.length) return;

    const interval = setInterval(() => {
      if (simMode === 'PAUSE') {
        setLocation((prev) => ({ ...prev, speed: 0, gpsStatus: 'ACTIVE' }));
        return;
      }

      let currentIdx = routeIndexRef.current;
      let [lat, lng] = coords[currentIdx];

      // Simulamos un desvío de ~150 metros sumando offset si el modo es OFF_ROUTE
      if (simMode === 'OFF_ROUTE') {
        lat += 0.0025;
        lng += 0.0025;
      } else {
        // Avanzamos en el track si estamos en marcha
        routeIndexRef.current = (currentIdx + 1) % coords.length;
      }

      setLocation({
        latitude: lat,
        longitude: lng,
        accuracy: 5, // GPS de precisión simulación
        speed: (simSpeedKmH / 3.6), // Convertir km/h a m/s
        heading: 45,
        gpsStatus: 'ACTIVE',
        error: null,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating, simMode, simSpeedKmH]);

  const toggleSimulator = () => setIsSimulating((prev) => !prev);

  return {
    ...location,
    isSimulating,
    simMode,
    simSpeedKmH,
    toggleSimulator,
    setSimMode,
    setSimSpeedKmH,
  };
}