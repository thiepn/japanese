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
  await row.getByRole("button",{name:/^(Open|Resume) lesson \d+:/i}).click();
  await expect(page.locator(".study-lesson h1")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.locator(".study-lesson h1")).toHaveText(teachingTitle);
  await expect(page.locator(".lesson-examples strong[lang='ja']").first()).toHaveText(sourceText);
 });
}

for(const [unitTitle,teachingTitle,sourceText] of [["Ask where and which","Ask where, what, which, or who","学校はどこですか。"],["Daily routines across time","Tell your routine and what did not happen","毎日七時に起きます。"],["Shop for basic things","Ask a price and choose what to buy","これはいくらですか。"],["Keep a simple exchange natural","Invite agreement or provide new information","今日は寒いですね。"]] as const){
 test("CUR-12 original A1 communication source: "+unitTitle,async({page})=>{
  await page.goto("./#course/A1");
  const catalog=page.getByRole("region",{name:"Six-level course catalog"});
  const row=catalog.locator(".cur01-lessons li").filter({has:page.getByRole("heading",{name:unitTitle,exact:true})});
  await expect(row).toBeVisible();
  await row.getByRole("button",{name:/^(Open|Resume) lesson \d+:/i}).click();
  await expect(page.locator(".study-lesson h1")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.locator(".study-lesson h1")).toHaveText(teachingTitle);
  await expect(page.locator(".lesson-examples strong[lang='ja']").first()).toHaveText(sourceText);
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.locator(".study-lesson h1")).toHaveText("Why it works");
 });
}

for(const [unitTitle,teachingTitle,sourceText] of [["Talk about family","Talk about your family: people, roles, and locations","私の家族は四人です。"],["Tell time and schedules","Read the clock and set a precise meeting time","今は七時です。"],["Preferences and descriptions","Describe an object instead of stating a preference","本が好きです。"],["Ask for repetition and help","Build polite requests from the verb て-form","ここに書いてください。"]] as const){
 test("CUR-13 source-owned A1 transfer: "+unitTitle,async({page})=>{
  await page.goto("./#course/A1");
  const catalog=page.getByRole("region",{name:"Six-level course catalog"});
  const row=catalog.locator(".cur01-lessons li").filter({has:page.getByRole("heading",{name:unitTitle,exact:true})});
  await expect(row).toBeVisible();
  await row.getByRole("button",{name:/^(Open|Resume) lesson \d+:/i}).click();
  await expect(page.locator(".study-lesson h1")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.locator(".study-lesson h1")).toHaveText(teachingTitle);
  await expect(page.locator(".lesson-examples strong[lang='ja']").first()).toHaveText(sourceText);
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.locator(".study-lesson h1")).toHaveText("Why it works");
 });
}

for(const [unitTitle,teachingTitle,sourceText] of [["Identify people","Identify someone with a polite noun predicate","学生です。"],["Talk about actions","State an everyday action or ask what someone will do","本を読みます。"],["Where things and people are","Say what exists in a place: に, が and existence verbs","学校に先生がいます。"],] as const){
 test("CUR-14 foundation and source-link: "+unitTitle,async({page})=>{
  await page.goto("./#course/A1");
  const catalog=page.getByRole("region",{name:"Six-level course catalog"});
  const row=catalog.locator(".cur01-lessons li").filter({has:page.getByRole("heading",{name:unitTitle,exact:true})});
  await expect(row).toBeVisible();
  await row.getByRole("button",{name:/^(Open|Resume) lesson \d+:/i}).click();
  await expect(page.locator(".study-lesson h1")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.locator(".study-lesson h1")).toHaveText(teachingTitle);
  await expect(page.locator(".lesson-examples strong[lang='ja']").first()).toHaveText(sourceText);
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.locator(".study-lesson h1")).toHaveText("Why it works");
 });
}

test("CUR-14 item requests follow the preserved CUR-11 counter lesson in the same unit",async({page})=>{
 await page.goto("./#course/A1");
 const catalog=page.getByRole("region",{name:"Six-level course catalog"});
 const row=catalog.locator(".cur01-lessons li").filter({has:page.getByRole("heading",{name:"Order food and request items",exact:true})});
 await expect(row).toBeVisible();
 await row.getByRole("button",{name:/^(Open|Resume) lesson \d+:/i}).click();
 await expect(page.locator(".study-lesson h1")).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.locator(".study-lesson h1")).toHaveText("Order quantities with 一つ and 二つ");
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.locator(".study-lesson h1")).toHaveText("Why it works");
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 for(let i=0;i<3;i++){
  const choices=page.locator(".j5-choices");
  await expect(choices).toBeVisible();
  await choices.getByRole("button").first().click();
  await expect(page.getByText("UNSCORED CONTEXT CHECK")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
 }
 await expect(page.locator(".study-lesson h1")).toHaveText("Use it in a different situation");
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.locator(".j5-writing textarea")).toBeVisible();
 await page.locator(".j5-writing textarea").fill("パンを二つください。");
 await page.getByRole("button",{name:"Record unscored writing"}).click();
 await expect(page.getByText("UNSCORED RESPONSE")).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.locator(".study-lesson h1")).toHaveText("Request an item, or report an action");
 await expect(page.locator(".lesson-examples strong[lang='ja']").first()).toHaveText("コーヒーをください。");
});
