import { expect, test } from "@playwright/test";

test("PWA shell and local Japanese content survive offline reload", async ({ page, context }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Continue Japanese" })).toBeVisible();

  await page.evaluate(async () => {
    if (!("serviceWorker" in navigator)) throw new Error("SERVICE_WORKER_UNAVAILABLE");
    await navigator.serviceWorker.ready;
  });
  await page.reload();

  await page.getByRole("button", { name: "Library" }).click();
  const search = page.getByRole("textbox", { name: "Search Japanese" });
  await search.fill("eat");
  await expect(page.getByText("食べる")).toBeVisible({ timeout: 15_000 });

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Continue Japanese" })).toBeVisible();
  await page.getByRole("button", { name: "Library" }).click();
  await page.getByRole("textbox", { name: "Search Japanese" }).fill("eat");
  await expect(page.getByText("食べる")).toBeVisible({ timeout: 15_000 });
  await context.setOffline(false);
});
