import React, { useState, useEffect } from 'react';
import { downloadStageTiles, checkTilesDownloaded } from '../../utils/offlineTileDownloader';
import { Download, CheckCircle2, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export default function OfflineManager() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Detector de estado de red en tiempo real
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Comprobar si los tiles ya están precacheados
    checkTilesDownloaded().then((downloaded) => setIsDownloaded(downloaded));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleDownload = async () => {
    if (!isOnline) {
      alert('Necesitas conexión a Internet para descargar el mapa de la etapa.');
      return;
    }

    setIsDownloading(true);
    setProgress(0);

    try {
      await downloadStageTiles((percent) => {
        setProgress(percent);
      });
      setIsDownloaded(true);
    } catch (error) {
      console.error('Error durante la descarga:', error);
      alert('Hubo un problema al descargar las teselas del mapa.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4 my-4">
      {/* 1. Indicador de Red y Estado de la Etapa */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Wifi size={13} /> 🟢 ONLINE
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <WifiOff size={13} /> 🟠 OFFLINE
            </span>
          )}
        </div>

        {/* Estado global de la etapa */}
        <div className="text-right">
          {isDownloaded ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={14} /> Ruta descargada ✓
            </span>
          ) : (
            <span className="text-xs font-bold text-rose-500">
              Mapa no descargado 🛑
            </span>
          )}
        </div>
      </div>

      {/* 2. Info de la Etapa */}
      <div>
        <h4 className="font-bold text-stone-800 text-sm">Betanzos → Hospital de Bruma</h4>
        <p className="text-xs text-stone-500">Etapa 4 • 24,1 km • Incluye Mapa, Ruta y POIs</p>
      </div>

      {/* 3. Botón de Acción / Progreso */}
      {isDownloading ? (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-stone-600 font-medium">
            <span className="flex items-center gap-1">
              <RefreshCw size={12} className="animate-spin text-emerald-600" /> Descargando mapa de la etapa…
            </span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={handleDownload}
          disabled={!isOnline || isDownloaded}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            isDownloaded
              ? 'bg-stone-100 text-emerald-700 border border-emerald-200 cursor-default'
              : !isOnline
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
              : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-md active:scale-95'
          }`}
        >
          {isDownloaded ? (
            <>
              <CheckCircle2 size={15} /> ETAPA LISTA PARA MODO AVIÓN
            </>
          ) : (
            <>
              <Download size={15} /> DESCARGAR ETAPA OFFLINE
            </>
          )}
        </button>
      )}
    </div>
  );
}