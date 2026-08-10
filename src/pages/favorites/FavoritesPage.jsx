import React from 'react';
import { Bookmark } from 'lucide-react';
import poisEtapa4 from '../../data/pois/etapa4.pois.json';
import PoiCard from '../../components/pois/PoiCard';

export default function FavoritesPage() {
  // Tomamos los albergues principales como favoritos por defecto para la demo de la etapa
  const savedPois = poisEtapa4.filter((poi) => poi.categoria === 'alojamiento');

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-black text-stone-900">Lugares Guardados</h2>
        <p className="text-xs text-stone-500 font-medium">
          Tus alojamientos y puntos de interés marcados para la etapa
        </p>
      </div>

      {savedPois.length > 0 ? (
        <div className="space-y-3">
          {savedPois.map((poi) => (
            <PoiCard key={poi.id} poi={poi} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-3">
          <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto text-stone-400">
            <Bookmark size={24} />
          </div>
          <p className="text-sm font-bold text-stone-700">No tienes favoritos aún</p>
          <p className="text-xs text-stone-500">
            Guarda albergues o restaurantes desde la pestaña Lugares para consultarlos sin conexión.
          </p>
        </div>
      )}
    </div>
  );
}