import {test,expect} from "@playwright/test";
test("CUR-04 restart is explicit and never clears source-owned learner events",async({page})=>{
 await page.goto("./#course/A1");
 const catalog=page.getByRole("region",{name:"Six-level course catalog"});
 await expect(catalog).toBeVisible();
 const row=catalog.locator(".cur01-lessons li[data-cur03-deep=true]").first();
 await row.getByRole("button",{name:/^(Open|Resume) lesson/}).click();
 const first=await page.locator(".study-lesson h1").innerText();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 const saved=await page.locator(".study-lesson h1").innerText();
 expect(saved).not.toBe(first);
 await page.getByRole("button",{name:"Exit"}).click();
 await catalog.locator(".cur01-lessons li[data-cur03-deep=true]").first()
  .getByRole("button",{name:/^(Open|Resume) lesson/}).click();
 await expect(page.locator(".study-lesson h1")).toHaveText(saved);
 await page.getByRole("button",{name:"Exit"}).click();
 await catalog.locator(".cur01-lessons li[data-cur03-deep=true]").first()
  .getByRole("button",{name:/Restart lesson/}).click();
 await expect(page.locator(".study-lesson h1")).toHaveText(first);
 await page.getByRole("button",{name:"Exit"}).click();
 await page.reload();
 await catalog.locator(".cur01-lessons li[data-cur03-deep=true]").first()
  .getByRole("button",{name:/^(Open|Resume) lesson/}).click();
 await expect(page.locator(".study-lesson h1")).toHaveText(first);
});
test("CUR-04 optional self-report only recommends; direct B1 entry remains unlocked",async({page})=>{
 await page.goto("./#course/A1");
 const catalog=page.getByRole("region",{name:"Six-level course catalog"});
 await catalog.getByText("Find a starting lesson (optional)").click();
 await catalog.getByLabel("Work with complex nuanced Japanese texts").check();
 await expect(catalog.locator(".cur04-advice")).toContainText(/C1/);
 await expect(catalog.locator(".cur04-advice")).toContainText(/not a placement score/);
 await catalog.getByRole("button",{name:"Show suggested lesson"}).click();
 await expect(catalog.getByRole("tab",{name:/C1/})).toHaveAttribute("aria-selected","true");
 await catalog.getByRole("tab",{name:/B1/}).click();
 const first=catalog.locator(".cur01-lessons li").first();
 await first.getByRole("button",{name:/^(Open|Resume) lesson/}).click();
 await expect(page.locator("main.j5-study-shell")).toBeVisible();
 await page.getByRole("button",{name:"Exit"}).click();
 await catalog.getByRole("tab",{name:/C2/}).click();
 await expect(catalog.getByText(/no published course units at this level/i)).toBeVisible();
});
