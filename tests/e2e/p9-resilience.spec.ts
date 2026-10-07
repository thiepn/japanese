import { expect,test } from "@playwright/test";

test("P9 real-world performance, native listening and provider fallbacks survive certified viewports",async({page,context})=>{
  await page.route("**/api/japanese/coach",async(route)=>{
    await route.fulfill({status:503,contentType:"application/json",body:JSON.stringify({service:"japanese-coach",status:"degraded",provider:"fixture",operational:false})});
  });
  await page.goto("./");

  await page.getByRole("button",{name:"Learn"}).click();
  await page.locator(".j4-practice__drawer").filter({hasText:"Real-world performance"}).locator("summary").click();
  await expect(page.getByRole("heading",{name:"Functional chains under time pressure"})).toBeVisible();
  await expect(page.locator(".performance-chain-grid > article")).toHaveCount(5);
  await page.getByRole("button",{name:"Start mixed performance set"}).click();
  await expect(page.getByRole("heading",{name:"Real-world performance set"})).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await expect(page.getByText("Timed response",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Exit"}).click();
  await expect(page.getByRole("heading",{name:"Your Japanese journey"})).toBeVisible();

  // Compact headless Chromium can re-scroll a fixed nav during actionability checks after StudyPlayer teardown.
  // The fixed-nav hit target itself is certified in mobile.spec.ts.
  await page.goto("./?diagnostics=1&panel=runtime");
  await expect(page.getByRole("heading",{name:"AI + morphology runtime status"})).toBeVisible();
  await expect(page.locator(".provider-health-card.degraded,.provider-health-card.unreachable").first()).toBeVisible();

  await page.getByRole("button",{name:"Back to Japanese"}).click();
  await page.getByRole("button",{name:"Immerse"}).click();
  await expect(page.getByRole("heading",{name:"Listen → note → synthesize → recall later"})).toBeVisible();

  await page.evaluate(async()=>{if(!("serviceWorker" in navigator))throw new Error("SERVICE_WORKER_UNAVAILABLE");await navigator.serviceWorker.ready;});
  await page.reload();
  await expect(page.getByRole("heading",{name:/Continue Japanese|You’re caught up/})).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading",{name:/Continue Japanese|You’re caught up/})).toBeVisible();
  await page.getByRole("button",{name:"Learn"}).click();
  await page.locator(".j4-practice__drawer").filter({hasText:"Real-world performance"}).locator("summary").click();
  await expect(page.getByRole("heading",{name:"Functional chains under time pressure"})).toBeVisible();
  // Compact mobile headless Chromium has the same fixed-nav scrollIntoView drift while offline.
  await page.getByRole("button",{name:"Immerse"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await expect(page.getByRole("heading",{name:"Listen → note → synthesize → recall later"})).toBeVisible();
  await context.setOffline(false);
});
