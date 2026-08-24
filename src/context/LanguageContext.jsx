import React, { createContext, useContext, useState } from 'react';
import { translations } from '../data/translations.js';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('es');

  const t = (key, fallbackText = '') => {
    const keys = key.split('.');
    
    // 1. Buscar en el idioma activo
    let value = translations[lang];
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        value = null;
        break;
      }
    }

    if (value !== null && value !== undefined) return value;

    // 2. Fallback a español si falla el idioma activo
    let fallbackValue = translations['es'];
    for (const k of keys) {
      if (fallbackValue && fallbackValue[k] !== undefined) {
        fallbackValue = fallbackValue[k];
      } else {
        fallbackValue = null;
        break;
      }
    }

    if (fallbackValue !== null && fallbackValue !== undefined) return fallbackValue;

    // 3. Devolver fallback explícito o la clave original
    return fallbackText || key;
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);