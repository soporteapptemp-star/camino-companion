import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import GpsSimControl from '../dev/GpsSimControl';
import { useGeolocation } from '../../hooks/useGeolocation';

export default function MainLayout({ children, activeTab, setActiveTab }) {
  const geoProps = useGeolocation();

  return (
    <div className="min-h-screen pb-24 bg-[#F8F6F0] selection:bg-emerald-200">
      <Header />

      <main className="max-w-md mx-auto px-4 mt-2">
        {children}
      </main>

      {/* Widget Flotante del Simulador GPS */}
      <GpsSimControl simProps={geoProps} />

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}