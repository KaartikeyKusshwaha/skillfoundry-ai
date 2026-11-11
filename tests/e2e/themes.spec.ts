import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("saved themes keep pages and dialogs readable", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    await page.addInitScript(value => localStorage.setItem("site-theme", value), theme);
    for (const route of ["/", "/privacy"]) {
      await page.goto(route);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await page.locator("[data-reveal]").evaluateAll(items => items.forEach(item => item.classList.add("is-visible")));
      await page.waitForTimeout(600);
      expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
      if (route === "/") await page.getByRole("button", { name: "Reserve your seat" }).first().click();
      expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    }
  }
});

test("theme follows device initially and the mobile switch persists", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeInViewport();
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

