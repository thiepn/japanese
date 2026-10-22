import {expect,type Page} from "@playwright/test";

// Navigate through the genuine beginner-first Learn disclosure, not hidden DOM.
export async function openAdditionalLearn(page:Page,fullCourse=false):Promise<void>{
  const catalogue=page.locator("details.beginner-explore");
  await expect(catalogue.locator(":scope > summary")).toBeVisible();
  if(!await catalogue.evaluate(node=>(node as HTMLDetailsElement).open))
    await catalogue.locator(":scope > summary").click();
  await expect(catalogue).toHaveAttribute("open","");
  if(!fullCourse)return;
  const expand=page.getByRole("button",{name:"Open full course and advanced practice",exact:true});
  if(await expand.isVisible())await expand.click();
  await expect(page.getByRole("heading",{name:"Your Japanese journey"})).toBeVisible();
}
