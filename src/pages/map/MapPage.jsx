import React from 'react';
import MapView from '../../components/map/MapView';
import OfflineManager from '../../components/offline/OfflineManager';
import { useLanguage } from '../../context/LanguageContext';

export default function MapPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="space-y-4">
      {/* Cabecera de la sección de Mapa */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-stone-900">
            {t('mapTitle') || (lang === 'en' ? 'Route Map' : 'Mapa de la Ruta')}
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            {lang === 'en' ? 'Stage 4: Betanzos → Hospital de Bruma' : 'Etapa 4: Betanzos → Hospital de Bruma'}
          </p>
        </div>
      </div>

      {/* Tarjeta Gestor Offline */}
      <OfflineManager />

      {/* Mapa Leaflet */}
      <MapView />
    </div>
  );
}