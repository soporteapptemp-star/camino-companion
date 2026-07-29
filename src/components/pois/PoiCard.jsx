import React from 'react';
import { Star, MapPin, Phone, ArrowUpRight } from 'lucide-react';

export default function PoiCard({ poi }) {
  const isPublic = poi.tipo.includes('Público');

  return (
    <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm space-y-3 relative">
      {/* Header de la tarjeta */}
      <div className="flex items-start justify-between gap-2">
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
            isPublic
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {poi.tipo}
        </span>
        <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200/50">
          {poi.precio} · {poi.reserva}
        </span>
      </div>

      {/* Nombre y Valoración */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-black text-stone-900 leading-snug">
            {poi.nombre}
          </h3>
          {poi.valoracion && (
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full text-amber-700 text-xs font-bold shrink-0">
              <Star size={12} className="fill-amber-400 stroke-amber-400" />
              <span>{poi.valoracion}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-stone-500 mt-1 line-clamp-2">
          {poi.descripcion}
        </p>
      </div>

      {/* Footer / Ubicación y Acción */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-stone-500 font-medium">
          <MapPin size={14} className="text-emerald-700" />
          <span>{poi.localidad}</span>
        </div>

        <button className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors">
          <Phone size={12} />
          <span>Ver detalle</span>
        </button>
      </div>
    </div>
  );
}