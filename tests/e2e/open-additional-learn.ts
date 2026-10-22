import type {Page} from "@playwright/test";

// Navigate through the genuine beginner-first Learn disclosure, not hidden DOM.
export async function openAdditionalLearn(page:Page,fullCourse=false):Promise<void>{
  const catalogue=page.locator(".beginner-explore");
  if(!await catalogue.evaluate(node=>(node as HTMLDetailsElement).open))
    await catalogue.locator(":scope > summary").click();
  if(!fullCourse)return;
  const expand=page.getByRole("button",{name:"Open full course and advanced practice",exact:true});
  if(await expand.count())await expand.click();
}
