import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGeolocation } from '../../hooks/useGeolocation';
import etapa4Data from '../../data/routes/camino-ingles/etapa4.json';
import { Navigation, AlertTriangle, CheckCircle2, Compass } from 'lucide-react';

// Icono personalizado para el marcador del peregrino
const pilgrimIcon = L.divIcon({
  className: 'custom-pilgrim-marker',
  html: `<div class="w-6 h-6 bg-emerald-600 border-2 border-white rounded-full shadow-lg flex items-center justify-center text-white text-xs font-bold">🥾</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Auxiliar: Cálculo de distancia haversine en metros entre dos puntos
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
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Auxiliar: Algoritmo Snap-to-Route (proyección sobre el segmento más cercano)
function getSnappedPosition(userLat, userLng, routeCoords) {
  if (!routeCoords || routeCoords.length < 2) {
    return { snappedLat: userLat, snappedLng: userLng, distanceMeters: 0 };
  }

  let minDistance = Infinity;
  let closestPoint = { lat: userLat, lng: userLng };

  for (let i = 0; i < routeCoords.length - 1; i++) {
    const p1 = routeCoords[i];
    const p2 = routeCoords[i + 1];

    // Proyección aproximada sobre el segmento
    const distP1 = getDistanceMeters(userLat, userLng, p1[0], p1[1]);
    const distP2 = getDistanceMeters(userLat, userLng, p2[0], p2[1]);
    const segmentLength = getDistanceMeters(p1[0], p1[1], p2[0], p2[1]);

    const distToSegment = Math.min(distP1, distP2);

    if (distToSegment < minDistance) {
      minDistance = distToSegment;
      // Si está a menos de 25 metros, atraemos suavemente al nodo del camino más cercano
      closestPoint = distP1 < distP2 ? { lat: p1[0], lng: p1[1] } : { lat: p2[0], lng: p2[1] };
    }
  }

  // Snap solo si la distancia es menor a 25m para no enmascarar desvíos reales
  if (minDistance <= 25) {
    return { snappedLat: closestPoint.lat, snappedLng: closestPoint.lng, distanceMeters: Math.round(minDistance) };
  }

  return { snappedLat: userLat, snappedLng: userLng, distanceMeters: Math.round(minDistance) };
}

// Controlador de centrado automático
function MapController({ position, isTracking, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (isTracking && position[0] && position[1]) {
      map.setView(position, zoom, { animate: true });
    }
  }, [position, isTracking, zoom, map]);

  return null;
}

// Listener para detectar interacciones táctiles y desactivar Auto-Follow
function MapEventListener({ onDrag }) {
  useMapEvents({
    dragstart: () => {
      onDrag();
    },
  });
  return null;
}

export default function MapView() {
  const location = useGeolocation();
  const [isTracking, setIsTracking] = useState(true);
  const [mapZoom, setMapZoom] = useState(16);

  // Coordenadas fijas por defecto (Betanzos)
  const defaultCenter = [43.2808, -8.2173];

  // Supongamos que la ruta proviene de nuestro JSON de la etapa 4
  const routePath = etapa4Data?.coordenadas || [
    [43.2808, -8.2173],
    [43.2500, -8.2300],
    [43.2000, -8.2500],
    [43.1500, -8.2700]
  ];

  // Cálculo de Snap-to-Route
  const snapResult = location.latitude && location.longitude
    ? getSnappedPosition(location.latitude, location.longitude, routePath)
    : { snappedLat: null, snappedLng: null, distanceMeters: 0 };

  const activeCoords = snapResult.snappedLat && snapResult.snappedLng
    ? [snapResult.snappedLat, snapResult.snappedLng]
    : defaultCenter;

  // Determinar estado de desviación
  const devDistance = snapResult.distanceMeters;
  let devStatus = 'ON_ROUTE'; // ON_ROUTE, WARNING, OFF_ROUTE
  if (devDistance > 50) devStatus = 'OFF_ROUTE';
  else if (devDistance > 25) devStatus = 'WARNING';

  // Auto Zoom dinámico según la velocidad (km/h)
  useEffect(() => {
    if (location.speed !== null) {
      const speedKmH = location.speed * 3.6;
      if (speedKmH > 4.5) {
        setMapZoom(17);
      } else if (speedKmH < 1.0) {
        setMapZoom(15);
      }
    }
  }, [location.speed]);

  const handleMapDrag = () => {
    if (isTracking) setIsTracking(false);
  };

  const handleRecenter = () => {
    setIsTracking(true);
  };

  return (
    <div className="relative w-full h-[72vh] rounded-3xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100">
      
      {/* 1. Barra superior: Precisión GPS + Estado de Ruta */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between pointer-events-none">
        
        {/* Indicador GPS */}
        <div className="bg-stone-900/90 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 border border-white/10 shadow-lg pointer-events-auto">
          <span
            className={`w-2 h-2 rounded-full ${
              location.accuracy && location.accuracy < 15
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-amber-400'
            }`}
          />
          <span className="font-medium">±{location.accuracy || '--'}m</span>
        </div>

        {/* Indicador de Desvío Progresivo */}
        <div className={`px-3.5 py-1.5 rounded-full backdrop-blur-md border text-xs font-bold shadow-lg flex items-center gap-1.5 pointer-events-auto transition-all ${
          devStatus === 'ON_ROUTE' 
            ? 'bg-emerald-900/90 text-emerald-300 border-emerald-700/50' 
            : devStatus === 'WARNING'
            ? 'bg-amber-900/90 text-amber-300 border-amber-700/50'
            : 'bg-rose-900/90 text-rose-200 border-rose-700/50 animate-bounce'
        }`}>
          {devStatus === 'ON_ROUTE' && <CheckCircle2 size={14} />}
          {devStatus === 'WARNING' && <AlertTriangle size={14} />}
          {devStatus === 'OFF_ROUTE' && <AlertTriangle size={14} />}
          
          <span>
            {devStatus === 'ON_ROUTE' && 'En Ruta'}
            {devStatus === 'WARNING' && `Atención (${devDistance}m)`}
            {devStatus === 'OFF_ROUTE' && `Desviado (${devDistance}m)`}
          </span>
        </div>
      </div>

      {/* 2. Botón Recentrar */}
      {!isTracking && (
        <button
          onClick={handleRecenter}
          className="absolute bottom-6 right-4 z-[1000] bg-emerald-900 text-emerald-400 font-bold text-xs px-4 py-2.5 rounded-full shadow-xl hover:bg-emerald-950 active:scale-95 transition-all flex items-center gap-2 border border-emerald-700/50"
        >
          <Navigation size={14} className="fill-emerald-400" />
          <span>Recentrar</span>
        </button>
      )}

      {/* 3. Render Leaflet */}
      <MapContainer
        center={activeCoords}
        zoom={mapZoom}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Trazado oficial del Camino */}
        <Polyline
          positions={routePath}
          pathOptions={{ color: '#059669', weight: 5, opacity: 0.85 }}
        />

        <MapController position={activeCoords} isTracking={isTracking} zoom={mapZoom} />
        <MapEventListener onDrag={handleMapDrag} />

        {/* Marcador del Peregrino */}
        {location.latitude && (
          <Marker position={activeCoords} icon={pilgrimIcon}>
            <Popup>
              <div className="text-xs font-sans">
                <p className="font-bold text-stone-900">Peregrino</p>
                <p className="text-stone-500">Velocidad: {(location.speed * 3.6).toFixed(1)} km/h</p>
                <p className="text-stone-500">Rumbo: {location.heading}°</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}