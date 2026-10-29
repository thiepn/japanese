import {test,expect} from "@playwright/test";
test("CUR-03 original contextual lesson position survives reload for one account",async({page})=>{
 await page.goto("./#course/A1");
 const catalog=page.getByRole("region",{name:"Six-level course catalog"});
 await expect(catalog).toBeVisible();
 const row=catalog.locator(".cur01-lessons li[data-cur03-deep=true]").first();
 await expect(row).toBeVisible();
 await row.getByRole("button",{name:/^(Open|Resume) lesson \d+:/i}).click();
 await expect(page.locator(".study-lesson h1")).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 const first=await page.locator(".study-lesson h1").innerText();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 const second=await page.locator(".study-lesson h1").innerText();
 expect(second).not.toBe(first);
 await page.getByRole("button",{name:"Exit"}).click();
 await page.reload();
 await expect(catalog).toBeVisible();
 await catalog.locator(".cur01-lessons li[data-cur03-deep=true]").first()
   .getByRole("button",{name:/^(Open|Resume) lesson \d+:/i}).click();
 await expect(page.locator(".study-lesson h1")).toHaveText(second);
});
test("CUR-03 respects direct B1 entry and truthful empty C2",async({page})=>{
 await page.goto("./#course/B1");
 const catalog=page.getByRole("region",{name:"Six-level course catalog"});
 await expect(catalog.getByRole("tab",{name:/B1/})).toHaveAttribute("aria-selected","true");
 await catalog.getByRole("tab",{name:/C2/}).click();
 await expect(catalog.getByText(/no published course units at this level/i)).toBeVisible();
});
for(const [unitTitle,teachingTitle,sourceText] of [["People together","Talk with someone, or add someone too","友達と話します。"],["Now, not, and before","Going, not going, and what already happened","今日は学校に行きます。"],["Whose and which things","Relate nouns with の, or list items with と","これは私の本です。"],["Describe now and before","Past and negative forms for two adjective types","昨日は暑かったです。"],["Order food and request items","Order quantities with 一つ and 二つ","パンを二つください。"]] as const){
 test("CUR-11 native A1 source example: "+unitTitle,async({page})=>{
  await page.goto("./#course/A1");
  const catalog=page.getByRole("region",{name:"Six-level course catalog"});
  const row=catalog.locator(".cur01-lessons li").filter({has:page.getByRole("heading",{name:unitTitle,exact:true})});
  await expect(row).toBeVisible();
  await row.getByRole("button",{name:/^(Open|Resume) lesson \\d+:/i}).click();
  await expect(page.locator(".study-lesson h1")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.locator(".study-lesson h1")).toHaveText(teachingTitle);
  await expect(page.locator(".lesson-examples strong[lang='ja']").first()).toHaveText(sourceText);
 });
}
