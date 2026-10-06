import {expect,test} from "@playwright/test";

test("J3 turns Today into a Japanese daily-study ritual",async({page})=>{
  await page.goto("./");

  const today=page.locator(".j3-today");
  await expect(today).toBeVisible();
  await expect(page.getByText("TODAY · 今日",{exact:true})).toBeVisible();
  await expect(page.getByText("一日一歩",{exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:/Continue Japanese|You’re caught up/})).toBeVisible();
  await expect(page.getByRole("heading",{name:"One route, four intentions"})).toBeVisible();
  await expect(page.getByText("今日の道",{exact:true}).first()).toBeVisible();

  const route=page.locator(".j3-route__item");
  await expect(route).toHaveCount(4);
  await expect(page.getByText("Review",{exact:true})).toBeVisible();
  await expect(page.getByText("Learn",{exact:true})).toBeVisible();
  await expect(page.getByText("Listen",{exact:true})).toBeVisible();
  await expect(page.getByText("Apply",{exact:true})).toBeVisible();

  await expect(page.locator(".stat-row.six")).toHaveCount(0);
  await expect(page.locator(".j3-today__continue")).toHaveCount(1);

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("J3 keeps Today responsive and theme-safe",async({page},testInfo)=>{
  await page.goto("./");

  await page.getByRole("button",{name:"Use dark theme"}).click();
  await expect(page.locator("html")).toHaveAttribute("data-j-theme","dark");
  await expect(page.locator(".j3-today__hero")).toBeVisible();

  if(testInfo.project.name!=="desktop-chromium"){
    const action=page.locator(".j3-today__continue");
    const box=await action.boundingBox();
    expect(box?.height??0).toBeGreaterThanOrEqual(68);
  }

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("J3 Continue still opens the existing Study Player",async({page})=>{
  await page.goto("./");

  const action=page.locator(".j3-today__continue");
  await expect(action).toBeVisible();
  await action.click();

  await expect(page.locator("main.study-shell#main-content")).toBeVisible();
  await expect(page.locator(".study-player")).toBeVisible();
  await expect(page.getByRole("navigation",{name:"Primary"})).toHaveCount(0);
});
