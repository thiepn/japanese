import {test,expect} from "@playwright/test";
const owner="00000000-0000-4000-8000-000000000001";
test("CUR-09 fresh Account shows original due entry without a fabricated saved review",async({page})=>{
 await page.goto("./#course/A1");
 const panel=page.getByRole("region",{name:"Vocabulary and level reviews"});
 await expect(panel.getByRole("heading",{name:"Source-linked vocabulary"})).toBeVisible();
 await expect(panel.getByRole("button",{name:"Resume unfinished review"})).toHaveCount(0);
 const before=await panel.locator(".cur05-global strong").innerText();
 await panel.getByRole("button",{name:"All levels",exact:true}).click();
 await expect(panel.locator(".cur05-global strong")).toHaveText(before);
 await expect(panel.locator(".cur05-actions button").first()).toHaveText(/Review (selected due|next)/);
});
test("CUR-09 rejects a fabricated navigation-only receipt on Account-owned recheck",async({page})=>{
 await page.goto("./#course/A1");
 const panel=page.getByRole("region",{name:"Vocabulary and level reviews"});
 await expect(panel.getByRole("heading",{name:"Source-linked vocabulary"})).toBeVisible();
 const count=await panel.locator(".cur05-global strong").innerText();
 await page.evaluate(owner=>{
  localStorage.setItem("thiepn-japanese-cur09-review-v1:"+encodeURIComponent(owner),JSON.stringify({
   version:1,owner,levels:["A1"],queue:[{id:"fabricated-word",
   traceId:"lexeme:fabricated:meaning_recognition:word-to-meaning",
   sourceId:"fabricated-source",revision:1,due:new Date(Date.now()-1000).toISOString()}],
   sourceFingerprint:"1234567890abcdef",cursor:0,savedAt:Date.now()
  }));
 },owner);
 await page.reload();
 const restored=page.getByRole("region",{name:"Vocabulary and level reviews"});
 await expect(restored.getByRole("button",{name:"Resume unfinished review"})).toBeVisible();
 await restored.getByRole("button",{name:"Resume unfinished review"}).click();
 await expect(page.locator(".j5-study-shell")).toHaveCount(0);
 await expect(restored).toBeVisible();
 await expect(restored.locator(".cur05-global strong")).toHaveText(count);
 await page.reload();
 await expect(page.getByRole("region",{name:"Vocabulary and level reviews"})
  .getByRole("button",{name:"Resume unfinished review"})).toHaveCount(0);
});
test("CUR-09 hides navigation receipts whose embedded owner disagrees with current Account",async({page})=>{
 await page.goto("./#course/A1");
 await expect(page.getByRole("region",{name:"Vocabulary and level reviews"})
  .getByRole("heading",{name:"Source-linked vocabulary"})).toBeVisible();
 await page.evaluate(owner=>{
  localStorage.setItem("thiepn-japanese-cur09-review-v1:"+encodeURIComponent(owner),JSON.stringify({
   version:1,owner:"another-owner",levels:["A1"],queue:[{id:"forged",
   traceId:"lexeme:forged:reading:reading",sourceId:"forged",revision:1,
   due:new Date(Date.now()-1000).toISOString()}],
   sourceFingerprint:"1234567890abcdef",cursor:0,savedAt:Date.now()
  }));
 },owner);
 await page.reload();
 const panel=page.getByRole("region",{name:"Vocabulary and level reviews"});
 await expect(panel.getByRole("heading",{name:"Source-linked vocabulary"})).toBeVisible();
 await expect(panel.getByRole("button",{name:"Resume unfinished review"})).toHaveCount(0);
});
