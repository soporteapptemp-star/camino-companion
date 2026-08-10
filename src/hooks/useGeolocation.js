// src/hooks/useGeolocation.js
import { useState, useEffect, useRef } from 'react';
import { KalmanFilter } from '../services/gps/kalman';

function calculateBearing(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);

  const brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360;
}

export function useGeolocation(options = {}) {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    rawLatitude: null,
    rawLongitude: null,
    accuracy: null,
    heading: null,
    speed: null,
    lastFixTime: null,
    error: null,
    gpsStatus: 'SEARCHING', // 'EXCELLENT' (<=10m), 'GOOD' (<=25m), 'LOW' (>25m), 'SEARCHING' (null)
  });

  const kalmanRef = useRef(new KalmanFilter());
  const lastCoordsRef = useRef(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocation((prev) => ({ ...prev, error: 'Geolocalización no soportada.', gpsStatus: 'ERROR' }));
      return;
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 1000,
      ...options,
    };

    const handleSuccess = (position) => {
      const { latitude, longitude, accuracy, heading, speed } = position.coords;
      const roundedAcc = Math.round(accuracy);

      // Clasificación estricta de la calidad GPS para el Copiloto
      let status = 'LOW';
      if (roundedAcc <= 10) status = 'EXCELLENT';
      else if (roundedAcc <= 25) status = 'GOOD';

      // 1. Filtrar con el Kalman Filter
      const filtered = kalmanRef.current.filter(latitude, longitude, accuracy);

      // 2. Cálculo sintético de rumbo (Heading)
      let calculatedHeading = heading;
      if (
        (calculatedHeading === null || calculatedHeading === undefined || calculatedHeading === 0) &&
        lastCoordsRef.current
      ) {
        const distMovedLat = Math.abs(filtered.lat - lastCoordsRef.current.lat);
        const distMovedLng = Math.abs(filtered.lng - lastCoordsRef.current.lng);

        if (distMovedLat > 0.00003 || distMovedLng > 0.00003) {
          calculatedHeading = calculateBearing(
            lastCoordsRef.current.lat,
            lastCoordsRef.current.lng,
            filtered.lat,
            filtered.lng
          );
        } else {
          calculatedHeading = lastCoordsRef.current.heading || 0;
        }
      }

      lastCoordsRef.current = {
        lat: filtered.lat,
        lng: filtered.lng,
        heading: calculatedHeading,
      };

      // 3. Actualizar estado
      setLocation({
        latitude: filtered.lat,
        longitude: filtered.lng,
        rawLatitude: latitude,
        rawLongitude: longitude,
        accuracy: roundedAcc,
        heading: calculatedHeading ? Math.round(calculatedHeading) : 0,
        speed: speed ?? 0,
        lastFixTime: new Date(position.timestamp),
        error: null,
        gpsStatus: status,
      });
    };

    const handleError = (error) => {
      setLocation((prev) => ({ ...prev, error: error.message, gpsStatus: 'SEARCHING' }));
    };

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      defaultOptions
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return location;
}