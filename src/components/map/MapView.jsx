import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useCompass } from '../../hooks/useCompass';
import { useContextualCopilot } from '../../hooks/useContextualCopilot';
import ContextBanner from '../ui/ContextBanner';
import etapa4Data from '../../data/routes/camino-ingles/etapa4.json';
import poisEtapa4 from '../../data/pois/etapa4.pois.json';
import { Navigation, AlertTriangle, CheckCircle2, Compass, Phone } from 'lucide-react';
import { audioAlertService } from '../../utils/audioAlerts';

// Marker base del peregrino
const basePilgrimIcon = L.divIcon({
  className: 'custom-pilgrim-marker',
  html: `
    <div id="pilgrim-arrow" style="transition: transform 0.3s ease-out;" class="w-8 h-8 bg-emerald-600 border-2 border-white rounded-full shadow-lg flex items-center justify-center text-white text-xs font-bold">
      ⬆️
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Cache e iconos dinámicos para POIs
const poiIconCache = {};
const getPoiMarkerIcon = (categoria) => {
  if (poiIconCache[categoria]) return poiIconCache[categoria];

  let emoji = '📍';
  let colorBg = 'bg-stone-800';

  if (categoria === 'agua') { emoji = '💧'; colorBg = 'bg-cyan-600'; }
  else if (categoria === 'salud') { emoji = '💊'; colorBg = 'bg-rose-600'; }
  else if (categoria === 'comida') { emoji = '🛒'; colorBg = 'bg-amber-600'; }
  else if (categoria === 'restauracion') { emoji = '🍽️'; colorBg = 'bg-orange-600'; }
  else if (categoria === 'alojamiento') { emoji = '🛏️'; colorBg = 'bg-emerald-700'; }

  const icon = L.divIcon({
    className: 'custom-poi-marker',
    html: `
      <div class="w-7 h-7 ${colorBg} border-2 border-white rounded-full shadow-md flex items-center justify-center text-white text-xs font-bold transition-transform hover:scale-110">
        ${emoji}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  poiIconCache[categoria] = icon;
  return icon;
};

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

function getSnappedPosition(userLat, userLng, routeCoords) {
  if (!routeCoords || routeCoords.length < 2) {
    return { snappedLat: userLat, snappedLng: userLng, distanceMeters: 0 };
  }

  let minDistance = Infinity;
  let closestPoint = { lat: userLat, lng: userLng };

  for (let i = 0; i < routeCoords.length - 1; i++) {
    const p1 = routeCoords[i];
    const p2 = routeCoords[i + 1];

    const distP1 = getDistanceMeters(userLat, userLng, p1[0], p1[1]);
    const distP2 = getDistanceMeters(userLat, userLng, p2[0], p2[1]);
    const distToSegment = Math.min(distP1, distP2);

    if (distToSegment < minDistance) {
      minDistance = distToSegment;
      closestPoint = distP1 < distP2 ? { lat: p1[0], lng: p1[1] } : { lat: p2[0], lng: p2[1] };
    }
  }

  if (minDistance <= 25) {
    return { snappedLat: closestPoint.lat, snappedLng: closestPoint.lng, distanceMeters: Math.round(minDistance) };
  }

  return { snappedLat: userLat, snappedLng: userLng, distanceMeters: Math.round(minDistance) };
}

function MapController({ position, isTracking, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (isTracking && position[0] && position[1]) {
      map.setView(position, zoom, { animate: true });
    }
  }, [position, isTracking, zoom, map]);

  return null;
}

function MapEventListener({ onDrag }) {
  useMapEvents({
    dragstart: onDrag,
  });
  return null;
}

const CATEGORIAS_POIS = [
  { id: 'todos', nombre: 'Todos', emoji: '📍' },
  { id: 'agua', nombre: 'Fuentes', emoji: '💧' },
  { id: 'alojamiento', nombre: 'Albergues', emoji: '🛏️' },
  { id: 'restauracion', nombre: 'Bares', emoji: '🍽️' },
  { id: 'comida', nombre: 'Tiendas', emoji: '🛒' },
  { id: 'salud', nombre: 'Salud', emoji: '💊' },
];

export default function MapView() {
  const location = useGeolocation();
  const compass = useCompass(location.heading, location.speed);

  const [isTracking, setIsTracking] = useState(true);
  const [mapZoom, setMapZoom] = useState(16);
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const routePath = useMemo(() => etapa4Data?.coordenadas || [], []);
  const defaultCenter = useMemo(() => (routePath.length > 0 ? routePath[0] : [43.281549, -8.211772]), [routePath]);

  // Rotación CSS fluida
  useEffect(() => {
    const arrowEl = document.getElementById('pilgrim-arrow');
    if (arrowEl) {
      arrowEl.style.transform = `rotate(${compass.heading}deg)`;
    }
  }, [compass.heading]);

  // Snap to route
  const snapResult = useMemo(() => {
    if (!location.latitude || !location.longitude) {
      return { snappedLat: null, snappedLng: null, distanceMeters: 0 };
    }
    return getSnappedPosition(location.latitude, location.longitude, routePath);
  }, [location.latitude, location.longitude, routePath]);

  const activeCoords = useMemo(() => {
    return snapResult.snappedLat && snapResult.snappedLng
      ? [snapResult.snappedLat, snapResult.snappedLng]
      : defaultCenter;
  }, [snapResult.snappedLat, snapResult.snappedLng, defaultCenter]);

  // Evaluador Contextual Inteligente
  const contextualNotice = useContextualCopilot(
    activeCoords,
    poisEtapa4,
    24.1, // Km totales de la etapa 4
    0     // Km actuales recorridos
  );

  // Distancia real de desvío
  const devDistance = snapResult.distanceMeters;

  // Estados de ruta
  const devStatus = useMemo(() => {
    if (devDistance > 50) return 'OFF_ROUTE';
    if (devDistance >= 30) return 'WARNING';
    return 'ON_ROUTE';
  }, [devDistance]);

  // Procesar alertas audibles y de vibración
  useEffect(() => {
    if (location.latitude && location.longitude) {
      audioAlertService.processAlert(devStatus, devDistance);
    }
  }, [devStatus, devDistance, location.latitude, location.longitude]);

  useEffect(() => {
    const currentSpeed = location.speed || 0;
    const speedKmH = currentSpeed * 3.6;
    if (speedKmH > 4.5) setMapZoom(17);
    else if (speedKmH < 1.0) setMapZoom(15);
  }, [location.speed]);

  const handleMapDrag = useCallback(() => {
    setIsTracking(false);
  }, []);

  const handleRecenter = useCallback(() => {
    setIsTracking(true);
  }, []);

  // Filtrado de POIs
  const filteredPois = useMemo(() => {
    if (selectedCategory === 'todos') return poisEtapa4;
    return poisEtapa4.filter((poi) => poi.categoria === selectedCategory);
  }, [selectedCategory]);

  // Renderizado dinámico de marcadores
  const renderedPois = useMemo(() => {
    return filteredPois.map((poi) => {
      const distFromUserMeters = activeCoords
        ? getDistanceMeters(activeCoords[0], activeCoords[1], poi.coordenadas[0], poi.coordenadas[1])
        : 0;

      const distLabel =
        distFromUserMeters >= 1000
          ? `${(distFromUserMeters / 1000).toFixed(1)} km`
          : `${Math.round(distFromUserMeters)} m`;

      return (
        <Marker key={poi.id} position={poi.coordenadas} icon={getPoiMarkerIcon(poi.categoria)}>
          <Popup>
            <div className="text-xs font-sans space-y-1.5 min-w-[200px] max-w-[240px]">
              <div className="flex items-start justify-between gap-2 border-b border-stone-200 pb-1">
                <div>
                  <p className="font-black text-stone-900 leading-snug">{poi.nombre}</p>
                  <p className="text-[10px] text-stone-400 font-medium">{poi.localidad}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                  {distLabel}
                </span>
              </div>

              <p className="text-stone-600 leading-tight text-[11px]">{poi.descripcion}</p>

              {(poi.precio || poi.contacto?.telefono) && (
                <div className="flex items-center justify-between text-[10px] bg-stone-50 p-1.5 rounded border border-stone-200/60 font-medium">
                  {poi.precio && <span className="text-emerald-800 font-bold">{poi.precio}</span>}
                  {poi.contacto?.telefono && (
                    <a
                      href={`tel:${poi.contacto.telefono}`}
                      className="text-blue-600 font-mono flex items-center gap-1 hover:underline"
                    >
                      <Phone size={10} />
                      <span>{poi.contacto.telefono}</span>
                    </a>
                  )}
                </div>
              )}

              {poi.servicios && poi.servicios.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {poi.servicios.map((s) => (
                    <span
                      key={s}
                      className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200 font-medium capitalize"
                    >
                      {s.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center text-[9px] text-stone-400 font-mono pt-1 border-t border-stone-100">
                <span>km {poi.kmRuta.toFixed(2)}</span>
                {poi.verificacion?.estado === 'verificado' && (
                  <span className="text-emerald-600 font-bold">✓ Verificado</span>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      );
    });
  }, [filteredPois, activeCoords]);

  return (
    <div className="relative w-full h-[72vh] rounded-3xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100 flex flex-col">
      {/* 1. Header de estado GPS / Desvío */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between pointer-events-none">
        <div className="bg-stone-900/90 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 border border-white/10 shadow-lg pointer-events-auto">
          <span
            className={`w-2 h-2 rounded-full ${
              !location.accuracy
                ? 'bg-stone-400'
                : location.accuracy <= 10
                ? 'bg-emerald-400 animate-pulse'
                : location.accuracy <= 30
                ? 'bg-amber-400'
                : 'bg-rose-400'
            }`}
          />
          <span className="font-medium">
            {!location.accuracy
              ? 'Buscando GPS…'
              : location.accuracy <= 10
              ? `±${location.accuracy}m (Preciso)`
              : location.accuracy <= 30
              ? `±${location.accuracy}m (Bueno)`
              : `±${location.accuracy}m (Débil)`}
          </span>
        </div>

        <div
          className={`px-3.5 py-1.5 rounded-full backdrop-blur-md border text-xs font-bold shadow-lg flex items-center gap-1.5 pointer-events-auto transition-all ${
            devStatus === 'ON_ROUTE'
              ? 'bg-emerald-900/90 text-emerald-300 border-emerald-700/50'
              : devStatus === 'WARNING'
              ? 'bg-amber-900/90 text-amber-300 border-amber-700/50'
              : 'bg-rose-900/90 text-rose-200 border-rose-700/50 animate-bounce'
          }`}
        >
          {devStatus === 'ON_ROUTE' && <CheckCircle2 size={14} />}
          {devStatus === 'WARNING' && <AlertTriangle size={14} />}
          {devStatus === 'OFF_ROUTE' && <AlertTriangle size={14} />}

          <span>
            {devStatus === 'ON_ROUTE' && 'EN RUTA OFICIAL'}
            {devStatus === 'WARNING' && `COMPROBAR RUTA (${devDistance}m)`}
            {devStatus === 'OFF_ROUTE' && `POSIBLE DESVÍO (${devDistance}m)`}
          </span>
        </div>
      </div>

      {/* 2. Barra Flotante de Filtros de Categorías */}
      <div className="absolute top-16 left-4 right-4 z-[1000] overflow-x-auto no-scrollbar py-1 flex items-center gap-1.5 pointer-events-auto">
        {CATEGORIAS_POIS.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-md flex items-center gap-1 backdrop-blur-md border ${
                isActive
                  ? 'bg-stone-900 text-white border-stone-700 scale-105'
                  : 'bg-white/90 text-stone-700 border-stone-200/80 hover:bg-white'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.nombre}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Botón Activar Brújula */}
      {!compass.permissionGranted && (
        <button
          onClick={compass.requestPermission}
          className="absolute top-28 right-4 z-[1000] bg-stone-900/90 text-amber-300 text-xs font-bold px-3 py-2 rounded-full shadow-lg backdrop-blur-md border border-amber-500/40 flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <Compass size={14} className="animate-spin" />
          <span>Activar Brújula</span>
        </button>
      )}

      {/* 4. Banner Contextual Inteligente */}
      <ContextBanner notice={contextualNotice} />

      {/* 5. Botón Recentrar en Mapa */}
      {!isTracking && (
        <button
          onClick={handleRecenter}
          className="absolute bottom-6 right-4 z-[1000] bg-emerald-900 text-emerald-400 font-bold text-xs px-4 py-2.5 rounded-full shadow-xl hover:bg-emerald-950 active:scale-95 transition-all flex items-center gap-2 border border-emerald-700/50"
        >
          <Navigation size={14} className="fill-emerald-400" />
          <span>Recentrar</span>
        </button>
      )}

      {/* 6. Mapa Leaflet */}
      <MapContainer center={activeCoords} zoom={mapZoom} className="w-full h-full z-0" zoomControl={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routePath.length > 0 && (
          <Polyline positions={routePath} pathOptions={{ color: '#059669', weight: 5, opacity: 0.85 }} />
        )}

        <MapController position={activeCoords} isTracking={isTracking} zoom={mapZoom} />
        <MapEventListener onDrag={handleMapDrag} />

        {/* Renderizado de POIs filtrados */}
        {renderedPois}

        {/* Marcador del Peregrino */}
        <Marker position={activeCoords} icon={basePilgrimIcon}>
          <Popup>
            <div className="text-xs font-sans">
              <p className="font-bold text-stone-900">Peregrino</p>
              <p className="text-stone-500">Velocidad: {((location.speed || 0) * 3.6).toFixed(1)} km/h</p>
              <p className="text-stone-500">Rumbo Híbrido: {compass.heading}°</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}