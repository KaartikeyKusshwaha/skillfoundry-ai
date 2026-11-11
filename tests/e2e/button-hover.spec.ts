import { expect, test } from "@playwright/test";

test("filled button labels retain contrast after the hover fill", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    await page.addInitScript(value => localStorage.setItem("site-theme", value), theme);
    await page.goto("/");
    const buttons = page.locator(".button-primary,.button-accent,.button-ink,.button-danger");
    let checked = 0;
    for (const button of await buttons.all()) {
      if (!await button.isVisible()) continue;
      await button.hover();
      await page.waitForTimeout(320);
      const result = await button.evaluate(element => {
        function luminance(value: string) {
          const rgb = (value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number).map(channel => {
            const c = channel / 255;
            return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
          });
          return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
        }
        const foreground = getComputedStyle(element).color;
        const fill = getComputedStyle(element, "::before").backgroundColor;
        const a = luminance(foreground), b = luminance(fill);
        return { ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05), foreground, fill, label: element.textContent };
      });
      expect(result.ratio, `${theme}: ${JSON.stringify(result)}`).toBeGreaterThanOrEqual(4.5);
      checked++;
    }
    expect(checked).toBeGreaterThan(2);
    for (const kind of ["button-secondary", "button-ghost"]) {
      const control = page.locator(`.${kind}:visible`).first();
      if (!await control.count()) continue;
      await control.hover();
      expect(await control.evaluate(element => getComputedStyle(element, "::before").content)).toBe("none");
    }
  }
});
