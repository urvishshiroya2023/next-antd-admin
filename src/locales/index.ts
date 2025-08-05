import { en } from './en';
import { hi } from './hi';
import { fr } from './fr';
import { de } from './de';
import type { Locale } from '@/config/i18n.config';

export const translations = {
  en,
  hi,
  fr,
  de,
} as const;

export type TranslationKeys = typeof en;

export function getTranslation(locale: Locale): TranslationKeys {
  return translations[locale] || translations.en;
}
