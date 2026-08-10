import { useState, useEffect, useRef } from 'react';

// Auxiliar para calcular la menor diferencia angular entre dos ángulos (evita giros de 359° -> 0°)
function getShortestAngleDelta(target, current) {
  let delta = (target - current) % 360;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta;
}

export function useCompass(gpsHeading = null, speedMps = 0) {
  const [heading, setHeading] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Referencias para suavizado EMA (Exponential Moving Average)
  const smoothedHeadingRef = useRef(0);
  const rawCompassRef = useRef(null);

  // 1. Detectar si el dispositivo soporta DeviceOrientation
  useEffect(() => {
    if (window.DeviceOrientationEvent) {
      setIsSupported(true);
      // En Android o browsers que no requieren permiso explícito:
      if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
        setPermissionGranted(true);
      }
    }
  }, []);

  // 2. Escuchar eventos del sensor
  useEffect(() => {
    if (!permissionGranted) return;

    const handleOrientation = (event) => {
      let rawHeading = null;

      if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
        // iOS Safari (Norte Magnético preciso)
        rawHeading = event.webkitCompassHeading;
      } else if (event.alpha !== null && event.alpha !== undefined) {
        // Android / Estándar W3C
        rawHeading = (360 - event.alpha) % 360;
      }

      if (rawHeading !== null) {
        rawCompassRef.current = rawHeading;
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [permissionGranted]);

  // 3. Loop de suavizado y Heading Híbrido (GPS + Giroscopio)
  useEffect(() => {
    const ALPHA = 0.15; // Factor de suavizado (0.15 = amortiguación suave sin lag)

    const intervalId = setInterval(() => {
      const speedKmH = (speedMps || 0) * 3.6;
      let targetHeading = smoothedHeadingRef.current;

      // HÍBRIDO: Caminando (≥ 1.5 km/h) prioriza vector GPS. Parado (< 1.5 km/h) prioriza brújula física.
      if (speedKmH >= 1.5 && gpsHeading !== null && gpsHeading !== undefined) {
        targetHeading = gpsHeading;
      } else if (rawCompassRef.current !== null) {
        targetHeading = rawCompassRef.current;
      }

      // Corrección del salto 359° <-> 0° con ángulo mínimo
      const delta = getShortestAngleDelta(targetHeading, smoothedHeadingRef.current);

      // Si el movimiento es imperceptible (< 0.5°), no mover para evitar temblor parado
      if (Math.abs(delta) > 0.5) {
        smoothedHeadingRef.current = (smoothedHeadingRef.current + delta * ALPHA + 360) % 360;
        setHeading(Math.round(smoothedHeadingRef.current));
      }
    }, 50); // 20 FPS continuos

    return () => clearInterval(intervalId);
  }, [gpsHeading, speedMps]);

  // 4. Función de solicitud explícita de permiso para iOS
  const requestPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          return true;
        }
      } catch (error) {
        console.error('Error al solicitar permisos de orientación:', error);
      }
      return false;
    }
    setPermissionGranted(true);
    return true;
  };

  return { heading, permissionGranted, isSupported, requestPermission };
}