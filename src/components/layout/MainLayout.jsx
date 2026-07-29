import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

export default function MainLayout({ children, activeTab, setActiveTab }) {
  return (
    <div className="min-h-screen pb-24 bg-[#F8F6F0] selection:bg-emerald-200">
      {/* Cabecera global */}
      <Header />

      {/* Contenido de la página actual */}
      <main className="max-w-md mx-auto px-4 mt-2">
        {children}
      </main>

      {/* Navegación inferior global */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}