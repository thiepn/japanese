import {expect,test} from "@playwright/test";
test("Japanese reference uses opt-in original images without adding images to every word",async({page})=>{
 await page.goto("./");
 await page.getByRole("button",{name:"Library",exact:true}).click();
 const search=page.getByRole("textbox",{name:"Search Japanese"});
 await search.fill("りんご");
 const apple=page.locator(".j7-result").filter({hasText:"りんご"}).first();
 await expect(apple).toBeVisible({timeout:15000});
 await apple.getByRole("option").click();
 const img=page.locator(".j7-reference__sheet--lexeme .vocabulary-visual img");
 await expect(img).toHaveAttribute("alt","Illustration of a red apple");
 await expect(img).toHaveAttribute("src",/\/vocab\/apple\.svg$/);
 await search.fill("電車");
 const train=page.locator(".j7-result").filter({hasText:"電車"}).first();
 await expect(train).toBeVisible({timeout:15000});
 await train.getByRole("option").click();
 await expect(page.locator(".j7-reference__sheet--lexeme .vocabulary-visual")).toHaveCount(0);
});
