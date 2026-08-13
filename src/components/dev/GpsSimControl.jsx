import React from 'react';
import { Play, Pause, AlertTriangle, Cpu } from 'lucide-react';

export default function GpsSimControl({ simProps }) {
  const { isSimulating, simMode, toggleSimulator, setSimMode } = simProps;

  return (
    <div className="fixed bottom-28 left-0 right-0 z-[9999] px-4 pointer-events-none">
      <div className="max-w-md mx-auto bg-stone-900/95 text-white p-3 rounded-2xl border border-amber-500/50 shadow-2xl backdrop-blur-md font-sans pointer-events-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
            <Cpu size={14} className="animate-pulse" />
            <span>SIMULADOR GPS INTERNO</span>
          </div>
          <button
            onClick={toggleSimulator}
            className={`text-[10px] font-black px-2.5 py-1 rounded-lg transition-all ${
              isSimulating
                ? 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                : 'bg-stone-800 text-amber-300 border border-amber-500/30 hover:bg-stone-700'
            }`}
          >
            {isSimulating ? 'DESACTIVAR' : 'ACTIVAR'}
          </button>
        </div>

        {isSimulating ? (
          <div className="flex items-center gap-2 pt-1">
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
          <p className="text-[10px] text-stone-400 font-medium">
            GPS Real activo. Pulsa <strong className="text-amber-300">ACTIVAR</strong> para simular el avance por la ruta.
          </p>
        )}
      </div>
    </div>
  );
}