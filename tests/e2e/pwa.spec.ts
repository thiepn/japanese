import {expect,test} from "@playwright/test";

test("PWA beginner answer, canonical reference and offline search survive service-worker reload",async({page,context},testInfo)=>{
  await page.goto("./");
  await expect(page.getByRole("heading",{name:"Start Japanese from Zero"})).toBeVisible();
  await page.evaluate(async()=>{if(!("serviceWorker" in navigator))throw new Error("SERVICE_WORKER_UNAVAILABLE");await navigator.serviceWorker.ready;});
  await page.reload();
  await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller))).toBe(true);
  await page.getByRole("button",{name:"Start Japanese from Zero"}).click();
  await expect(page.getByRole("heading",{name:"Hiragana · Five vowel sounds"})).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.locator(".j5-prompt")).toContainText("あ");
  await page.getByRole("button",{name:"a",exact:true}).click();
  await expect(page.getByText("Correct",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Exit",exact:true}).click();
  await expect(page.locator(".beginner-entry__progress")).toContainText("1/7 answers correct in this group");

  await page.getByRole("button",{name:"Library",exact:true}).click();
  const search=page.getByRole("textbox",{name:"Search Japanese"});
  await search.fill("家");
  const home=page.locator(".j7-result.result-lexeme").filter({has:page.getByText("家",{exact:true})}).first();
  await expect(home).toBeVisible({timeout:15_000});
  await home.getByRole("option").click();
  const reference=page.locator(".j7-reference__sheet--lexeme");
  await expect(reference.getByRole("heading",{name:"家"})).toBeVisible();
  await expect(reference).toContainText("いえ");
  await expect(reference).toContainText(/house \/ home/);
  await search.fill("eat");
  await expect(page.locator(".j7-result").filter({hasText:"食べる"}).first()).toBeVisible({timeout:15_000});
  await search.fill("person");
  await expect(page.getByRole("listbox",{name:"Japanese reference results"})
    .getByRole("option",{name:/^語彙 · Word 人 ひと/})).toBeVisible({timeout:15_000});
  await search.fill("food");
  await page.getByLabel("Reference type filters").getByRole("button",{name:/Kanji/}).click();
  await expect(page.locator(".j7-result.result-kanji").filter({hasText:"食"}).first()).toBeVisible({timeout:15_000});

  await context.setOffline(true);
  await page.reload();
  await page.getByRole("button",{name:"Today",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Your next Japanese lesson"})).toBeVisible();
  await expect(page.locator(".beginner-entry__progress")).toContainText("1/7 answers correct in this group");
  if(testInfo.project.name!=="desktop-chromium"){
    await expect.poll(()=>page.locator(".j2-shell").evaluate(node=>getComputedStyle(node).getPropertyValue("--j12-mobile").trim())).toBe("1");
  }
  await page.getByRole("button",{name:"Library",exact:true}).click();
  await page.getByRole("textbox",{name:"Search Japanese"}).fill("train");
  await expect(page.locator(".j7-result").filter({hasText:"電車"}).first()).toBeVisible({timeout:15_000});
  await context.setOffline(false);
});
