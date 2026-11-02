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

for(const [unitTitle,priorTitle,newTitle,sourceText] of [["Point to things","Point to things: これ versus この","Choose この or その before a noun","この本は日本語です。"],["Daily routines across time","Tell your routine and what did not happen","When versus where: に and で in a daily routine","毎日七時に起きます。"],["Describe now and before","Past and negative forms for two adjective types","Negative descriptions: くない and じゃなかった","今日は寒くないです。"]] as const){
 test("CUR-15 keeps previous course lessons and reaches the new source context: "+unitTitle,async({page})=>{
  await page.goto("./#course/A1");
  const catalog=page.getByRole("region",{name:"Six-level course catalog"});
  const row=catalog.locator(".cur01-lessons li").filter({has:page.getByRole("heading",{name:unitTitle,exact:true})});
  await expect(row).toBeVisible();
  await row.getByRole("button",{name:/^(Open|Resume) lesson \d+:/i}).click();
  await expect(page.locator(".study-lesson h1")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  const visited:string[]=[];
  for(let step=0;step<36;step++){
   const h1=page.locator(".study-lesson h1");
   if(await h1.count()){
    const title=await h1.innerText();
    if(title===newTitle)break;
    visited.push(title);
    await page.getByRole("button",{name:"Continue",exact:true}).click();
   }else if(await page.locator(".j5-choices button").count()){
    await page.locator(".j5-choices button").first().click();
    await expect(page.getByText("UNSCORED CONTEXT CHECK")).toBeVisible();
    await page.getByRole("button",{name:"Continue",exact:true}).click();
   }else if(await page.locator(".j5-writing textarea").count()){
    await page.locator(".j5-writing textarea").fill("私は日本語を勉強します。");
    await page.getByRole("button",{name:"Record unscored writing"}).click();
    await expect(page.getByText("UNSCORED RESPONSE")).toBeVisible();
    await page.getByRole("button",{name:"Continue",exact:true}).click();
   }else throw new Error("CUR15_UNEXPECTED_STEP_BEFORE_NEW_CONTEXT");
  }
  expect(visited).toContain(priorTitle);
  await expect(page.locator(".study-lesson h1")).toHaveText(newTitle);
  await expect(page.locator(".lesson-examples strong[lang='ja']").first()).toHaveText(sourceText);
 });
}

test("CUR-16 lets A1 learners navigate directly to original course without submitting optional assessments",async({page})=>{
 await page.goto("./#course/A1");
 const catalog=page.getByRole("region",{name:"Six-level course catalog"});
 const row=catalog.locator(".cur01-lessons li").filter({has:page.getByRole("heading",{name:"Point to things",exact:true})});
 await expect(row).toBeVisible();
 await row.getByRole("button",{name:/^(Open|Resume) lesson \d+:/i}).click();
 await expect(page.locator(".study-lesson h1")).toHaveText("Point to things");
 const group=page.getByRole("group",{name:"Optional A1 teaching shortcut"});
 await expect(group.getByText("21 steps before the original course", {exact:false})).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(group.getByText("21 steps before the original course",{exact:false})).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(group.getByText("20 steps before the original course",{exact:false})).toBeVisible();

 await group.getByRole("button",{name:/Go to original course/}).click();
 await expect(page.locator(".study-lesson h1")).toHaveText("これ / それ / あれ");
 await expect(page.locator(".j5-choices")).toHaveCount(0);
 await page.getByRole("button",{name:"Exit",exact:true}).click();
 await expect(row.getByRole("button",{name:/^(Open|Resume) lesson \d+:/i})).toContainText("Resume");
 await page.reload();
 const resumedRow=page.getByRole("region",{name:"Six-level course catalog"}).locator(".cur01-lessons li").filter({has:page.getByRole("heading",{name:"Point to things",exact:true})});
 await resumedRow.getByRole("button",{name:/^(Open|Resume) lesson \d+:/i}).click();
 await expect(page.locator(".study-lesson h1")).toHaveText("これ / それ / あれ");
 await expect(page.getByRole("group",{name:"Optional A1 teaching shortcut"})).toHaveCount(0);
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.locator(".j5-choices")).toBeVisible();
});
test("CUR-16 optional shortcut never appears in unrelated original vocabulary practice",async({page})=>{
 await page.goto("./#course/A1");
 const row=page.getByRole("region",{name:"Vocabulary and level reviews"}).locator(".cur05-vocabulary li").first();
 await row.getByRole("button",{name:/Explore original contexts/}).click();
 await expect(page.locator(".study-lesson h1")).toBeVisible();
 await expect(page.getByRole("group",{name:"Optional A1 teaching shortcut"})).toHaveCount(0);
});

test("CUR-20 A1 entry shows next lesson and resumes real ungraded writing after reload",async({page})=>{
 await page.goto("./#course/A1");
 const catalog=page.getByRole("region",{name:"Six-level course catalog"});
 const card=catalog.getByRole("region",{name:"Your next A1 lesson"});
 await expect(card.getByRole("heading",{name:/Unit 01 · Identify people/})).toBeVisible();
 await card.getByRole("button",{name:"Start this lesson"}).click();
 await expect(page.locator(".study-lesson h1")).toHaveText("Identify people");
 await page.getByRole("group",{name:"Optional A1 teaching shortcut"})
   .getByRole("button",{name:"Try independent A1 writing · ungraded"}).click();
 await expect(page.locator(".j5-writing textarea")).toBeVisible();
 await page.getByRole("button",{name:"Exit",exact:true}).click();
 await expect(card).toContainText("Return to section");
 await page.reload();
 await catalog.getByRole("region",{name:"Your next A1 lesson"}).getByRole("button",{name:"Resume this lesson"}).click();
 await expect(page.locator(".j5-writing textarea")).toBeVisible();
 await page.locator(".j5-writing textarea").fill("私は学生です。");
 await page.getByRole("button",{name:"Record unscored writing"}).click();
 await expect(page.getByText("UNSCORED RESPONSE")).toBeVisible();
});

test("CUR-21 next A1 card resumes the most recent actual checkpoint, not the first unstarted unit",async({page})=>{
 await page.goto("./#course/A1");
 const catalog=page.getByRole("region",{name:"Six-level course catalog"});
 const card=catalog.getByRole("region",{name:"Your next A1 lesson"});
 await expect(card.getByRole("heading",{name:/Unit 01 · Identify people/})).toBeVisible();
 await card.getByRole("button",{name:"Start this lesson"}).click();
 await page.getByRole("group",{name:"Optional A1 teaching shortcut"})
   .getByRole("button",{name:/Go to original course/}).click();
 await page.getByRole("button",{name:"Exit",exact:true}).click();
 await expect(card.getByRole("heading",{name:/Unit 01 · Identify people/})).toBeVisible();
 const row=catalog.locator(".cur01-lessons li")
   .filter({has:page.getByRole("heading",{name:"Point to things",exact:true})});
 await row.getByRole("button",{name:/^(Open|Resume) lesson \d+:/i}).click();
 await page.getByRole("group",{name:"Optional A1 teaching shortcut"})
   .getByRole("button",{name:/Go to original course/}).click();
 await page.getByRole("button",{name:"Exit",exact:true}).click();
 await expect(card.getByRole("heading",{name:/Unit 09 · Point to things/})).toBeVisible();
 await expect(card).toContainText("Return to section");
 await card.getByRole("button",{name:"Resume this lesson"}).click();
 await expect(page.locator(".study-lesson h1")).toHaveText("これ / それ / あれ");
});

test("CUR-22 a first visit to A1 unit 09 is resumable even without advancing a section",async({page})=>{
 await page.goto("./#course/A1");
 const catalog=page.getByRole("region",{name:"Six-level course catalog"});
 const card=catalog.getByRole("region",{name:"Your next A1 lesson"});
 const row=catalog.locator(".cur01-lessons li").filter({has:page.getByRole("heading",{name:"Point to things",exact:true})});
 await row.getByRole("button",{name:/^(Open|Resume) lesson \d+:/i}).click();
 await expect(page.locator(".study-lesson h1")).toHaveText("Point to things");
 await page.getByRole("button",{name:"Exit",exact:true}).click();
 await expect(card.getByRole("heading",{name:/Unit 09 · Point to things/})).toBeVisible();
 await expect(card.getByRole("button",{name:"Resume this lesson"})).toBeVisible();
 await page.reload();
 await catalog.getByRole("region",{name:"Your next A1 lesson"}).getByRole("button",{name:"Resume this lesson"}).click();
 await expect(page.locator(".study-lesson h1")).toHaveText("Point to things");
});
test("CUR-22 ungraded writing feedback exposes real source comparisons, not an automatic language grade",async({page})=>{
 await page.goto("./#course/A1");
 const catalog=page.getByRole("region",{name:"Six-level course catalog"});
 await catalog.getByRole("region",{name:"Your next A1 lesson"}).getByRole("button",{name:"Start this lesson"}).click();
 await page.getByRole("group",{name:"Optional A1 teaching shortcut"}).getByRole("button",{name:"Try independent A1 writing · ungraded"}).click();
 await page.locator(".j5-writing textarea").fill("私は学生です。");
 await page.getByRole("button",{name:"Record unscored writing"}).click();
 await expect(page.getByText("UNSCORED RESPONSE")).toBeVisible();
 const review=page.locator("details.cur21-writing-self-review");
 await expect(review.getByText("Self-review using THIEPN-authored A1 teaching examples")).toBeVisible();
 await review.locator("summary").click();
 await expect(review.getByText("Grammar explanation:")).toBeVisible();
 await expect(review.locator("strong[lang=ja]").first()).toBeVisible();
 await expect(review.getByText("No automatic language grade or FSRS progress is awarded.",{exact:false})).toBeVisible();
});
