import React from 'react';
import MapView from '../../components/map/MapView';
import OfflineManager from '../../components/offline/OfflineManager';

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
      </div>

      {/* Tarjeta Gestor Offline (Paso 4 + Paso 5) */}
      <OfflineManager />

      {/* Mapa Leaflet */}
      <MapView />
    </div>
  );
}