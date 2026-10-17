import {expect,test} from "@playwright/test";

async function learn(page:import("@playwright/test").Page){
 await page.goto("./");
 await page.getByRole("button",{name:"Learn",exact:true}).click();
 const studio=page.getByRole("region",{name:"Source-only A2 communication workshop"});
 await expect(studio).toBeVisible();
 return studio;
}

test("E20 links original ungraded A2 listening, reading, reply, and independent source comparison",async({page})=>{
 const studio=await learn(page);
 await expect(studio).toContainText("zero scored items");
 await expect(studio.getByLabel("Choose an original A2-oriented situation")).toBeVisible();
 await expect(studio.getByText("STEP 1 / 4 · SELF-DIRECTED, NOT SCORED")).toBeVisible();
 const listen=studio.locator(".e20-question").first();
 await expect(listen.locator(".e20-question__choices button")).toHaveCount(3);
 await listen.locator(".e20-question__choices button").first().click();
 await expect(listen.locator(".e20-question__choices button").first()).toHaveAttribute("aria-pressed","true");
 await listen.getByRole("button",{name:"Reveal original reference answer"}).click();
 await expect(listen.getByRole("status")).toContainText("Original authored reference");
 await studio.getByRole("button",{name:"Reveal original Japanese transcript and intentions"}).click();
 await expect(studio.locator(".e20-source__dialogue li").first()).toBeVisible();
 await studio.getByRole("button",{name:"Continue to Read"}).click();
 await expect(studio.getByText("STEP 2 / 4 · SELF-DIRECTED, NOT SCORED")).toBeVisible();
 await expect(studio.locator(".e20-source__reading .e20-source__japanese")).toBeVisible();
 await studio.getByRole("button",{name:"Reveal original source explanation"}).click();
 await expect(studio.locator(".e20-source__reading")).toContainText(/Original|The|It|A/);
 await studio.getByRole("button",{name:"Continue to Respond"}).click();
 await expect(studio.locator(".e20-source__model input")).toBeVisible();
 await studio.locator(".e20-source__model input").fill("日本語の練習");
 await studio.getByRole("button",{name:"Reveal original model and source explanation"}).click();
 await expect(studio.locator(".e20-source__model [role=status]")).toContainText("No response or grade was stored");
 await studio.getByRole("button",{name:"Continue to Compose"}).click();
 await expect(studio.getByText("STEP 4 / 4 · SELF-DIRECTED, NOT SCORED")).toBeVisible();
 await expect(studio.getByText("This workshop saves")).toBeVisible();
});

test("E20 private first/revised messages remain ephemeral and switching original scenes clears them",async({page})=>{
 const studio=await learn(page);
 await studio.locator(".e20-source__stages").getByRole("button",{name:/Compose/}).click();
 const first="会議は日曜日の午後にあります。よろしくお願いします。";
 const revised="会議は日曜日の午後二時にあります。よろしくお願いいたします。";
 await studio.getByLabel("First Japanese message").fill(first);
 await studio.getByRole("button",{name:"Keep first draft in this session"}).click();
 const second=studio.getByLabel("Second Japanese message");
 await expect(second).toHaveValue(first);
 await expect(studio.getByRole("button",{name:"Compare my two session drafts (not a grade)"})).toBeDisabled();
 await second.fill(revised);
 await studio.getByRole("button",{name:"Compare my two session drafts (not a grade)"}).click();
 const comparison=studio.locator('[aria-label="Temporary written draft comparison"][role="status"]');
 await expect(comparison).toContainText(revised);
 await expect(comparison).toContainText("not establish semantic accuracy");
 const chooser=studio.getByLabel("Choose an original A2-oriented situation");
 const options=await chooser.locator("option").all();
 expect(options.length).toBeGreaterThan(1);
 const secondKey=await options[1]!.getAttribute("value");
 expect(secondKey).toBeTruthy();
 await chooser.selectOption(secondKey!);
 await expect(studio.getByText("STEP 1 / 4 · SELF-DIRECTED, NOT SCORED")).toBeVisible();
 await studio.locator(".e20-source__stages").getByRole("button",{name:/Compose/}).click();
 await expect(studio.getByLabel("First Japanese message")).toHaveValue("");
 await expect(studio.getByLabel("Second Japanese message")).toHaveCount(0);
});

test("E20 original source-only preview enters native reader without creating a graded study prompt",async({page})=>{
 const studio=await learn(page);
 await studio.getByRole("button",{name:"Open original reading-only lesson"}).click();
 const main=page.locator("main.j5-study-shell");
 await expect(main).toBeVisible();
 await expect(main).toContainText(/no Can-do association|no scored evidence|No grading|ungraded|reading-only/i);
});

test("E20 retains four usable steps without horizontal overflow on Android and compact Chromium",async({page},testInfo)=>{
 test.skip(testInfo.project.name==="desktop-chromium","Mobile responsive acceptance only");
 const studio=await learn(page);
 const viewport=page.viewportSize()!;
 for(const stage of ["Listen","Read","Respond","Compose"]){
  const tab=studio.locator(".e20-source__stages").getByRole("button",{name:new RegExp(stage)});
  await tab.click();
  await expect(tab).toHaveAttribute("aria-current","step");
  const bounds=await tab.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.height).toBeGreaterThanOrEqual(44);
  expect(bounds!.x).toBeGreaterThanOrEqual(-1);
  expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(viewport.width+1);
 }
 const drafts=studio.getByLabel("First Japanese message");
 await drafts.fill("友達に連絡します。明日会いませんか。");
 await studio.getByRole("button",{name:"Keep first draft in this session"}).click();
 await expect(studio.getByLabel("Second Japanese message")).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});
