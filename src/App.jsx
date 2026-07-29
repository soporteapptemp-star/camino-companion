import React, { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/home/HomePage';
import PlacesPage from './pages/places/PlacesPage';
import MapPage from './pages/map/MapPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'inicio' && <HomePage />}

      {activeTab === 'ruta' && <MapPage />}

      {activeTab === 'lugares' && <PlacesPage />}

      {activeTab === 'favoritos' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm text-center">
          <p className="text-stone-500 font-medium">Página Favoritos (En construcción)</p>
        </div>
      )}

      {activeTab === 'ajustes' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm text-center">
          <p className="text-stone-500 font-medium">Página Ajustes (En construcción)</p>
        </div>
      )}
    </MainLayout>
  );
}