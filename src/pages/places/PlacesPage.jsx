import React, { useState } from 'react';
import PoiCard from '../../components/pois/PoiCard';
import poisBruma from '../../data/pois/bruma.json';
import { Bed, Utensils, HeartPulse, Search } from 'lucide-react';

export default function PlacesPage() {
  const [filter, setFilter] = useState('todos');

  const categories = [
    { id: 'todos', label: 'Todos', icon: null },
    { id: 'dormir', label: 'Dormir', icon: Bed },
    { id: 'comer', label: 'Comer', icon: Utensils },
    { id: 'salud', label: 'Salud', icon: HeartPulse },
  ];

  return (
    <div className="space-y-4">
      {/* Título de la sección */}
      <div>
        <h2 className="text-2xl font-black text-stone-900">Alojamiento y Servicios</h2>
        <p className="text-xs text-stone-500 font-medium">
          Albergues, hostales y puntos clave al finalizar la etapa
        </p>
      </div>

      {/* Filtros rápidos por categoría */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = filter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {Icon && <Icon size={14} />}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Lista de Tarjetas POI */}
      <div className="space-y-3">
        {poisBruma.map((poi) => (
          <PoiCard key={poi.id} poi={poi} />
        ))}
      </div>
    </div>
  );
}