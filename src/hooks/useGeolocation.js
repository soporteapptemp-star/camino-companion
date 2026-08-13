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
    gpsStatus: 'SEARCHING',
  });

  const kalmanRef = useRef(new KalmanFilter());
  const lastCoordsRef = useRef(null);
  
  // Ref para congelar las opciones y evitar que watchPosition se reinicie en bucle
  const optionsRef = useRef(options);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocation((prev) => ({ ...prev, error: 'Geolocalización no soportada.', gpsStatus: 'ERROR' }));
      return;
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 1000,
      ...optionsRef.current,
    };

    // Remplaza el fragmento dentro de handleSuccess en useGeolocation.js:

const handleSuccess = (position) => {
  const { latitude, longitude, accuracy, heading, speed } = position.coords;
  const roundedAcc = accuracy ? Math.round(accuracy) : 999;

  // Umbrales realistas para campo y zonas urbanas/interiores
  let status = 'WEAK';
  if (roundedAcc <= 12) status = 'EXCELLENT';
  else if (roundedAcc <= 30) status = 'GOOD';
  else if (roundedAcc <= 80) status = 'MODERATE';

  // 1. Filtrar con Kalman
  const filtered = kalmanRef.current.filter(latitude, longitude, roundedAcc);

  // 2. Cálculo sintético de rumbo
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
    speed: speed && !isNaN(speed) ? speed : 0,
    lastFixTime: new Date(position.timestamp),
    error: null,
    gpsStatus: status, // Devuelve EXCELLENT, GOOD, MODERATE o WEAK
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