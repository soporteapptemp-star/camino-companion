import React from 'react';
import { Compass, PhoneCall, ShieldAlert } from 'lucide-react';
import etapa4Data from '../../data/routes/camino-ingles/etapa4.json';

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-black text-stone-900">Ajustes</h2>
        <p className="text-xs text-stone-500 font-medium">
          Configuración del perfil y opciones de seguridad
        </p>
      </div>

      {/* Opción: Selección de Ruta Unificada */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
            <Compass size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Ruta Seleccionada</h3>
            <p className="text-xs text-stone-500">
              {etapa4Data.camino} · Etapa {etapa4Data.etapa} ({etapa4Data.origen} → {etapa4Data.destino})
            </p>
          </div>
        </div>
      </div>

      {/* Opción: Botón SOS / Emergencias */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-4 rounded-3xl shadow-sm space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-2xl">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold">Modo Emergencia SOS</h3>
            <p className="text-xs text-red-100">Contacto directo con emergencias 112</p>
          </div>
        </div>
        <a
          href="tel:112"
          className="w-full bg-white text-red-700 font-bold text-xs py-2.5 rounded-full flex items-center justify-center gap-2 mt-2"
        >
          <PhoneCall size={14} />
          <span>Llamar al 112</span>
        </a>
      </div>

      {/* Versión e información */}
      <div className="pt-4 text-center">
        <span className="text-[11px] font-mono text-stone-400">
          Camino Companion v5.0 · PWA Ready
        </span>
      </div>
    </div>
  );
}