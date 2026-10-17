import {expect,test} from "@playwright/test";
test("UX1 Today source recommendation and mobile Learn path stay connected",async({page},testInfo)=>{
 await page.goto("./");
 const main=page.locator("main#main-content");
 await expect(main.getByRole("heading",{name:"Your Japanese today"})).toBeVisible();
 await expect(main.locator(".ux1-mission__cta")).toBeVisible();
 await page.getByRole("button",{name:"Learn",exact:true}).click();
 if(testInfo.project.name!=="desktop-chromium"){
  const path=page.locator(".ux1-mobile-path");
  await expect(path.getByRole("heading",{name:"Your learning path"})).toBeVisible();
  await expect(page.locator(".ux2-path-toggle")).toBeVisible();
  await path.getByRole("button",{name:"First Words"}).click();
  // The original E01 entry is shown only when its canonical source link is available.
  await expect(path.locator(".ux1-node").first()).toBeVisible();
  await path.getByLabel("Learning level").selectOption("A2");
  await expect(path.getByRole("button",{name:"Connected conversations"})).toBeVisible();
  await expect(path.getByRole("button",{name:"Everyday problem solving"})).toBeVisible();
  await path.getByLabel("Learning level").selectOption("A1");
  await path.getByRole("button",{name:"Daily Life"}).click();
  const cafe=path.locator(".ux1-node").filter({hasText:"Order a drink politely"});
  await expect(cafe).toBeVisible();
  await cafe.getByRole("button",{name:/Start lesson|Practise lesson/}).click();
  await expect(page.locator("main.j5-study-shell")).toBeVisible();
  await expect(page.locator(".ux1-cafe-head")).toContainText("A small café");
  await page.getByRole("button",{name:"Exit"}).click();
  await expect(page.locator(".ux1-outcome")).toHaveCount(0);
  await expect(page.locator(".ux1-mobile-path")).toBeVisible();
 }
});
