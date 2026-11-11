import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("R1 pages meet the accessibility scan", async ({ page }) => {
  for (const route of ["/"]) {
    await page.goto(route);
    await page.waitForFunction(() => Array.from(document.querySelectorAll("[data-reveal]")).some((item) => item.classList.contains("is-visible")));
    await page.locator("[data-reveal]").evaluateAll((items) => items.forEach((item) => item.classList.add("is-visible")));
    await page.waitForTimeout(800);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations.map(({ id, impact, description, nodes }) => ({ id, impact, description, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) })), `${route} accessibility violations`).toEqual([]);
  }
});

test("programme enquiry retries API failures and completes the lead journey", async ({ page }) => {
  let contactAttempts = 0;
  let detailAttempts = 0;
  await page.route("**/api/leads", async (route) => {
    const request = route.request();
    if (request.method() === "POST") {
      contactAttempts += 1;
      if (contactAttempts === 1) return route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "Temporary service issue. Please try again." }) });
      return route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ leadId: "test-lead-r1" }) });
    }
    detailAttempts += 1;
    if (detailAttempts === 1) return route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "Temporary save issue. Please try again." }) });
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });

  await page.goto("/");
  const recommendedCard = page.locator(".programme-card.featured");
  await recommendedCard.getByRole("button", { name: "Reserve your seat" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Tell us how to reach you." })).toBeVisible();
  await dialog.locator('input[name="name"]').fill("Demo Learner");
  await dialog.locator('input[name="email"]').fill("learner@example.test");
  await dialog.locator('input[name="phone"]').fill("9876543210");
  await dialog.locator('input[name="consent"]').check();
  await dialog.getByRole("button", { name: "Continue" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Temporary service issue");
  await expect(dialog.locator('input[name="name"]')).toHaveValue("Demo Learner");

  await dialog.getByRole("button", { name: "Continue" }).click();
  await expect(dialog.getByRole("heading", { name: "Help us point you to the right path." })).toBeVisible();
  await expect(dialog.locator('input[name="organisation"]')).toHaveValue("");
  await expect(dialog.locator('input[name="city"]')).toHaveValue("");
  await expect(dialog.locator('select[name="programme"]')).toHaveValue("AI product studio");

  await dialog.locator('select[name="persona"]').selectOption("Student");
  await dialog.locator('input[name="city"]').fill("Bengaluru");
  await dialog.locator('select[name="schedule"]').selectOption("Weekends");
  await dialog.getByRole("button", { name: "Send enquiry" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Temporary save issue");
  await expect(dialog.locator('select[name="programme"]')).toHaveValue("AI product studio");


  await dialog.getByRole("button", { name: "Send enquiry" }).click();
  await expect(dialog.getByRole("heading", { name: "Thank you." })).toBeVisible();
  await expect(dialog.getByText("Your enquiry was accepted by the prototype.")).toBeVisible();
  expect(contactAttempts).toBe(2);
  expect(detailAttempts).toBe(2);
});


