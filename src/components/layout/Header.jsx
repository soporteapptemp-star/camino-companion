import React from 'react';
import { AlertCircle, Thermometer, CloudRain, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Header({ currentStage = "Camino Inglés · Etapa 4", userName = "Peregrino" }) {
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <header className="pt-4 px-4 pb-2 max-w-md mx-auto">
      {/* Alerta de Modo Offline */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1.5 mb-3 flex items-center justify-between text-amber-900 text-xs font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          {t('offlineMode')}
        </span>
        <span className="text-[10px] text-amber-700">{t('copilotCache')}</span>
      </div>

      <div className="flex items-center justify-between gap-2">
        {/* Selector de Etapa */}
        <button className="flex items-center gap-1.5 bg-emerald-950/5 hover:bg-emerald-950/10 text-emerald-900 font-semibold text-xs px-3 py-1.5 rounded-full transition-colors">
          <span>{currentStage}</span>
          <ChevronDown size={14} />
        </button>

        {/* Info Clima + Selector Idioma + SOS */}
        <div className="flex items-center gap-2">
          {/* Botón Selector de Idioma */}
          <button
            onClick={toggleLanguage}
            className="bg-stone-200/80 hover:bg-stone-300/80 text-stone-800 text-xs font-bold px-2 py-1 rounded-full border border-stone-300 transition-colors flex items-center gap-1 cursor-pointer"
            title="Cambiar Idioma / Switch Language"
          >
            <span>{lang === 'es' ? '🇪🇸 ES' : '🇬🇧 EN'}</span>
          </button>

          <div className="flex items-center gap-2 bg-white/80 border border-stone-200/80 rounded-full px-2.5 py-1 text-xs text-stone-700 shadow-sm">
            <span className="flex items-center gap-0.5"><Thermometer size={13} className="text-emerald-700" /> 18°</span>
            <span className="flex items-center gap-0.5 text-sky-600"><CloudRain size={13} /> 15%</span>
          </div>

          <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 active:scale-95 transition-all">
            <AlertCircle size={14} />
            <span>{t('sos')}</span>
          </button>
        </div>
      </div>

      {/* Saludo */}
      <div className="mt-3">
        <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
          {t('greeting')}, {userName}! 👋
        </h1>
      </div>
    </header>
  );
}