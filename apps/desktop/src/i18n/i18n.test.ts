// @vitest-environment node
import { describe, expect, it } from "vitest";
import { detectLanguage, STORAGE_KEY } from "./detect";
import { LOCALES } from "./locales";

function flatten(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object") {
      Object.assign(out, flatten(value as Record<string, unknown>, full));
    } else {
      out[full] = String(value);
    }
  }
  return out;
}

const PLURAL = /_(zero|one|two|few|many|other)$/;
const PLACEHOLDER = /\{\{\s*([^}\s]+)\s*\}\}/g;

/** A key without its plural suffix, so `files_one` and `files_few` share `files`. */
function baseKey(key: string): string {
  return key.replace(PLURAL, "");
}

function placeholders(text: string): string[] {
  return [...text.matchAll(PLACEHOLDER)].map((match) => match[1] ?? "").sort();
}

/** The plural forms a language needs for whole counts, read from the platform's plural rules. */
function pluralForms(code: string): string[] {
  const rules = new Intl.PluralRules(code);
  const forms = new Set(["other"]);
  for (let count = 0; count <= 1000; count += 1) forms.add(rules.select(count));
  return [...forms].sort();
}

const NAMESPACES = ["common", "editor"] as const;
const en = LOCALES.en;
const enFlat = {
  common: flatten(en?.common ?? {}),
  editor: flatten(en?.editor ?? {}),
};

const REQUIRED_KEYS = [
  "empty.title",
  "empty.subtitle",
  "footer.core",
  "footer.coreUnavailable",
  "language.label",
  "theme.toggle",
  "theme.light",
  "theme.dark",
  "theme.system",
];

describe("language files", () => {
  it("ship English first and Turkish", () => {
    expect(Object.keys(LOCALES)[0]).toBe("en");
    expect(Object.keys(LOCALES)).toContain("tr");
  });

  for (const [code, file] of Object.entries(LOCALES)) {
    describe(code, () => {
      it("has a name, a short code and a safe flag", () => {
        expect(file.language.name.trim()).not.toBe("");
        expect(file.language.short).toMatch(/^[A-Z]{2,3}$/);
        if (file.language.flag !== undefined) {
          expect(file.language.flag.startsWith("<svg")).toBe(true);
          expect(file.language.flag).not.toMatch(/<script|\son\w+=|href=/i);
        }
      });

      for (const namespace of NAMESPACES) {
        const flat = flatten(file[namespace]);
        const source = enFlat[namespace];

        it(`has every ${namespace} text of English and nothing extra`, () => {
          const bases = (keys: string[]) => [...new Set(keys.map(baseKey))].sort();
          expect(bases(Object.keys(flat))).toEqual(bases(Object.keys(source)));
        });

        it(`has every plural form it needs in ${namespace}`, () => {
          const forms = pluralForms(code);
          const missing: string[] = [];
          for (const key of Object.keys(source).filter((item) => item.endsWith("_other"))) {
            const base = baseKey(key);
            for (const form of forms) {
              if (flat[`${base}_${form}`] === undefined) missing.push(`${base}_${form}`);
            }
          }
          expect(missing).toEqual([]);
        });

        it(`keeps every placeholder in ${namespace}`, () => {
          const wrong: string[] = [];
          for (const [key, text] of Object.entries(flat)) {
            const base = baseKey(key);
            if (base === key) {
              if (placeholders(text).join() !== placeholders(source[key] ?? "").join()) wrong.push(key);
            } else {
              // A plural form may drop {{count}} ("One file") but never brings in an unknown name.
              const known = new Set(
                Object.entries(source)
                  .filter(([item]) => baseKey(item) === base)
                  .flatMap(([, value]) => placeholders(value)),
              );
              if (placeholders(text).some((name) => !known.has(name))) wrong.push(key);
            }
          }
          expect(wrong).toEqual([]);
        });

        it(`has no empty ${namespace} text`, () => {
          for (const [key, value] of Object.entries(flat)) {
            expect(value.trim(), `empty value for ${key}`).not.toBe("");
          }
        });
      }

      it("contains every key the UI relies on", () => {
        const flat = flatten(file.common);
        for (const key of REQUIRED_KEYS) {
          expect(flat, `${code} missing ${key}`).toHaveProperty(key);
        }
        expect(flat["footer.core"]).toContain("{{version}}");
      });
    });
  }
});

describe("detectLanguage", () => {
  it("uses a valid stored value", () => {
    expect(detectLanguage({ stored: "tr" })).toBe("tr");
    expect(detectLanguage({ stored: "en" })).toBe("en");
  });

  it("starts in English without a valid stored value", () => {
    expect(detectLanguage({ stored: "xx" })).toBe("en");
    expect(detectLanguage({ stored: "" })).toBe("en");
    expect(detectLanguage({ stored: null })).toBe("en");
    expect(detectLanguage({ stored: undefined })).toBe("en");
  });

  it("uses the saveprism.lang storage key", () => {
    expect(STORAGE_KEY).toBe("saveprism.lang");
  });
});
