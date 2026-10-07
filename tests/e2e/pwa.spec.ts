import { expect,test } from "@playwright/test";

test("PWA shell, integrated Study Player and canonical content survive offline reload",async({page,context})=>{
  await page.goto("./");
  await expect(page.getByRole("heading",{name:"Continue Japanese"})).toBeVisible();
  await page.evaluate(async()=>{if(!("serviceWorker" in navigator))throw new Error("SERVICE_WORKER_UNAVAILABLE");await navigator.serviceWorker.ready;});
  await page.reload();

  await page.getByRole("button",{name:/Continue today’s study|Review anyway/}).click();
  await expect(page.getByRole("heading",{name:"Five vowel sounds"})).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();

  for(const [kana,reading] of [["あ","a"],["い","i"],["う","u"],["え","e"],["お","o"]] as const){
    await expect(page.getByText(kana,{exact:true})).toBeVisible();
    await page.getByRole("button",{name:reading,exact:true}).click();
    await expect(page.getByText("Correct",{exact:true})).toBeVisible();
    await page.getByRole("button",{name:"Continue"}).click();
  }

  await expect(page.getByRole("heading",{name:"家"})).toBeVisible();
  await expect(page.getByText("いえ",{exact:true})).toBeVisible();
  await expect(page.getByText(/house \/ home/)).toBeVisible();
  await expect(page.getByText(/家 → いえ/)).toBeVisible();

  await page.getByRole("button",{name:"Exit"}).click();
  await page.getByRole("button",{name:"Library"}).click();
  const search=page.getByRole("textbox",{name:"Search Japanese"});

  await search.fill("eat");
  await expect(page.locator(".j7-result").filter({hasText:"食べる"}).first()).toBeVisible({timeout:15_000});
  await search.fill("person");
  await expect(page.getByRole("article").filter({hasText:"ひと"}).getByText("人",{exact:true})).toBeVisible({timeout:15_000});
  await search.fill("food");
  await page.getByLabel("Reference type filters").getByRole("button",{name:/Kanji/}).click();
  await expect(page.locator(".j7-result.result-kanji").filter({hasText:"食"}).first()).toBeVisible({timeout:15_000});

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading",{name:/Continue Japanese|You’re caught up/})).toBeVisible();
  await page.getByRole("button",{name:"Library"}).click();
  await page.getByRole("textbox",{name:"Search Japanese"}).fill("train");
  await expect(page.locator(".j7-result").filter({hasText:"電車"}).first()).toBeVisible({timeout:15_000});
  await context.setOffline(false);
});
