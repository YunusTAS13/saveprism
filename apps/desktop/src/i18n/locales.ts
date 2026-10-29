/**
 * Every UI language is one file, `apps/desktop/locales/<code>.json`. The files are found at build
 * time, so adding a language means adding its file and nothing else.
 */

/** One language file. */
export interface LocaleFile {
  /** The language's own name, the short code on the header button and a square SVG flag. */
  language: { name: string; short: string; flag?: string };
  /** Text of the app shell (the `common` namespace). */
  common: Record<string, unknown>;
  /** Text of the save editor (the `editor` namespace). */
  editor: Record<string, unknown>;
  /** What's new, as `CHANGELOG.md` lines; without it the English notes are shown. */
  whatsNew?: string[];
}

const FILES = import.meta.glob<LocaleFile>("../../locales/*.json", {
  eager: true,
  import: "default",
});

/** The language files by code (the file name): English first, then by code. */
export const LOCALES: Readonly<Record<string, LocaleFile>> = Object.fromEntries(
  Object.entries(FILES)
    .map(([path, file]) => [path.slice(path.lastIndexOf("/") + 1, -".json".length), file] as const)
    .sort(([a], [b]) => (a === "en" ? -1 : b === "en" ? 1 : a.localeCompare(b))),
);
