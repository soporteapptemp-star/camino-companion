import React from 'react';
import { Play, Pause, AlertTriangle, Navigation, Cpu } from 'lucide-react';

export default function GpsSimControl({ simProps }) {
  const { isSimulating, simMode, toggleSimulator, setSimMode } = simProps;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[9999] bg-stone-900/95 text-white p-3 rounded-2xl border border-amber-500/40 shadow-2xl backdrop-blur-md font-sans">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
          <Cpu size={14} className="animate-pulse" />
          <span>SIMULADOR GPS INTERNO</span>
        </div>
        <button
          onClick={toggleSimulator}
          className="text-[10px] bg-stone-800 hover:bg-stone-700 px-2 py-1 rounded-md text-stone-300 font-mono"
        >
          {isSimulating ? 'Desactivar' : 'Activar'}
        </button>
      </div>

      {isSimulating ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSimMode('ROUTE')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
              simMode === 'ROUTE'
                ? 'bg-emerald-600 border-emerald-400 text-white'
                : 'bg-stone-800 border-stone-700 text-stone-400'
            }`}
          >
            <Play size={12} />
            <span>Caminar</span>
          </button>

          <button
            onClick={() => setSimMode('PAUSE')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
              simMode === 'PAUSE'
                ? 'bg-amber-600 border-amber-400 text-white'
                : 'bg-stone-800 border-stone-700 text-stone-400'
            }`}
          >
            <Pause size={12} />
            <span>Pausar</span>
          </button>

          <button
            onClick={() => setSimMode('OFF_ROUTE')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
              simMode === 'OFF_ROUTE'
                ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                : 'bg-stone-800 border-stone-700 text-stone-400'
            }`}
          >
            <AlertTriangle size={12} />
            <span>Desviar</span>
          </button>
        </div>
      ) : (
        <p className="text-[11px] text-stone-400">
          Modo GPS Real Activo. Haz clic en "Activar" para simular la caminata por el trazado.
        </p>
      )}
    </div>
  );
}