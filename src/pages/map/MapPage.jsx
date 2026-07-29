import React from 'react';
import MapView from '../../components/map/MapView';
import { Navigation, Compass } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="space-y-4">
      {/* Cabecera de la sección de Mapa */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-stone-900">Mapa de la Ruta</h2>
          <p className="text-xs text-stone-500 font-medium">
            Etapa 4: Betanzos → Hospital de Bruma
          </p>
        </div>
        <button className="p-2.5 bg-emerald-900 text-emerald-400 rounded-full shadow-sm hover:bg-emerald-950">
          <Compass size={20} />
        </button>
      </div>

      {/* Mapa Leaflet */}
      <MapView />
    </div>
  );
}