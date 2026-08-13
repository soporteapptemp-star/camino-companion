import { useState, useEffect } from 'react';

export function usePwaUpdate() {
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    // Escuchar cuando el nuevo SW toma el control para recargar la app suavemente
    let refreshing = false;
    const handleControllerChange = () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    };
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    // Registrar Service Worker con detección de updates
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      // Si ya hay un SW esperando activación
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
        setShowUpdatePrompt(true);
      }

      // Si se detecta un nuevo SW instalándose
      registration.onupdatefound = () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.onstatechange = () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setWaitingWorker(newWorker);
            setShowUpdatePrompt(true);
          }
        };
      };
    }).catch((err) => {
      console.error('Error registrando ServiceWorker:', err);
    });

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  const updateApp = () => {
    if (waitingWorker) {
      // Ordenar al SW que ignore el waiting y tome control inmediato
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    setShowUpdatePrompt(false);
  };

  return { showUpdatePrompt, updateApp };
}