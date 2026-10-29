// @vitest-environment node
import { describe, expect, it } from "vitest";
import indexHtml from "../../index.html?raw";
import tauriConfig from "../../src-tauri/tauri.conf.json";

describe("content security policy", () => {
  it("keeps index.html free of inline style blocks", () => {
    // An inline <style> makes Tauri add a nonce to style-src in the installed app; the browser then
    // ignores 'unsafe-inline' and blocks the style elements that apply the app colour.
    expect(indexHtml).not.toMatch(/<style[\s>]/i);
  });

  it("allows the style elements the app writes at run time", () => {
    const csp = tauriConfig.app.security.csp;
    const styleSrc = csp.split(";").find((part) => part.trim().startsWith("style-src")) ?? "";
    expect(styleSrc).toContain("'unsafe-inline'");
  });
});
