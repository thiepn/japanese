import { expect,test } from "@playwright/test";

test("P9 real-world performance, native listening and provider fallbacks survive certified viewports",async({page,context})=>{
  await page.route("**/api/japanese/coach",async(route)=>{
    await route.fulfill({status:503,contentType:"application/json",body:JSON.stringify({service:"japanese-coach",status:"degraded",provider:"fixture",operational:false})});
  });
  await page.goto("/");

  await page.getByRole("button",{name:"Learn"}).click();
  await expect(page.getByRole("heading",{name:"Functional chains under time pressure"})).toBeVisible();
  await expect(page.locator(".performance-chain-grid > article")).toHaveCount(5);
  await page.getByRole("button",{name:"Start mixed P9 performance set"}).click();
  await expect(page.getByRole("heading",{name:"P9 real-world performance set"})).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await expect(page.getByText("Timed response",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Exit"}).click();
  await expect(page.getByRole("heading",{name:"Foundation → B2"})).toBeVisible();

  await page.getByRole("button",{name:"Progress"}).click();
  await expect(page.getByRole("heading",{name:"AI + morphology runtime status"})).toBeVisible();
  await expect(page.locator(".provider-health-card.degraded,.provider-health-card.unreachable").first()).toBeVisible();

  await page.getByRole("button",{name:"Immerse"}).click();
  await expect(page.getByRole("heading",{name:"Listen → note → synthesize → recall later"})).toBeVisible();

  await page.evaluate(async()=>{if(!("serviceWorker" in navigator))throw new Error("SERVICE_WORKER_UNAVAILABLE");await navigator.serviceWorker.ready;});
  await page.reload();
  await expect(page.getByRole("heading",{name:/Continue Japanese|You’re caught up/})).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading",{name:/Continue Japanese|You’re caught up/})).toBeVisible();
  await page.getByRole("button",{name:"Learn"}).click();
  await expect(page.getByRole("heading",{name:"Functional chains under time pressure"})).toBeVisible();
  await page.getByRole("button",{name:"Immerse"}).click();
  await expect(page.getByRole("heading",{name:"Listen → note → synthesize → recall later"})).toBeVisible();
  await context.setOffline(false);
});
