import React from 'react';
import { Home, Map, MapPin, Heart, Settings } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function BottomNav({ activeTab, setActiveTab }) {
  const { t } = useLanguage();

  const tabs = [
    { id: 'inicio', label: t('tabs.inicio'), icon: Home },
    { id: 'ruta', label: t('tabs.ruta'), icon: Map },
    { id: 'lugares', label: t('tabs.lugares'), icon: MapPin },
    { id: 'favoritos', label: t('tabs.favoritos'), icon: Heart },
    { id: 'ajustes', label: t('tabs.ajustes'), icon: Settings },
  ];

  return (
    <div className="fixed bottom-3 left-0 right-0 z-50 px-4">
      <nav className="max-w-md mx-auto bg-white/90 backdrop-blur-md border border-stone-200/60 rounded-full shadow-lg py-2 px-3 flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-full transition-all ${
                isActive ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <Icon size={20} className={isActive ? 'stroke-[2.5px]' : 'stroke-2'} />
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-0.5"></span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}