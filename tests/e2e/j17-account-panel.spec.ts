import {expect,test} from "@playwright/test";

test("Account icon opens status without starting Google login or signing out",async({page})=>{
  await page.goto("./");
  const initial=page.url();
  const account=page.getByRole("button",{name:"Open THIEPN Account"});
  await expect(account).toHaveAttribute("aria-expanded","false");
  await account.click();
  await expect(account).toHaveAttribute("aria-expanded","true");
  const panel=page.getByRole("dialog",{name:"THIEPN Account"});
  await expect(panel).toBeVisible();
  await expect(panel.getByText("Not signed in")).toBeVisible();
  await expect(panel.getByRole("button",{name:"Sign in with THIEPN Account"})).toBeVisible();
  await expect(panel.getByRole("button",{name:"Sign out of Japanese"})).toHaveCount(0);
  expect(page.url()).toBe(initial);
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(account).toHaveAttribute("aria-expanded","false");
});

test("Account popover dismisses on outside click and provides safe diagnostics entry",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Open THIEPN Account"}).click();
  const panel=page.getByRole("dialog",{name:"THIEPN Account"});
  const diagnostic=panel.getByRole("link",{name:/View sign-in diagnostics/});
  await expect(diagnostic).toHaveAttribute("href",/diagnostics=1&panel=account/);
  await page.locator(".j2-brand").click(); // Unobstructed outside-click target across all profiles.
  await expect(panel).toHaveCount(0);
  await page.getByRole("button",{name:"Open THIEPN Account"}).click();
  await panel.getByRole("button",{name:"Close Account panel"}).click();
  await expect(panel).toHaveCount(0);
});

test("unregistered local build does not initiate cross-origin Google OAuth",async({page})=>{
  await page.goto("./");
  const startUrl=page.url();
  await page.getByRole("button",{name:"Open THIEPN Account"}).click();
  const panel=page.getByRole("dialog",{name:"THIEPN Account"});
  await expect(panel.getByRole("button",{name:"Sign in with THIEPN Account"})).toBeDisabled();
  await expect(panel.getByText(/sign-in is not yet configured for this address/i)).toBeVisible();
  expect(page.url()).toBe(startUrl);
});

test("Account popover stays within mobile viewport and controls are touch-sized",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","Android and compact phone qualification");
  await page.goto("./");
  await page.getByRole("button",{name:"Open THIEPN Account"}).click();
  const panel=page.getByRole("dialog",{name:"THIEPN Account"});
  await expect(panel).toBeVisible();
  const viewport=page.viewportSize()!;
  const bounds=await panel.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(-1);
  expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(viewport.width+1);
  const login=panel.getByRole("button",{name:"Sign in with THIEPN Account"});
  expect((await login.boundingBox())?.height??0).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});
