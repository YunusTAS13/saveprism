/** Display data of the languages the app ships with, read from their files (no React, no Tauri). */
import type { Language } from "./detect";
import { LOCALES } from "./locales";

/** The short code for a language. */
export function languageShortCode(language: Language): string {
  return LOCALES[language]?.language.short ?? language.toUpperCase();
}

/** The language's own name, never translated. */
export function languageName(language: Language): string {
  return LOCALES[language]?.language.name ?? language;
}

/** The language's flag as SVG markup, when its file has one. */
export function languageFlag(language: Language): string | undefined {
  return LOCALES[language]?.language.flag;
}
