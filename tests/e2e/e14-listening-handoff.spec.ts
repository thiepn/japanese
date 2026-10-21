import {openAdditionalLearn} from "./open-additional-learn";
import {readFileSync} from "node:fs";
import {expect,test,type Page} from "@playwright/test";

const fixture=JSON.parse(readFileSync("artifacts/e13-browser-seed.json","utf8")) as {
  guest:string;caseIds:string[];events:Array<Record<string,unknown>>;
};

async function originalOwnerPage(page:Page){
  await page.goto("./");
  await page.evaluate(async ({guest,events})=>{
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      const req=indexedDB.open("thiepn-japanese:"+guest,8);
      req.onupgradeneeded=()=>{
        const database=req.result;
        for(const name of ["study_events","sync_outbox","sync_meta","memory_traces",
          "private_documents","private_vocabulary","private_sentences",
          "private_media_reviews","private_prosody_captures"]){
          if(!database.objectStoreNames.contains(name))
            database.createObjectStore(name,{
              keyPath:name==="sync_outbox"?"mutation_id":name==="sync_meta"?"key":"id",
            });
        }
      };
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction("study_events","readwrite");
      for(const row of events)tx.objectStore("study_events").put(row);
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error);
      tx.onabort=()=>reject(tx.error);
    });
    db.close();
  },fixture);
  await page.reload();
  await page.getByRole("button",{name:"Learn",exact:true}).click();
 await openAdditionalLearn(page,true);
}
function studio(page:Page){
  return page.getByRole("region",{name:"Hear it. Respond. Write the follow-up."});
}

test("E14 unlocks exactly original cases and begins one coherent native listening-to-reply route",async({page})=>{
  await originalOwnerPage(page);
  const panel=studio(page);
  await expect(panel).toBeVisible();
  const sourceOptions=panel.getByLabel("Original situation").locator("option");
  expect(await sourceOptions.count()).toBeGreaterThanOrEqual(2);
  await expect(panel.getByText(/StudyEvents remain private per workspace/)).toBeVisible();
  await panel.getByLabel("Practice handoff").selectOption("listen-and-reply");
  await panel.getByRole("button",{name:"Start listening-to-response handoff"}).click();
  const player=page.locator("main.j5-study-shell");
  await expect(player).toBeVisible();
  await expect(player).toContainText("Extra practice");
  await player.locator("button.j5-next").click();
  await player.locator("button.j5-next").click();
  await expect(player.getByRole("button",{name:"Play Japanese audio"})).toBeVisible();
  await expect(player.getByText("Play the listening cue before answering.")).toBeVisible();
  await expect(player.getByRole("button",{name:"Play Japanese audio"})).toBeEnabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth))
    .toBeLessThanOrEqual(1);
});

test("E14 two original reply decisions hand off into private first/revised writing and source feedback",async({page})=>{
  await originalOwnerPage(page);
  const panel=studio(page);
  await panel.getByLabel("Practice handoff").selectOption("follow-up-and-revise");
  await panel.getByRole("button",{name:"Start listening-to-response handoff"}).click();
  const player=page.locator("main.j5-study-shell");
  await expect(player).toBeVisible();
  const firstWriting=player.getByRole("button",{name:"Record unscored E11 writing"});
  let choicesDone=0;
  for(let i=0;i<14 && !await firstWriting.isVisible();i++){
    const answers=player.locator(".j5-choices button");
    if(await answers.count()){
      await answers.first().click();
      await expect(player.locator(".j5-feedback")).toBeVisible();
      choicesDone++;
    }
    await player.locator("button.j5-next").click();
  }
  expect(choicesDone).toBe(2);
  await expect(firstWriting).toBeVisible();
  const first="すみません。午後六時の会の入り口を確認してください。西の入り口ですか。";
  const second="すみません。午後六時の交流会の受付は西の入り口だと聞きました。場所をご確認いただけますか。";
  await player.locator("textarea").fill(first);
  await firstWriting.click();
  await expect(player.locator(".j5-feedback")).toContainText("Response recorded");
  await player.locator("button.j5-next").click();
  await expect(player).toContainText("Revise the message");
  await player.locator("button.j5-next").click();
  await expect(player.getByText("E11 first draft · private, original learner text")).toBeVisible();
  await player.locator("textarea").fill(second);
  await player.getByRole("button",{name:"Record E12 unscored revision"}).click();
  await expect(player.locator(".j5-feedback")).toContainText("Response recorded");
  await player.locator("button.j5-next").click();
  await expect(player).toContainText("After the handoff");
  await player.locator("button.j5-next").click();
  const returned=studio(page);
  await expect(returned).toBeVisible();
  const open=returned.getByRole("button",{name:/Review my recorded attempts/});
  await expect(open).toContainText("4/5 source-linked stages");
  await open.click();
  const privateReview=returned.getByRole("region",{name:"Private Japanese handoff feedback"});
  await expect(privateReview).toBeVisible();
  // The journey deliberately selected the first offered option, not the
  // correct original line. Assert actual source correction rather than invent
  // a successful choice or a speaking/mastery grade.
  await expect(privateReview.getByText("Review the original context")).toHaveCount(2);
  await expect(privateReview).toContainText("First situated reply");
  await expect(privateReview).toContainText("Changed-situation reply");
  const texts=privateReview.getByText("Read my previous private Japanese text");
  await expect(texts).toHaveCount(2);
  await texts.first().click();
  await expect(privateReview.locator("pre[lang='ja']").first()).toContainText(first);
  await texts.last().click();
  await expect(privateReview.locator("pre[lang='ja']").last()).toContainText(second);
  await expect(privateReview).toContainText("not automatically assessed");
});

test("E14 studio and review controls fit Android and compact touch viewport",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","Mobile touch geometry only");
  await originalOwnerPage(page);
  const panel=studio(page);
  const button=panel.getByRole("button",{name:"Start listening-to-response handoff"});
  await button.scrollIntoViewIfNeeded();
  const box=await button.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.height).toBeGreaterThanOrEqual(44);
  const viewport=page.viewportSize()!;
  expect(box!.x).toBeGreaterThanOrEqual(-1);
  expect(box!.x+box!.width).toBeLessThanOrEqual(viewport.width+1);
  await expect(panel.getByLabel("Practice handoff")).toBeEnabled();
  await expect(panel.getByRole("button",{name:/Review my recorded attempts/})).toBeEnabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth))
    .toBeLessThanOrEqual(1);
});
