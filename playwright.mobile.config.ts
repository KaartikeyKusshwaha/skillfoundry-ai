import { defineConfig } from "@playwright/test";
import base from "./playwright.config";
export default defineConfig({ ...base, testMatch: /mobile\.spec\.ts/, projects: [
  { name: "touch-chromium", use: { browserName: "chromium", hasTouch: true, isMobile: true } },
  { name: "touch-webkit", use: { browserName: "webkit", hasTouch: true, isMobile: true } },
] });
