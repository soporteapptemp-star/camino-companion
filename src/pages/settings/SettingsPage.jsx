import React, { useState } from 'react';
import { Compass, PhoneCall, ShieldAlert, Volume2, VolumeX, Database, Sliders } from 'lucide-react';
import etapa4Data from '../../data/routes/camino-ingles/etapa4.json';
import { useLanguage } from '../../context/LanguageContext';

export default function SettingsPage() {
  const { t } = useLanguage();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sensitivity, setSensitivity] = useState('50'); // metros
  const [cacheCleared, setCacheCleared] = useState(false);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (!nextState && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleClearCache = () => {
    if (window.confirm('¿Seguro que deseas limpiar los datos en caché de los mapas y rutas?')) {
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 3000);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      <div>
        <h2 className="text-2xl font-black text-stone-900">{t('settings.title')}</h2>
        <p className="text-xs text-stone-500 font-medium">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* 1. Selección de Ruta Unificada */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl shrink-0">
            <Compass size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">{t('settings.selectedRoute')}</h3>
            <p className="text-xs text-stone-500">
              {etapa4Data.camino} · Etapa {etapa4Data.etapa} ({etapa4Data.origen} → {etapa4Data.destino})
            </p>
          </div>
        </div>
      </div>

      {/* 2. Control de Alertas de Audio y Voz */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl shrink-0">
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">{t('settings.voiceAlerts')}</h3>
              <p className="text-xs text-stone-500">{t('settings.voiceDesc')}</p>
            </div>
          </div>
          <button
            onClick={toggleSound}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              soundEnabled ? 'bg-emerald-600' : 'bg-stone-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 3. Sensibilidad de Desvío */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-2">
          <div className="p-2.5 bg-blue-100 text-blue-800 rounded-2xl shrink-0">
            <Sliders size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">{t('settings.sensitivity')}</h3>
            <p className="text-xs text-stone-500">{t('settings.sensitivityDesc')}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { label: t('settings.strict'), val: '30' },
            { label: t('settings.normal'), val: '50' },
            { label: t('settings.relax'), val: '80' },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => setSensitivity(item.val)}
              className={`py-2 text-xs font-bold rounded-2xl border transition-all ${
                sensitivity === item.val
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Almacenamiento Offline y Caché */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-100 text-cyan-800 rounded-2xl shrink-0">
              <Database size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">{t('settings.offlineData')}</h3>
              <p className="text-xs text-stone-500">{t('settings.offlineDesc')}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleClearCache}
          className="w-full py-2.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-2xl hover:bg-rose-100 transition-colors"
        >
          {cacheCleared ? '✓ Caché Limpiada Correctamente' : t('settings.clearCache')}
        </button>
      </div>

      {/* 5. Botón SOS / Emergencias */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-4 rounded-3xl shadow-sm space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-2xl">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold">{t('settings.sosTitle')}</h3>
            <p className="text-xs text-red-100">{t('settings.sosDesc')}</p>
          </div>
        </div>
        <a
          href="tel:112"
          className="w-full bg-white text-red-700 font-bold text-xs py-2.5 rounded-full flex items-center justify-center gap-2 mt-2 shadow-md hover:bg-stone-100 transition-colors"
        >
          <PhoneCall size={14} />
          <span>{t('settings.call112')}</span>
        </a>
      </div>

      {/* Versión e información */}
      <div className="pt-2 text-center">
        <span className="text-[11px] font-mono text-stone-400">
          WayStep v5.0 · PWA Ready
        </span>
      </div>
    </div>
  );
}