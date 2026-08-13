import React from 'react';
import { Droplet, Trophy, Sparkles } from 'lucide-react';

export default function ContextBanner({ notice }) {
  if (!notice) return null;

  return (
    <div className="absolute bottom-20 left-4 right-4 z-[1000] bg-stone-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-amber-500/30 backdrop-blur-md transition-all animate-bounce-short flex items-center gap-3 pointer-events-auto">
      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
        {notice.type === 'WATER_NEAR' && <Droplet className="w-5 h-5 text-cyan-400" />}
        {notice.type === 'FINISH_NEAR' && <Trophy className="w-5 h-5 text-amber-400" />}
        {notice.type === 'GENERAL' && <Sparkles className="w-5 h-5 text-emerald-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-stone-100 truncate">{notice.title}</h4>
        <p className="text-[11px] text-stone-300 leading-tight mt-0.5">{notice.message}</p>
      </div>
    </div>
  );
}