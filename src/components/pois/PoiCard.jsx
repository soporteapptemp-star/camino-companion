import React from 'react';
import { MapPin, Phone, ShieldCheck, Droplet, HeartPulse, ShoppingBag, Utensils, Bed, Compass, Heart } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { useLanguage } from '../../context/LanguageContext';

export default function PoiCard({ poi }) {
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(poi.id);

  const getCategoryBadge = (categoria) => {
    switch (categoria) {
      case 'agua':
        return { label: `💧 ${t('places.water')}`, bg: 'bg-cyan-100 text-cyan-900' };
      case 'salud':
        return { label: `💊 ${t('places.health')}`, bg: 'bg-rose-100 text-rose-900' };
      case 'comida':
        return { label: `🛒 ${t('places.market')}`, bg: 'bg-amber-100 text-amber-900' };
      case 'restauracion':
        return { label: `🍽️ ${t('places.eat')}`, bg: 'bg-orange-100 text-orange-900' };
      case 'alojamiento':
        return { label: `🛏️ ${t('places.sleep')}`, bg: 'bg-emerald-100 text-emerald-900' };
      default:
        return { label: '📍 Servicio', bg: 'bg-stone-100 text-stone-800' };
    }
  };

  const badge = getCategoryBadge(poi.categoria);
  const isVerified = poi.verificacion?.estado === 'verificado';

  return (
    <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm space-y-3 relative">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${badge.bg}`}>
            {badge.label}
          </span>

          {isVerified && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              <ShieldCheck size={12} />
              <span>✓ {poi.verificacion.fecha}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => toggleFavorite(poi.id)}
          className="p-1.5 rounded-full hover:bg-stone-100 transition-colors"
        >
          <Heart 
            size={18} 
            className={favorite ? "text-rose-500 fill-rose-500" : "text-stone-400"} 
          />
        </button>
      </div>

      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-black text-stone-900 leading-snug">
            {poi.nombre}
          </h3>
          {poi.precio && (
            <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full shrink-0">
              {poi.precio}
            </span>
          )}
        </div>
        <p className="text-xs text-stone-500 mt-1 line-clamp-2">
          {poi.descripcion}
        </p>
      </div>

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-emerald-700" />
            <span>{poi.localidad}</span>
          </div>
          <span className="text-stone-300">•</span>
          <span className="text-emerald-800 font-mono">km {poi.kmRuta.toFixed(1)}</span>
        </div>

        {poi.contacto?.telefono ? (
          <a
            href={`tel:${poi.contacto.telefono}`}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            <Phone size={12} />
            <span>Llamar</span>
          </a>
        ) : (
          <span className="text-[11px] font-semibold text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full">
            En Ruta
          </span>
        )}
      </div>
    </div>
  );
}