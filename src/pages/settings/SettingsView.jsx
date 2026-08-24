import React, { useState } from 'react';
import { Volume2, VolumeX, ShieldAlert, Database } from 'lucide-react';
import { audioAlertService } from '../../utils/audioAlerts';
import { useLanguage } from '../../context/LanguageContext';

export default function SettingsView() {
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
    if (window.confirm('¿Seguro que deseas limpiar los datos en caché de las rutas?')) {
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
    <div className="p-4 space-y-4 max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="border-b border-stone-200 pb-3">
        <h2 className="text-lg font-black text-stone-900">{t('settings.title')}</h2>
        <p className="text-xs text-stone-500">{t('settings.subtitle')}</p>
      </div>

      {/* 1. Alertas de Audio */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">{t('settings.voiceAlerts')}</p>
              <p className="text-[10px] text-stone-500">{t('settings.voiceDesc')}</p>
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

      {/* 2. Sensibilidad de Desvío */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm space-y-3">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <ShieldAlert size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-900">{t('settings.sensitivity')}</p>
            <p className="text-[10px] text-stone-500">{t('settings.sensitivityDesc')}</p>
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
              className={`py-2 text-xs font-bold rounded-xl border transition-all ${
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

      {/* 3. Datos y Caché Offline */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Database size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">{t('settings.offlineData')}</p>
              <p className="text-[10px] text-stone-500">{t('settings.offlineDesc')}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleClearCache}
          className="w-full py-2.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors"
        >
          {cacheCleared ? '✓ Caché Limpiada' : t('settings.clearCache')}
        </button>
      </div>

      {/* 4. Info de la App */}
      <div className="bg-stone-100 rounded-2xl p-4 border border-stone-200 text-center space-y-1">
        <p className="text-xs font-bold text-stone-700">WayStepv1.0</p>
        <p className="text-[10px] text-stone-400">Diseñado para peregrinos offline</p>
      </div>
    </div>
  );
}