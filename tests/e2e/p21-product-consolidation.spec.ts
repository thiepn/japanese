import { expect,test } from "@playwright/test";

test("P21 keeps the complete product shell navigable without horizontal overflow",async({page})=>{
  await page.goto("/");
  await expect(page.locator(".phase")).toContainText("P21 final product consolidation");

  const surfaces=["Today","Learn","Immerse","Library","Progress"] as const;
  for(const surface of surfaces){
    await page.getByRole("button",{name:surface,exact:true}).evaluate((button)=>(button as HTMLButtonElement).click());
    await expect(page.locator("main#main-content")).toBeVisible();
    await expect(page.getByRole("button",{name:surface,exact:true})).toHaveAttribute("aria-current","page");
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  }

  await expect(page.getByText("P20 LONGITUDINAL C2 READINESS",{exact:true})).toBeVisible();
});

test("P21 provides keyboard skip navigation and visible semantic navigation state",async({page})=>{
  await page.goto("/");
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
