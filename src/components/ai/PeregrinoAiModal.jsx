import React, { useState } from 'react';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';
import { consultarIA } from '../../services/ai/aiService';

export default function PeregrinoAiModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy tu copiloto IA para el Camino Inglés. ¿En qué te puedo ayudar hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    "¿Dónde hay agua potable?",
    "¿Dónde comer en Betanzos?",
    "Consejos para ampollas"
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await consultarIA(query);
      setMessages((prev) => [...prev, { sender: 'bot', text: responseText }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Ups, no he podido procesar tu consulta ahora mismo.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-stone-900 text-white w-full max-w-md h-[90vh] sm:h-[600px] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden border border-stone-800 shadow-2xl animate-in slide-in-from-bottom duration-200">
        
        {/* Header Modal */}
        <div className="p-4 bg-stone-950/90 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-900/80 rounded-xl text-emerald-400">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                Copiloto IA <span className="bg-emerald-900 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-mono">v5.0</span>
              </h3>
              <p className="text-[11px] text-stone-400">Betanzos → Hospital de Bruma</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-white rounded-full bg-stone-800/50">
            <X size={18} />
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`p-2 rounded-full text-xs shrink-0 ${m.sender === 'user' ? 'bg-emerald-700 text-white' : 'bg-stone-800 text-emerald-400'}`}>
                {m.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                m.sender === 'user' 
                  ? 'bg-emerald-800 text-white rounded-tr-none' 
                  : 'bg-stone-800/90 text-stone-200 border border-stone-700/50 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-stone-400 italic pl-8">
              <Sparkles size={14} className="animate-spin text-emerald-400" />
              <span>Consultando guía del Camino...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 border-t border-stone-800/60 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="text-[11px] bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-1.5 rounded-full whitespace-nowrap border border-stone-700/50 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input con margen para navegadores móviles */}
        <div className="p-3 pb-8 sm:pb-3 bg-stone-950/95 border-t border-stone-800 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu consulta..."
            className="flex-1 bg-stone-800 text-xs text-white placeholder-stone-400 px-3.5 py-2.5 rounded-full border border-stone-700 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-colors"
          >
            <Send size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}