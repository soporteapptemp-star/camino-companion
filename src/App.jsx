import React, { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/home/HomePage';
import PlacesPage from './pages/places/PlacesPage';
import MapPage from './pages/map/MapPage';
import FavoritesPage from './pages/favorites/FavoritesPage';
import SettingsPage from './pages/settings/SettingsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'inicio' && <HomePage />}
      {activeTab === 'ruta' && <MapPage />}
      {activeTab === 'lugares' && <PlacesPage />}
      {activeTab === 'favoritos' && <FavoritesPage />}
      {activeTab === 'ajustes' && <SettingsPage />}
    </MainLayout>
  );
}