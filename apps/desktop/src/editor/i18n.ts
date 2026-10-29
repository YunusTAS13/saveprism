import i18next from "i18next";
import { LOCALES } from "@/i18n/locales";

export const NS = "editor";

let registered = false;

/**
 * Registers the `editor` namespace on the app's i18n instance. Call it at render time (after
 * `initI18n()` ran in main.tsx), not at import time. Safe to call repeatedly.
 */
export function registerEditorBundles(): void {
  if (registered || !i18next.isInitialized) return;
  registered = true;
  for (const [code, file] of Object.entries(LOCALES)) {
    i18next.addResourceBundle(code, NS, file.editor, true, true);
  }
}
