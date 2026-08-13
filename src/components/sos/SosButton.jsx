import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, MessageSquare, Copy, Check, X, MapPin } from 'lucide-react';
import { useGeolocation } from '../../hooks/useGeolocation';

export default function SosButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const location = useGeolocation();

  const lat = location.latitude ? location.latitude.toFixed(6) : null;
  const lng = location.longitude ? location.longitude.toFixed(6) : null;
  const accuracy = location.accuracy ? Math.round(location.accuracy) : null;

  const textLocation = lat && lng 
    ? `¡EMERGENCIA PEREGRINO! Mi ubicación exactas: https://maps.google.com/?q=${lat},${lng} (Lat: ${lat}, Lng: ${lng}, Precisión: ±${accuracy}m)`
    : 'Buscando cobertura GPS para determinar posición exacta...';

  const copyToClipboard = () => {
    if (!lat || !lng) return;
    navigator.clipboard.writeText(textLocation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Botón flotante o integrado de SOS */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3.5 px-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
      >
        <AlertTriangle size={20} className="animate-pulse" />
        <span>EMERGENCIA / SOS 112</span>
      </button>

      {/* Modal de Asistencia de Emergencia */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 text-white w-full max-w-md rounded-3xl p-6 space-y-5 animate-in fade-in slide-in-from-bottom-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-500 font-extrabold text-sm uppercase tracking-wider">
                <AlertTriangle size={18} />
                <span>Protocolo de Emergencia</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 bg-stone-800 rounded-full text-stone-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Coordenadas para dictar al 112 */}
            <div className="bg-stone-800/90 border border-stone-700 p-4 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Tu Posición Actual (Dictar al 112)
              </span>
              {lat && lng ? (
                <div>
                  <div className="text-xl font-mono font-black text-emerald-400">
                    {lat}, {lng}
                  </div>
                  <span className="text-xs text-stone-400 flex items-center gap-1 mt-1 font-medium">
                    <MapPin size={12} className="text-emerald-500" />
                    Margen de error GPS: ±{accuracy} metros
                  </span>
                </div>
              ) : (
                <p className="text-xs text-amber-400 font-bold animate-pulse">
                  Obteniendo señal GPS precisa...
                </p>
              )}
            </div>

            {/* Acciones Rápidas */}
            <div className="space-y-2.5">
              {/* Llamada 112 */}
              <a
                href="tel:112"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-base transition-all active:scale-95 shadow-md"
              >
                <PhoneCall size={20} />
                <span>Llamar al 112 (Gratuito)</span>
              </a>

              {/* Enviar SMS con Coordenadas */}
              {lat && lng && (
                <a
                  href={`sms:?body=${encodeURIComponent(textLocation)}`}
                  className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs transition-all border border-stone-700"
                >
                  <MessageSquare size={16} />
                  <span>Enviar Coordenadas por SMS</span>
                </a>
              )}

              {/* Copiar Ubicación */}
              {lat && lng && (
                <button
                  onClick={copyToClipboard}
                  className="w-full bg-stone-800/50 hover:bg-stone-800 text-stone-300 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 text-xs transition-all border border-stone-800"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  <span>{copied ? '¡Coordenadas copiadas!' : 'Copiar Texto de Ubicación'}</span>
                </button>
              )}
            </div>

            <p className="text-[10px] text-center text-stone-500 font-medium">
              El 112 funciona incluso sin cobertura de tu operador utilizando cualquier red disponible en la zona.
            </p>
          </div>
        </div>
      )}
    </>
  );
}