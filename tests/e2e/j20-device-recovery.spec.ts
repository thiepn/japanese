import {expect,test,type Page} from "@playwright/test";

async function assertNoHorizontalOverflow(page:Page):Promise<void>{
  const sizes=await page.evaluate(()=>({
    content:document.documentElement.scrollWidth,
    viewport:window.innerWidth,
  }));
  expect(sizes.content-sizes.viewport).toBeLessThanOrEqual(1);
}

test("J20 emulated Android portrait, landscape and 200% text preserve learner navigation",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","emulated mobile browser only; not a physical Android approval");
  await page.setViewportSize({width:360,height:740});
  await page.goto("./");
  await expect(page.getByRole("navigation",{name:"Primary"})).toBeVisible();
  for(const [width,height] of [[360,740],[740,360]] as const){
    await page.setViewportSize({width,height});
    for(const surface of ["Today","Library","Progress"] as const){
      const button=page.getByRole("navigation",{name:"Primary"}).getByRole("button",{name:surface,exact:true});
      await button.click();
      await expect(button).toHaveAttribute("aria-current","page");
      await expect(page.locator("main#main-content")).toBeVisible();
      await assertNoHorizontalOverflow(page);
    }
  }
  await page.setViewportSize({width:360,height:740});
  await page.evaluate(()=>{document.documentElement.style.fontSize="200%";});
  expect(await page.evaluate(()=>parseFloat(getComputedStyle(document.documentElement).fontSize))).toBeGreaterThanOrEqual(30);
  for(const surface of ["Today","Library"] as const){
    await page.getByRole("navigation",{name:"Primary"}).getByRole("button",{name:surface,exact:true}).click();
    await assertNoHorizontalOverflow(page);
  }
});

test("J20 cached PWA restores graded local evidence offline and after simulated resume",async({page,context})=>{
  await page.goto("./");
  await page.evaluate(async()=>{
    if(!("serviceWorker" in navigator))throw new Error("J20_SERVICE_WORKER_UNAVAILABLE");
    await navigator.serviceWorker.ready;
  });
  await page.getByRole("button",{name:/Continue today’s study|Review anyway/}).click();
  await expect(page.getByRole("heading",{name:"Five vowel sounds"})).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.getByText("あ",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"a",exact:true}).click();
  await expect(page.getByText("Correct",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Exit",exact:true}).click();
  await expect(page.locator(".j3-today__visit strong")).toHaveText("1");

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator(".j3-today__visit strong")).toHaveText("1");
  await page.evaluate(()=>{
    window.dispatchEvent(new Event("pageshow"));
    window.dispatchEvent(new Event("focus"));
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator(".j3-today__visit strong")).toHaveText("1");
  await page.getByRole("navigation",{name:"Primary"}).getByRole("button",{name:"Progress"}).click();
  await expect(page.getByText("Answers today")).toBeVisible();
  await context.setOffline(false);
});

test("J20 offline account panel never starts OAuth on passive open or resume",async({page,context})=>{
  await page.route("https://account.thiepn.dev/japanese/entry/**",route=>route.fulfill({
    status:200,contentType:"text/html",body:"<title>J20 intercepted Account entry</title>",
  }));
  await page.goto("./");
  const startingUrl=page.url();
  await context.setOffline(true);
  await page.getByRole("button",{name:"Open THIEPN Account"}).click();
  await expect(page.getByRole("dialog",{name:"THIEPN Account"})).toBeVisible();
  expect(page.url()).toBe(startingUrl);
  await page.evaluate(()=>window.dispatchEvent(new Event("pageshow")));
  expect(page.url()).toBe(startingUrl);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog",{name:"THIEPN Account"})).toHaveCount(0);
  await context.setOffline(false);
  await page.getByRole("button",{name:"Open THIEPN Account"}).click();
  await page.getByRole("dialog",{name:"THIEPN Account"})
    .getByRole("button",{name:"Sign in with THIEPN Account"}).click();
  await expect(page).toHaveURL(/account\.thiepn\.dev\/japanese\/entry\//);
});

test("J20 keyboard, reduced motion and semantic current-page navigation remain available",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("./");
  expect(await page.evaluate(()=>matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
  await page.keyboard.press("Tab");
  const skip=page.getByRole("link",{name:"Skip to main content"});
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute("href","#main-content");
  const nav=page.getByRole("navigation",{name:"Primary"});
  await expect(nav.getByRole("button",{name:"Today"})).toHaveAttribute("aria-current","page");
  await nav.getByRole("button",{name:"Learn",exact:true}).click();
  await expect(nav.getByRole("button",{name:"Learn"})).toHaveAttribute("aria-current","page");
  await expect(nav.getByRole("button",{name:"Today"})).not.toHaveAttribute("aria-current","page");
  await assertNoHorizontalOverflow(page);
});
