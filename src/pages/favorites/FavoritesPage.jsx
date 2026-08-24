import React, { useMemo } from 'react';
import { Bookmark } from 'lucide-react';
import poisEtapa4 from '../../data/pois/etapa4.pois.json';
import PoiCard from '../../components/pois/PoiCard';
import { useFavorites } from '../../hooks/useFavorites';
import { useLanguage } from '../../context/LanguageContext';

export default function FavoritesPage() {
  const { t } = useLanguage();
  const { favorites } = useFavorites();

  const savedPois = useMemo(() => {
    if (!favorites || favorites.length === 0) return [];
    return poisEtapa4.filter((poi) => favorites.includes(poi.id));
  }, [favorites]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-black text-stone-900">{t('favorites.title')}</h2>
        <p className="text-xs text-stone-500 font-medium">
          {t('favorites.subtitle')}
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
          <p className="text-sm font-bold text-stone-700">{t('favorites.emptyTitle')}</p>
          <p className="text-xs text-stone-500">
            {t('favorites.emptyDesc')}
          </p>
        </div>
      )}
    </div>
  );
}