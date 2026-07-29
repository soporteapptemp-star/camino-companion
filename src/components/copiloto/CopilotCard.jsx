import React, { useState } from 'react';
import { Navigation, Volume2, Utensils, MessageSquare, ArrowLeft } from 'lucide-react';
import PeregrinoAiModal from '../ai/PeregrinoAiModal';

export default function CopilotCard() {
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* TARJETA 1: Alerta de Desvío de Ruta (Roja) */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Navigation size={26} className="text-white fill-white rotate-45" />
          </div>
          <button className="bg-red-800/60 hover:bg-red-900/60 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1 backdrop-blur-sm">
            <span>Desviado</span>
          </button>
        </div>

        <p className="text-xs uppercase tracking-wider text-red-200 font-bold">¡Atención!</p>
        <h2 className="text-2xl font-black tracking-tight leading-none mt-1">RECUPERAR RUTA</h2>
        <p className="text-sm text-red-100 mt-1 font-medium">Estás a 862m de las flechas amarillas</p>
      </div>

      {/* TARJETA 2: Copiloto Inteligente (Verde Oscuro) */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 shadow-md border border-stone-800 space-y-4">
        {/* Cabecera del Copiloto */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Copiloto Inteligente</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-stone-800 rounded-full text-stone-300 hover:text-white">
              <Volume2 size={16} />
            </button>
            <span className="bg-stone-800 text-[10px] text-amber-400 font-semibold px-2.5 py-1 rounded-full border border-stone-700">
              Buscando GPS...
            </span>
          </div>
        </div>

        {/* Métricas: Ritmo, Falta, ETA */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700/50 text-center">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Ritmo</span>
            <span className="text-lg font-black text-white">0 <span className="text-xs font-normal text-stone-400">km/h</span></span>
          </div>
          <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700/50 text-center">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Falta</span>
            <span className="text-lg font-black text-white">16.6 <span className="text-xs font-normal text-stone-400">km</span></span>
          </div>
          <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700/50 text-center">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">ETA</span>
            <span className="text-lg font-black text-white">19:35</span>
          </div>
        </div>

        {/* Próximo Servicio */}
        <div className="bg-stone-800/50 border border-stone-700/50 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-stone-700/60 rounded-xl text-emerald-400">
              <Utensils size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase block leading-none">Próximo servicio</span>
              <span className="text-sm font-bold text-stone-100">Mesón O Pote</span>
            </div>
          </div>
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/50 text-xs font-bold px-2.5 py-1 rounded-full">
            778 m
          </span>
        </div>
      </div>

      {/* TARJETA 3: Asistente IA del Peregrino (Gradiente Verde) */}
      <button 
        onClick={() => setIsAiOpen(true)}
        className="w-full bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-5 text-left shadow-md hover:opacity-95 transition-all flex items-start justify-between group cursor-pointer"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-emerald-300" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">Asistente IA del Peregrino</span>
          </div>
          <h3 className="text-base font-black text-white leading-snug">¿Dudas sobre la etapa u hostales?</h3>
          <p className="text-xs text-emerald-100/80 font-medium">Pregunta sobre agua, ampollas, menú o albergues</p>
        </div>
      </button>

      {/* TARJETA 4: Siguiente Giro / Dirección */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center gap-3 border border-slate-800">
        <div className="p-3 bg-emerald-900/80 rounded-xl text-emerald-400">
          <ArrowLeft size={22} />
        </div>
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase block">En 840 metros</span>
          <p className="text-xs font-bold text-stone-100">Gira a la izquierda al salir de la Plaza García Hermanos</p>
        </div>
      </div>

      {/* Modal interactivo de IA */}
      <PeregrinoAiModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}