import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Navigation, Volume2, VolumeX, Utensils, MessageSquare, ArrowLeft } from 'lucide-react';
import PeregrinoAiModal from '../ai/PeregrinoAiModal';
import { useRouteStatus, ROUTE_STATES } from '../../hooks/useRouteStatus';
import etapa4Data from '../../data/routes/camino-ingles/etapa4.json';

export default function CopilotCard({ distanceToGpx = 0, speed: propSpeed }) {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const lastSpokenRef = useRef('');
  
  // Hook central de Navegación con Histéresis
  const { routeState, distanceToGpx: distance, accuracy, speed: hookSpeed, gpsStatus, error } = useRouteStatus(distanceToGpx);

  const nextService = etapa4Data?.proximoServicio;
  const nextIndication = etapa4Data?.siguienteIndicacion;

  // Cálculo seguro de velocidad: prioriza la prop procesada (km/h) si viene definida, sino usa la del hook
  const displaySpeed = useMemo(() => {
    if (propSpeed !== undefined && propSpeed !== null) {
      return propSpeed;
    }
    const rawSpeed = hookSpeed || 0;
    const calculated = rawSpeed * 3.6;
    return isNaN(calculated) ? '0.0' : calculated.toFixed(1);
  }, [propSpeed, hookSpeed]);

  // Locuciones de voz (TTS)
  const speakAnnouncement = (text) => {
    if (isMuted || !('speechSynthesis' in window) || lastSpokenRef.current === text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
    lastSpokenRef.current = text;
  };

  useEffect(() => {
    if (nextIndication && nextIndication.texto) {
      speakAnnouncement(`En ${nextIndication.distanciaM} metros, ${nextIndication.texto}`);
    }
  }, [nextIndication?.texto, isMuted]);

  // Estado visual del GPS
  const isSearching = gpsStatus === 'SEARCHING' || accuracy === null;
  const hasError = !!error;

  // Estilos y badges dinámicos según el RouteState unificado
  const statusConfig = {
    [ROUTE_STATES.ON_ROUTE]: {
      label: 'EN RUTA OFICIAL',
      cardGradient: 'from-emerald-800 to-emerald-950 border-emerald-700/50',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      iconColor: 'text-emerald-300 fill-emerald-300'
    },
    [ROUTE_STATES.CHECK_ROUTE]: {
      label: `COMPROBAR RUTA (${distance}m)`,
      cardGradient: 'from-amber-900 to-amber-950 border-amber-700/50',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      iconColor: 'text-amber-300 fill-amber-300'
    },
    [ROUTE_STATES.OFF_ROUTE]: {
      label: `POSIBLE DESVÍO (${distance}m)`,
      cardGradient: 'from-rose-900 to-rose-950 border-rose-700/50',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      iconColor: 'text-rose-300 fill-rose-300'
    }
  };

  const currentStatus = statusConfig[routeState] || statusConfig[ROUTE_STATES.ON_ROUTE];

  return (
    <div className="space-y-4 font-sans">
      {/* TARJETA 1: Alerta / Estado de Navegación Sincronizado */}
      <div className={`bg-gradient-to-br ${currentStatus.cardGradient} text-white rounded-3xl p-5 shadow-lg relative overflow-hidden border transition-all duration-300`}>
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Navigation size={22} className={`${currentStatus.iconColor} rotate-45`} />
          </div>
          <span className={`text-[10px] ${currentStatus.badgeBg} px-3 py-1 rounded-full uppercase tracking-wider font-extrabold border transition-all`}>
            {currentStatus.label}
          </span>
        </div>

        <p className="text-xs uppercase tracking-wider text-emerald-200 font-bold">Navegación Activa</p>
        <h2 className="text-xl font-black tracking-tight leading-snug mt-1">
          {etapa4Data.origen} → {etapa4Data.destino}
        </h2>
        <p className="text-xs text-emerald-100/90 mt-1 font-medium">
          {routeState === ROUTE_STATES.OFF_ROUTE 
            ? 'Te has alejado del trazado. Revisa la pantalla del mapa para reconectar.' 
            : `Sigue las flechas amarillas hacia ${etapa4Data.destino}`}
        </p>
      </div>

      {/* TARJETA 2: Copiloto Inteligente (Métricas GPS en Tiempo Real) */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 shadow-md border border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isSearching ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Copiloto Inteligente</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                const nextState = !isMuted;
                setIsMuted(nextState);
                if (nextState) window.speechSynthesis?.cancel();
              }}
              className="p-2 bg-stone-800 rounded-full text-stone-300 hover:text-white transition-colors"
              title={isMuted ? "Activar Voz" : "Silenciar Voz"}
            >
              {isMuted ? <VolumeX size={16} className="text-rose-400" /> : <Volume2 size={16} />}
            </button>
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
              isSearching 
                ? 'bg-stone-800 text-amber-400 border-stone-700' 
                : hasError 
                  ? 'bg-red-950 text-red-400 border-red-800'
                  : 'bg-emerald-950 text-emerald-400 border-emerald-800'
            }`}>
              {isSearching ? 'Buscando GPS...' : hasError ? 'Sin acceso GPS' : `GPS Precisión: ±${accuracy ?? 5}m`}
            </span>
          </div>
        </div>

        {/* Métricas Reales */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700/50 text-center">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Velocidad</span>
            <span className="text-base font-black text-white">
              {displaySpeed} <span className="text-[10px] font-normal text-stone-400">km/h</span>
            </span>
          </div>
          <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700/50 text-center">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Etapa</span>
            <span className="text-base font-black text-white">{etapa4Data.distanciaTotalKm} <span className="text-[10px] font-normal text-stone-400">km</span></span>
          </div>
          <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700/50 text-center">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Dificultad</span>
            <span className="text-base font-black text-emerald-400">{etapa4Data.dificultad}</span>
          </div>
        </div>

        {/* Próximo Servicio */}
        {nextService && (
          <div className="bg-stone-800/50 border border-stone-700/50 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-700/60 rounded-xl text-emerald-400">
                <Utensils size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase block leading-none">Próximo servicio</span>
                <span className="text-sm font-bold text-stone-100">{nextService.nombre}</span>
              </div>
            </div>
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/50 text-xs font-bold px-2.5 py-1 rounded-full">
              {nextService.distanciaM} m
            </span>
          </div>
        )}
      </div>

      {/* TARJETA 3: Asistente IA del Peregrino */}
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

      {/* TARJETA 4: Siguiente Giro / Indicación Oficial */}
      {nextIndication && (
        <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center gap-3 border border-slate-800">
          <div className="p-3 bg-emerald-900/80 rounded-xl text-emerald-400">
            <ArrowLeft size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase block">En {nextIndication.distanciaM} metros</span>
            <p className="text-xs font-bold text-stone-100">{nextIndication.texto}</p>
          </div>
        </div>
      )}

      {/* Modal de IA */}
      <PeregrinoAiModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}