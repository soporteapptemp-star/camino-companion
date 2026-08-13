import { useState, useEffect, useRef, useCallback } from 'react';

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

  // Referencias para evitar re-crear el loop cuando cambia la velocidad o el GPS
  const gpsHeadingRef = useRef(gpsHeading);
  const speedMpsRef = useRef(speedMps);
  
  useEffect(() => {
    gpsHeadingRef.current = gpsHeading;
    speedMpsRef.current = speedMps;
  }, [gpsHeading, speedMps]);

  const smoothedHeadingRef = useRef(0);
  const rawCompassRef = useRef(null);

  // 1. Detectar soporte de DeviceOrientation
  useEffect(() => {
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      setIsSupported(true);
      if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
        setPermissionGranted(true);
      }
    }
  }, []);

  // 2. Escuchar eventos del sensor magnético
  useEffect(() => {
    if (!permissionGranted) return;

    const handleOrientation = (event) => {
      let rawHeading = null;

      if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
        rawHeading = event.webkitCompassHeading; // iOS Safari
      } else if (event.alpha !== null && event.alpha !== undefined) {
        rawHeading = (360 - event.alpha) % 360; // Android W3C
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

  // 3. Loop de suavizado de alto rendimiento (Sin fugas de memoria / Sin parpadeos)
  useEffect(() => {
    const ALPHA = 0.15; // Factor EMA

    const intervalId = setInterval(() => {
      const speedKmH = (speedMpsRef.current || 0) * 3.6;
      let targetHeading = smoothedHeadingRef.current;

      // HÍBRIDO: Caminando (>= 1.5 km/h) prioriza GPS. Parado (< 1.5 km/h) prioriza brújula.
      if (speedKmH >= 1.5 && gpsHeadingRef.current !== null && gpsHeadingRef.current !== undefined) {
        targetHeading = gpsHeadingRef.current;
      } else if (rawCompassRef.current !== null) {
        targetHeading = rawCompassRef.current;
      }

      const delta = getShortestAngleDelta(targetHeading, smoothedHeadingRef.current);

      // Umbral mínimo anti-temblor en parado
      if (Math.abs(delta) > 0.5) {
        smoothedHeadingRef.current = (smoothedHeadingRef.current + delta * ALPHA + 360) % 360;
        setHeading(Math.round(smoothedHeadingRef.current));
      }
    }, 50); // 20 FPS fluidos y estables

    return () => clearInterval(intervalId);
  }, []); // Cero dependencias: el temporizador no se destruye nunca en ejecución

  // 4. Permisos iOS Safari
  const requestPermission = useCallback(async () => {
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
        // Error silencioso en producción
      }
      return false;
    }
    setPermissionGranted(true);
    return true;
  }, []);

  return { heading, permissionGranted, isSupported, requestPermission };
}