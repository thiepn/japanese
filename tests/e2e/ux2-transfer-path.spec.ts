import {openAdditionalLearn} from "./open-additional-learn";
import {expect,test} from "@playwright/test";
test("UX2 original cumulative cases and all practical studios are navigable",async({page},testInfo)=>{
 await page.goto("./");
 await page.getByRole("button",{name:"Learn",exact:true}).click();
 await openAdditionalLearn(page,false);
 if(testInfo.project.name==="desktop-chromium"){
  const catalogue=page.locator(".e07-track-list").filter({hasText:"Browse every original A1/A2 situation"});
  await catalogue.locator(":scope > summary").click();
  await expect(page.getByRole("heading",{name:"Communicate across everyday situations"})).toBeVisible();
  return;
 }
 const toggle=page.locator(".ux2-path-toggle");
 await expect(toggle).toBeVisible();
 if(await toggle.getAttribute("aria-expanded")==="false")await toggle.click();
 await expect(toggle).toHaveAttribute("aria-expanded","true");
 const transfer=page.locator("#ux2-transfer-panel");
 await expect(transfer.getByRole("heading",{name:/Use Japanese across situations/})).toBeVisible();
 await expect(transfer.locator(".ux2-transfer-case")).toHaveCount(7);
 const first=transfer.locator(".ux2-transfer-case").first();
 await expect(first.getByRole("button",{name:/Read original case|Study prerequisite source|Continue short lesson|Review full original case/})).toBeEnabled();
 const catalogue=page.locator(".ux1-mobile-catalogue-toggle");
 await catalogue.click();
 await expect(catalogue).toHaveAttribute("aria-expanded","false");
 await transfer.locator(".ux2-transfer__tools li").filter({hasText:"Conversation and private notebook"}).getByRole("button",{name:"Open studio"}).click();
 await expect(catalogue).toHaveAttribute("aria-expanded","true");
 const heading=page.getByRole("heading",{name:"Follow the whole conversation, one speaker at a time"});
 await expect(heading).toBeVisible();
 await expect(heading).toBeFocused();
 for(const studio of [".e13-lab",".e14-studio",".e15-recovery",".e16-studio"]){
  await expect(page.locator(studio)).toHaveCount(1);
 }
 // The first source-gated case opens the original native Study Player, not a parallel lesson.
 await first.getByRole("button",{name:/Read original case|Study prerequisite source|Continue short lesson|Review full original case/}).click();
 await expect(page.locator("main.j5-study-shell")).toBeVisible();
});
