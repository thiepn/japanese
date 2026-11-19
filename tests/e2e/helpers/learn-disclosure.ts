import {expect,type Page} from "@playwright/test";

/** Open the actual user-operable controls. Desktop shows the full catalogue
 * inside the outer disclosure; compact/mobile has an extra toggle. */
export async function openOtherLessons(page:Page){
 const details=page.locator("details.beginner-explore");
 await expect(details).toBeVisible();
 if(await details.getAttribute("open")===null)await details.locator(":scope > summary").click();
 await expect(details).toHaveAttribute("open","");
}
export async function openFullCourse(page:Page){
 await openOtherLessons(page);
 const panel=page.locator("#ux1-expanded-catalogue");
 if(!await panel.isVisible()){
  const toggle=page.locator(".ux1-mobile-catalogue-toggle");
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded","false");
  await toggle.click();
 }
 await expect(panel).toBeVisible();
}
