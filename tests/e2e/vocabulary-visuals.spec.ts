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
 await search.fill("日本語");
 const unillustrated=page.locator(".j7-result.result-lexeme").filter({has:page.getByText("日本語",{exact:true})}).first();
 await expect(unillustrated).toBeVisible({timeout:15000});
 await unillustrated.getByRole("option").click();
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
   await expect(img).toHaveAttribute("alt",new RegExp(entry.file==="school"?"school with classroom windows":"hospital building marked with a medical cross"));
   await expect(img).toHaveAttribute("src",new RegExp("/vocab/"+entry.file+"\\.svg$"));
 }
});

test.describe("Unavailable optional images",()=>{
 test.use({serviceWorkers:"block"});
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
 const image=sheet.locator(".vocabulary-visual img");
 await sheet.scrollIntoViewIfNeeded();
 await expect(sheet.locator(".vocabulary-visual")).toHaveCount(0);
});

});


test("VOC3 new A1 and A2 canonical words display mapped, lazy illustrations",async({page})=>{
 await page.goto("./");
 await page.getByRole("button",{name:"Library",exact:true}).click();
 const search=page.getByRole("textbox",{name:"Search Japanese"});
 for(const word of [{term:"学生",id:"lex-gakusei",file:"student.svg"},{term:"メール",id:"lex-meeru",file:"email.svg"}]){
   await search.fill(word.term);
   const result=page.locator(".j7-result.result-lexeme").filter({has:page.getByText(word.term,{exact:true})}).first();
   await expect(result).toBeVisible({timeout:15000});
   await result.getByRole("option").click();
   const sheet=page.locator(".j7-reference__sheet--lexeme");
   await expect(sheet).toContainText(word.id);
   const image=sheet.locator(".vocabulary-visual img");
   await expect(image).toHaveAttribute("loading","lazy");
   await expect(image).toHaveAttribute("src",new RegExp("/vocab/"+word.file.replace(".","\\.")+"$"));
   await image.scrollIntoViewIfNeeded();
   await expect.poll(async()=>image.evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 }
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 expect(overflow).toBeLessThanOrEqual(1);
});


test("VOC4 rebuilt learning images retain meaningful accessible descriptions",async({page})=>{
 await page.goto("./");await page.getByRole("button",{name:"Library",exact:true}).click();
 const search=page.getByRole("textbox",{name:"Search Japanese"});
 for(const entry of [{word:"学校",description:/school with classroom windows/},{word:"病院",description:/hospital building marked/},{word:"駅",description:/railway station with a clock/}]){
   await search.fill(entry.word);
   const word=page.locator(".j7-result.result-lexeme").filter({has:page.getByText(entry.word,{exact:true})}).first();
   await expect(word).toBeVisible({timeout:15000});await word.getByRole("option").click();
   const img=page.locator(".j7-reference__sheet--lexeme .vocabulary-visual img");
   await expect(img).toHaveAttribute("alt",entry.description);
   await img.scrollIntoViewIfNeeded();
   await expect.poll(async()=>img.evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 }
});

test.describe("Vocabulary illustration reconnection",()=>{
 test.use({serviceWorkers:"block"});
 test("retries an optional failed image on reconnect without changing its text reference",async({page})=>{
   let disconnected=true;
   let failedRequests=0;
   await page.route("**/vocab/apple.svg",route=>{
     if(disconnected){failedRequests+=1;return route.abort("internetdisconnected");}
     return route.continue();
   });
   await page.goto("./");
   await page.getByRole("button",{name:"Library",exact:true}).click();
   const search=page.getByRole("textbox",{name:"Search Japanese"});
   await search.fill("りんご");
   const word=page.locator(".j7-result.result-lexeme").filter({has:page.getByText("りんご",{exact:true})}).first();
   await expect(word).toBeVisible({timeout:15000});
   await word.getByRole("option").click();
   const sheet=page.locator(".j7-reference__sheet--lexeme");
   const image=sheet.locator(".vocabulary-visual img");
   await sheet.scrollIntoViewIfNeeded();
   await expect.poll(()=>failedRequests).toBeGreaterThan(0);
   await expect(sheet.locator(".vocabulary-visual")).toHaveCount(0);
   await expect(sheet).toContainText("apple");
   disconnected=false;
   await page.evaluate(()=>window.dispatchEvent(new Event("online")));
   await expect(image).toHaveAttribute("src",/\/vocab\/apple\.svg$/);
   await image.scrollIntoViewIfNeeded();
   await expect.poll(async()=>image.evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
   await expect(sheet).toContainText("apple");
 });
});

test("VOC8 original daily actions render decoded accessible illustrations",async({page})=>{
 await page.goto("./");
 await page.getByRole("button",{name:"Library",exact:true}).click();
 const search=page.getByRole("textbox",{name:"Search Japanese"});
 for(const item of [
   {term:"食べる",file:"eat.svg",alt:/bringing food from a plate to their mouth/},
   {term:"飲む",file:"drink.svg",alt:/lifting a tilted cup to drink/},
   {term:"起きる",file:"wake-up.svg",alt:/sitting up and stretching in bed/}
 ]){
   await search.fill(item.term);
   const result=page.locator(".j7-result.result-lexeme").filter({has:page.getByText(item.term,{exact:true})}).first();
   await expect(result).toBeVisible({timeout:15000});
   await result.getByRole("option").click();
   const image=page.locator(".j7-reference__sheet--lexeme .vocabulary-visual img");
   await expect(image).toHaveAttribute("alt",item.alt);
   await expect(image).toHaveAttribute("loading","lazy");
   await expect(image).toHaveAttribute("src",new RegExp("/vocab/"+item.file.replace(".","\\.")+"$"));
   await image.scrollIntoViewIfNeeded();
   await expect.poll(async()=>image.evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 }
});

test("VOC8 quiet reference shows semantic original hush image",async({page})=>{
 await page.goto("./");
 await page.getByRole("button",{name:"Library",exact:true}).click();
 const search=page.getByRole("textbox",{name:"Search Japanese"});
 await search.fill("静か");
 const result=page.locator(".j7-result.result-lexeme").filter({has:page.getByText("静か",{exact:true})}).first();
 await expect(result).toBeVisible({timeout:15000});
 await result.getByRole("option").click();
 const img=page.locator(".j7-reference__sheet--lexeme .vocabulary-visual img");
 await expect(img).toHaveAttribute("alt",/finger to their lips/);
 await expect(img).toHaveAttribute("src",/\/vocab\/quiet\.svg$/);
 await img.scrollIntoViewIfNeeded();
 await expect.poll(async()=>img.evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
});
