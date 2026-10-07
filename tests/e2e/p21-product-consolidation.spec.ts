import { expect,test } from "@playwright/test";

test("P21 keeps the complete product shell navigable without horizontal overflow",async({page})=>{
  await page.goto("./");
  const surfaces=["Today","Learn","Immerse","Library","Progress"] as const;
  for(const surface of surfaces){
    await page.getByRole("button",{name:surface,exact:true}).evaluate((button)=>(button as HTMLButtonElement).click());
    await expect(page.locator("main#main-content")).toBeVisible();
    await expect(page.getByRole("button",{name:surface,exact:true})).toHaveAttribute("aria-current","page");
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  }

  await expect(page.getByRole("heading",{name:"The path you have actually built"})).toBeVisible();
  await expect(page.getByTestId("j8-c1-vault")).toBeVisible();
  const finalOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(finalOverflow).toBeLessThanOrEqual(1);
});

test("P21 provides keyboard skip navigation and visible semantic navigation state",async({page})=>{
  await page.goto("./");
  const skip=page.getByRole("link",{name:"Skip to main content"});
  await expect(skip).toHaveAttribute("href","#main-content");
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();

  const nav=page.getByRole("navigation",{name:"Primary"});
  await expect(nav.getByRole("button")).toHaveCount(5);
  await expect(nav.getByRole("button",{name:"Today"})).toHaveAttribute("aria-current","page");

  await nav.getByRole("button",{name:"Progress"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await expect(nav.getByRole("button",{name:"Progress"})).toHaveAttribute("aria-current","page");
  await expect(nav.getByRole("button",{name:"Today"})).not.toHaveAttribute("aria-current","page");
});


test("P21 keeps advanced workspace tabs thumb-safe on mobile profiles",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","mobile touch-target hardening only");
  await page.goto("./");
  await page.getByRole("button",{name:"Immerse"}).evaluate((button)=>(button as HTMLButtonElement).click());
  const tabs=page.locator(".p15-tabs button,.p17-tabs button,.p18-tabs button,.p19-tabs button");
  expect(await tabs.count()).toBeGreaterThan(0);
  for(const button of await tabs.all()){
    const box=await button.boundingBox();
    expect(box?.height??0).toBeGreaterThanOrEqual(44);
  }
});
