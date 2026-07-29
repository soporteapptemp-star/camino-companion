import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapView() {
  const position = [43.281, -8.217];
  
  const routeCoordinates = [
    [43.281, -8.217], // Betanzos
    [43.235, -8.260], // Presedo
    [43.161, -8.328]  // Hospital de Bruma
  ];

  return (
    <div className="w-full h-[70vh] rounded-3xl overflow-hidden border border-stone-200 shadow-md relative">
      <MapContainer 
        center={position} 
        zoom={11} 
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Polyline 
          positions={routeCoordinates} 
          color="#047857" 
          weight={5} 
          opacity={0.8} 
        />

        <Marker position={[43.281, -8.217]} icon={customIcon}>
          <Popup>
            <div className="text-xs font-bold text-stone-800">
              Inicio: Betanzos
            </div>
          </Popup>
        </Marker>

        <Marker position={[43.161, -8.328]} icon={customIcon}>
          <Popup>
            <div className="text-xs font-bold text-stone-800">
              Meta: Hospital de Bruma
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}