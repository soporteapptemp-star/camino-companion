import React, { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/home/HomePage';
import PlacesPage from './pages/places/PlacesPage';
import MapPage from './pages/map/MapPage';
import FavoritesPage from './pages/favorites/FavoritesPage';
import SettingsPage from './pages/settings/SettingsPage';
import { usePwaUpdate } from './hooks/usePwaUpdate';
import { RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const { showUpdatePrompt, updateApp } = usePwaUpdate();

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* Banner de Actualización PWA Segura */}
      {showUpdatePrompt && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-stone-900 text-white p-4 rounded-2xl shadow-2xl border border-stone-700 flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <RefreshCw size={20} className="text-emerald-400 animate-spin" />
            <div>
              <p className="text-xs font-bold">Nueva versión disponible</p>
              <p className="text-[10px] text-stone-400">Actualiza para recibir las últimas mejoras</p>
            </div>
          </div>
          <button
            onClick={updateApp}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
          >
            Actualizar
          </button>
        </div>
      )}

      {activeTab === 'inicio' && <HomePage />}
      {activeTab === 'ruta' && <MapPage />}
      {activeTab === 'lugares' && <PlacesPage />}
      {activeTab === 'favoritos' && <FavoritesPage />}
      {activeTab === 'ajustes' && <SettingsPage />}
    </MainLayout>
  );
}