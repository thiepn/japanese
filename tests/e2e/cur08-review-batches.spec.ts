import {test,expect} from "@playwright/test";
test("CUR-08 review entry keeps global and selected counts separately visible on desktop and mobile",async({page})=>{
 await page.goto("./#course/A1");
 const panel=page.getByRole("region",{name:"Vocabulary and level reviews"});
 await expect(panel).toBeVisible();
 await expect(panel.getByText("due across Japanese")).toBeVisible();
 const original=await panel.locator(".cur05-global strong").innerText();
 await panel.getByRole("button",{name:"All levels",exact:true}).click();
 await expect(panel.locator(".cur05-global strong")).toHaveText(original);
 const action=panel.locator(".cur05-actions button").first();
 await expect(action).toHaveText(/Review (selected due|next)/);
 await panel.getByRole("button",{name:"Choose levels"}).click();
 await panel.getByRole("checkbox",{name:"A1",exact:true}).check();
 await panel.getByRole("checkbox",{name:"Unassigned"}).check();
 await expect(panel.locator(".cur05-global strong")).toHaveText(original);
 await expect(action).toHaveText(/Review (selected due|next)/);
 await expect(panel.getByText(/due in selection/)).toBeVisible();
 await expect(panel.getByRole("heading",{name:"Source-linked vocabulary"})).toBeVisible();
});
