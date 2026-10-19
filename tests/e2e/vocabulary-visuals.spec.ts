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
 await search.fill("友達");
 const friend=page.locator(".j7-result").filter({hasText:"友達"}).first();
 await expect(friend).toBeVisible({timeout:15000});
 await friend.getByRole("option").click();
 await expect(page.locator(".j7-reference__sheet--lexeme .vocabulary-visual")).toHaveCount(0);
});

test("A1 and A2 words show their own source-linked illustrations",async({page})=>{
 await page.goto("./");
 await page.getByRole("button",{name:"Library",exact:true}).click();
 const search=page.getByRole("textbox",{name:"Search Japanese"});
 for(const entry of [{term:"学校",id:"lex-gakkou",file:"school"},{term:"病院",id:"lex-byouin",file:"hospital"}]){
   await search.fill(entry.term);
   const word=page.locator(".j7-result").filter({hasText:entry.term}).first();
   await expect(word).toBeVisible({timeout:15000});
   await word.getByRole("option").click();
   const sheet=page.locator(".j7-reference__sheet--lexeme");
   await expect(sheet).toContainText(entry.id);
   const img=sheet.locator(".vocabulary-visual img");
   await expect(img).toHaveAttribute("alt",new RegExp(entry.file==="school"?"school building":"hospital"));
   await expect(img).toHaveAttribute("src",new RegExp("/vocab/"+entry.file+"\\.svg$"));
 }
});

test("blocked optional images leave the original text reference available",async({page})=>{
 await page.route("**/vocab/house.svg",route=>route.abort());
 await page.goto("./");
 await page.getByRole("button",{name:"Library",exact:true}).click();
 const search=page.getByRole("textbox",{name:"Search Japanese"});
 await search.fill("家");
 const word=page.locator(".j7-result").filter({has:page.getByText("家",{exact:true})}).first();
 await expect(word).toBeVisible({timeout:15000});
 await word.getByRole("option").click();
 const sheet=page.locator(".j7-reference__sheet--lexeme");
 await expect(sheet).toContainText("house");
 await sheet.scrollIntoViewIfNeeded();
 await expect(sheet.locator(".vocabulary-visual")).toHaveCount(0);
});
