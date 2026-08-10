import React, { useState } from 'react';
import PoiCard from '../../components/pois/PoiCard';
import poisEtapa4 from '../../data/pois/etapa4.pois.json';
import { Bed, Utensils, HeartPulse, Droplet, ShoppingBag, Layers } from 'lucide-react';

export default function PlacesPage() {
  const [filter, setFilter] = useState('todos');

  const categories = [
    { id: 'todos', label: 'Todos', icon: Layers },
    { id: 'alojamiento', label: 'Dormir', icon: Bed },
    { id: 'agua', label: 'Agua', icon: Droplet },
    { id: 'restauracion', label: 'Comer', icon: Utensils },
    { id: 'comida', label: 'Supermercado', icon: ShoppingBag },
    { id: 'salud', label: 'Salud', icon: HeartPulse },
  ];

  const filteredPois = filter === 'todos'
    ? poisEtapa4
    : poisEtapa4.filter((poi) => poi.categoria === filter);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-black text-stone-900">Servicios en Ruta</h2>
        <p className="text-xs text-stone-500 font-medium">
          Puntos clave verificados de Betanzos a Hospital de Bruma (24.1 km)
        </p>
      </div>

      {/* Filtros por Categoría */}
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

      {/* Lista de Puntos de Interés */}
      <div className="space-y-3">
        {filteredPois.length > 0 ? (
          filteredPois.map((poi) => <PoiCard key={poi.id} poi={poi} />)
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border border-stone-200">
            <p className="text-xs text-stone-500 font-bold">No hay servicios en esta categoría para el tramo actual.</p>
          </div>
        )}
      </div>
    </div>
  );
}