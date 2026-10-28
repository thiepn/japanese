import {test,expect} from "@playwright/test";
test("CUR-01 selectable A1–C2 catalog and direct B1 entry",async({page})=>{
  await page.goto("./#course/B1");
  const catalog=page.getByRole("region",{name:"Six-level course catalog"});
  await expect(catalog).toBeVisible();
  await expect(catalog.getByRole("tab")).toHaveCount(6);
  await expect(catalog.getByRole("tab",{name:/B1/})).toHaveAttribute("aria-selected","true");
  await expect(catalog.locator(".cur01-lessons li").first()).toBeVisible();
  const first=catalog.locator(".cur01-lessons li").first();
  await first.getByRole("button",{name:/^(Open|Resume) lesson 1:/i}).click();
  await expect(page.locator("main.j5-study-shell")).toBeVisible();
  await page.getByRole("button",{name:"Exit"}).click();
  await expect(page).toHaveURL(/#course\/B1\//);
  await page.reload();
  await expect(catalog.getByRole("tab",{name:/B1/})).toHaveAttribute("aria-selected","true");
  await catalog.getByRole("tab",{name:/C2/}).click();
  await expect(catalog.getByText(/no published course units at this level/i)).toBeVisible();
  await expect(catalog.locator(".cur01-lessons li")).toHaveCount(0);
});
