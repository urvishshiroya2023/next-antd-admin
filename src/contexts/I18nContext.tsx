"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, defaultLocale, LOCALE_STORAGE_KEY } from "@/config/i18n.config";
import { getTranslation, TranslationKeys } from "@/locales";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize locale from localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale;
    if (savedLocale && ['en', 'hi', 'fr', 'de'].includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
    setIsLoading(false);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
  };

  const t = getTranslation(locale);

  const value: I18nContextType = {
    locale,
    setLocale,
    t,
    isLoading,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

// Helper hook for getting nested translation values
export function useTranslation() {
  const { t } = useI18n();
  
  const translate = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let value: any = t;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    return value || fallback || key;
  };
  
  return { t, translate };
}
