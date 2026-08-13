import { useState, useEffect, useRef } from 'react';
import { useGeolocation } from './useGeolocation';

export const ROUTE_THRESHOLDS = {
  ON_ROUTE: 30,
  CHECK_ROUTE: 50,
};

export const ROUTE_STATES = {
  ON_ROUTE: 'ON_ROUTE',       // 🟢 <= 30m
  CHECK_ROUTE: 'CHECK_ROUTE', // 🟡 30m - 50m
  OFF_ROUTE: 'OFF_ROUTE',     // 🔴 > 50m
};

export function useRouteStatus(distanceToGpxMeters = 0) {
  const location = useGeolocation();
  const [routeState, setRouteState] = useState(ROUTE_STATES.ON_ROUTE);
  const [rawDistance, setRawDistance] = useState(0);
  const historyRef = useRef([]);

  useEffect(() => {
    const dist = Math.round(distanceToGpxMeters);
    setRawDistance(dist);

    let instantState = ROUTE_STATES.ON_ROUTE;
    if (dist > ROUTE_THRESHOLDS.CHECK_ROUTE) {
      instantState = ROUTE_STATES.OFF_ROUTE;
    } else if (dist > ROUTE_THRESHOLDS.ON_ROUTE) {
      instantState = ROUTE_STATES.CHECK_ROUTE;
    }

    // Histéresis: Requiere 2 lecturas consecutivas para confirmar cambio de estado
    historyRef.current = [...historyRef.current.slice(-1), instantState];
    const allMatch = historyRef.current.every((st) => st === instantState);
    if (allMatch && historyRef.current.length >= 2) {
      setRouteState(instantState);
    }
  }, [distanceToGpxMeters]);

  return {
    routeState,
    distanceToGpx: rawDistance,
    accuracy: location.accuracy,
    speed: location.speed,
    gpsStatus: location.gpsStatus,
    error: location.error,
  };
}