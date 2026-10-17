import {expect,test} from "@playwright/test";

test("J3 turns Today into a Japanese daily-study ritual",async({page})=>{
  await page.goto("./");

  const today=page.locator(".j3-today");
  await expect(today).toBeVisible();
  await expect(page.getByText("TODAY · 今日",{exact:true})).toBeVisible();
  await expect(page.locator(".ux1-mission")).toContainText("YOUR NEXT STEP");
  await expect(page.getByRole("heading",{name:"Your Japanese today"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"One route, four intentions"})).toBeVisible();
  await expect(page.getByText("今日の道",{exact:true}).first()).toBeVisible();

  const route=page.locator(".j3-route__item");
  await expect(route).toHaveCount(4);
  await expect(route.nth(0)).toContainText("Review");
  await expect(route.nth(1)).toContainText("Learn");
  await expect(route.nth(2)).toContainText("Listen");
  await expect(route.nth(3)).toContainText("Apply");

  await expect(page.locator(".stat-row.six")).toHaveCount(0);
  await expect(page.locator(".ux1-native-queue")).toHaveCount(1);

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("J3 keeps Today responsive and theme-safe",async({page},testInfo)=>{
  await page.goto("./");

  await page.getByRole("button",{name:"Use dark theme"}).click();
  await expect(page.locator("html")).toHaveAttribute("data-j-theme","dark");
  await expect(page.locator(".ux1-mission")).toBeVisible();

  if(testInfo.project.name!=="desktop-chromium"){
    const action=page.locator(".ux1-native-queue");
    const box=await action.boundingBox();
    expect(box?.height??0).toBeGreaterThanOrEqual(48);
  }

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("J3 Continue still opens the existing Study Player",async({page})=>{
  await page.goto("./");

  const action=page.locator(".ux1-native-queue");
  await expect(action).toBeVisible();
  await action.click();

  await expect(page.locator("main.j5-study-shell#main-content")).toBeVisible();
  await expect(page.locator(".j5-study")).toBeVisible();
  await expect(page.getByRole("navigation",{name:"Primary"})).toHaveCount(0);
});
