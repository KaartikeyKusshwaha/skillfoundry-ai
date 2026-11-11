import { expect, test } from "@playwright/test";
test.use({ hasTouch: true });

test("phone and tablet layouts fit and navigation is touch accessible", async ({ page }) => {
  test.setTimeout(90000);
  for (const theme of ["light", "dark"]) {
    await page.addInitScript(value => localStorage.setItem("site-theme", value), theme);
    for (const width of [320, 360, 390, 430, 768, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.locator("[data-reveal]").evaluateAll(items => items.forEach(item => item.classList.add("is-visible")));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${theme} at ${width}px`).toBe(true);
      const switcher = page.locator(".theme-toggle");
      await expect(switcher).toBeInViewport();
      if (width <= 850) {
        expect((await switcher.boundingBox())!.width).toBeGreaterThanOrEqual(44);
        const menu = page.getByRole("button", { name: "Open navigation" });
        await menu.tap();
        await expect(page.locator(".nav-links.open")).toBeVisible();
        await expect(page.locator(".nav-links.open a").first()).toBeInViewport();
        await page.getByRole("button", { name: "Close navigation" }).tap();
      }
    }
  }
});

test("phone filters or enquiry forms remain usable in portrait and landscape", async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const animal = (await page.title()).includes("Practo");
  if (animal) {
    await page.getByRole("button", { name: "Filter care" }).tap();
    const sheet = page.getByRole("dialog");
    await sheet.locator("select").first().selectOption("Cats");
    await sheet.getByRole("button", { name: "Show matching care" }).tap();
    await expect(page).toHaveURL(/species=Cats/);
    await page.getByRole("button", { name: "Filter results" }).tap();
  } else {
    await page.route("**/api/leads", route => route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ leadId: "mobile-test" }) }));
    await page.getByRole("button", { name: "Reserve your seat" }).first().tap();
    const dialog = page.getByRole("dialog");
    await dialog.locator('[name="name"]').fill("Mobile Learner");
    await dialog.locator('[name="email"]').fill("learner@example.test");
    await dialog.locator('[name="phone"]').fill("9876543210");
    await dialog.locator('[name="consent"]').check();
    await dialog.getByRole("button", { name: "Continue" }).tap();
    await expect(dialog.locator('[name="programme"]')).toBeVisible();
  }
  const dialog = page.getByRole("dialog");
  expect(await dialog.locator("select").first().evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16);
  await page.setViewportSize({ width: 844, height: 390 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await dialog.boundingBox())!.height).toBeLessThanOrEqual(390);
  await dialog.getByRole("button").last().scrollIntoViewIfNeeded();
  await expect(dialog.getByRole("button").last()).toBeInViewport();
});

