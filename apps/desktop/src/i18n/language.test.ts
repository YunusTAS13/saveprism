// @vitest-environment node
import { describe, expect, it } from "vitest";
import { SUPPORTED_LANGUAGES } from "./detect";
import { languageFlag, languageName, languageShortCode } from "./language";

describe("language menu data", () => {
  it("has a short code, an own name and a flag for every shipped language", () => {
    for (const language of SUPPORTED_LANGUAGES) {
      expect(languageShortCode(language)).toMatch(/^[A-Z]{2,3}$/);
      expect(languageName(language).trim()).not.toBe("");
      expect(languageFlag(language)).toMatch(/^<svg/);
    }
  });

  it("shows the language's own name, not a translation", () => {
    expect(languageName("en")).toBe("English");
    expect(languageName("tr")).toBe("Türkçe");
  });

  it("falls back to the code for a language without a file", () => {
    expect(languageName("xx")).toBe("xx");
    expect(languageShortCode("xx")).toBe("XX");
    expect(languageFlag("xx")).toBeUndefined();
  });
});
