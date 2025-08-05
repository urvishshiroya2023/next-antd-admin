export const locales = ['en', 'hi', 'fr', 'de'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  hi: 'हिंदी',
  fr: 'Français',
  de: 'Deutsch',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  hi: '🇮🇳',
  fr: '🇫🇷',
  de: '🇩🇪',
};

// Storage key for locale preference
export const LOCALE_STORAGE_KEY = 'preferred-locale';
