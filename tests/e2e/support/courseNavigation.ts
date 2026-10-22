import {expect,type Page} from "@playwright/test";

/** Open optional lessons only through real user navigation; never change defaults. */
export async function revealAdvancedCatalogue(page:Page):Promise<void>{
 const details=page.locator(".beginner-explore");
 await expect(details).toBeVisible();
 if(await details.getAttribute("open")===null)
  await details.locator(":scope > summary").click();
 await expect(details).toHaveAttribute("open","");
 const mobile=page.locator(".ux1-mobile-catalogue-toggle");
 if(await mobile.isVisible()&&await mobile.getAttribute("aria-expanded")==="false")
  await mobile.click();
 await expect(page.locator("#ux1-expanded-catalogue")).toBeVisible();
}
export async function enterAdvancedLearn(page:Page):Promise<void>{
 await page.getByRole("navigation",{name:"Primary"}).getByRole("button",{name:"Learn",exact:true}).click();
 await revealAdvancedCatalogue(page);
}
