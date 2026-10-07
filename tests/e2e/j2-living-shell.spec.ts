import {expect,test} from "@playwright/test";

test("J2 replaces learner chrome with the living Japanese shell",async({page})=>{
  await page.goto("./");

  const brand=page.locator(".j2-brand");
  await expect(brand).toHaveAttribute("aria-label","Japanese");
  await expect(brand.getByText("日本語",{exact:true})).toBeVisible();

  const nav=page.getByRole("navigation",{name:"Primary"});
  await expect(nav.getByRole("button")).toHaveCount(5);
  await expect(nav.getByRole("button",{name:"Today",exact:true})).toHaveAttribute("aria-current","page");
  await expect(page.getByText("P22 stable release activation · production monitoring · maintenance",{exact:true})).toHaveCount(0);

  const theme=page.getByRole("button",{name:"Use dark theme"});
  await theme.click();
  await expect(page.locator("html")).toHaveAttribute("data-j-theme","dark");
  await expect(page.getByRole("button",{name:"Use light theme"})).toBeVisible();

  await nav.getByRole("button",{name:"Library",exact:true}).click();
  await expect(nav.getByRole("button",{name:"Library",exact:true})).toHaveAttribute("aria-current","page");
  await expect(page.getByRole("heading",{name:"Japanese knowledge"})).toBeVisible();

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("J2 isolates operations from learner Progress behind diagnostics",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Progress",exact:true}).click();

  await expect(page.getByRole("heading",{name:"The path you have actually built"})).toBeVisible();
  await expect(page.getByText("P11 / P21 / P22 RELEASE OPERATIONS",{exact:true})).toHaveCount(0);
  await expect(page.getByText("P22 DEPLOYMENT IDENTITY",{exact:true})).toHaveCount(0);
  await expect(page.getByText("P9 PROVIDER OBSERVABILITY",{exact:true})).toHaveCount(0);

  await page.goto("./?diagnostics=1");
  await expect(page.getByRole("heading",{name:"Japanese operations"})).toBeVisible();
  await expect(page.getByRole("navigation",{name:"Primary"})).toHaveCount(0);

  await page.getByRole("button",{name:/Release gates/}).click();
  await expect(page.getByText("P11 / P21 / P22 RELEASE OPERATIONS",{exact:true})).toBeVisible();

  await page.getByRole("button",{name:/Deployment/}).click();
  await expect(page.getByText("P22 DEPLOYMENT IDENTITY",{exact:true})).toBeVisible();

  await page.getByRole("button",{name:"Back to Japanese"}).click();
  await expect(page).not.toHaveURL(/diagnostics=1/);
  await expect(page.getByRole("heading",{name:/Continue Japanese|You’re caught up/})).toBeVisible();
});

test("J2 keeps five primary destinations thumb-safe on mobile profiles",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","mobile shell qualification");

  await page.goto("./");
  const buttons=page.getByRole("navigation",{name:"Primary"}).getByRole("button");
  await expect(buttons).toHaveCount(5);

  for(const button of await buttons.all()){
    const box=await button.boundingBox();
    expect(box?.height??0).toBeGreaterThanOrEqual(54);
  }

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
