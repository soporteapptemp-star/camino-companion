import { useState, useEffect } from 'react';

export function useGeolocation() {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    speed: 0,
    accuracy: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: 'La geolocalización no está soportada.',
        loading: false,
      }));
      return;
    }

    const handleSuccess = (position) => {
      // Convertir m/s a km/h
      const speedKmH = position.coords.speed
        ? (position.coords.speed * 3.6).toFixed(1)
        : 0;

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        speed: speedKmH,
        accuracy: Math.round(position.coords.accuracy),
        error: null,
        loading: false,
      });
    };

    const handleError = (err) => {
      setLocation((prev) => ({
        ...prev,
        error: err.message,
        loading: false,
      }));
    };

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return location;
}