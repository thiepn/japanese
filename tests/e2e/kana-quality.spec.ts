import {expect,test,type Page} from "@playwright/test";

async function startKatakana(page:Page){
  await page.goto("./");
  await page.getByRole("button",{name:"Learn",exact:true}).click();
  const review=page.getByRole("region",{name:"Kana Review"});
  await review.getByRole("button",{name:"Katakana"}).click();
  await review.getByRole("button",{name:"Recognition"}).click();
  await review.getByRole("button",{name:"Start kana practice"}).click();
  await expect(page.locator(".study-lesson")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  return review;
}
async function readKanaEvidence(page:Page){
  return page.evaluate(async()=>{
    const request=indexedDB.open("thiepn-japanese:00000000-0000-4000-8000-000000000001");
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
    try{
      return await new Promise<{events:Array<{result:string;metadata?:Record<string,unknown>}>;trace:{revision:number;card:{reps:number;due:string}}|null}>((resolve,reject)=>{
        const tx=db.transaction(["study_events","memory_traces"],"readonly");
        const events=tx.objectStore("study_events").getAll();
        const trace=tx.objectStore("memory_traces").get("kana:katakana-ア:recognition:kana-to-sound");
        tx.oncomplete=()=>resolve({
          events:(events.result as Array<{primaryTarget:{kind:string;id:string};result:string;metadata?:Record<string,unknown>}>)
            .filter(item=>item.primaryTarget?.id==="katakana-ア"),
          trace:trace.result??null
        });
        tx.onerror=()=>reject(tx.error);
      });
    }finally{db.close();}
  });
}

test("kana recognition writes original FSRS trace, keeps it on reload, and counts it only once",async({page})=>{
  await startKatakana(page);
  await expect(page.locator(".j5-prompt")).toContainText("ア");
  await page.locator(".j5-choices").getByRole("button",{name:"a",exact:true}).click();
  await expect(page.getByText("Correct",{exact:true})).toBeVisible();
  const initial=await readKanaEvidence(page);
  expect(initial.events).toHaveLength(1);
  expect(initial.trace?.revision).toBe(1);
  expect(initial.trace?.card.reps).toBe(1);
  expect(Number.isFinite(Date.parse(initial.trace!.card.due))).toBe(true);
  await page.getByRole("button",{name:"Exit"}).click();
  await page.reload();
  const persisted=await readKanaEvidence(page);
  expect(persisted).toEqual(initial);
  const review=page.getByRole("region",{name:"Kana Review"});
  await review.getByRole("button",{name:"Katakana"}).click();
  await review.getByRole("button",{name:"Recognition"}).click();
  const due=Number(await review.locator(".kana-review__counts dd").first().textContent());
  const fresh=Number(await review.locator(".kana-review__counts dd").nth(1).textContent());
  expect(due+fresh).toBeGreaterThan(0);
});

test("wrong kana gets one same-session correction without early FSRS advancement",async({page})=>{
  await startKatakana(page);
  const initialCounter=await page.locator(".j5-study-head .j5-step-count").textContent();
  const total=Number(initialCounter?.split("/")[1]?.trim());
  await page.locator(".j5-choices").getByRole("button",{name:"i",exact:true}).click();
  await expect(page.locator(".j5-feedback.incorrect")).toBeVisible();
  expect(await page.locator(".j5-study-head .j5-step-count").textContent()).toContain("/ "+(total+1));
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  for(const answer of ["i","u","e","o"]){
    await page.locator(".j5-choices").getByRole("button",{name:answer,exact:true}).click();
    await expect(page.getByText("Correct",{exact:true})).toBeVisible();
    await page.getByRole("button",{name:"Continue",exact:true}).click();
  }
  await expect(page.getByText("Correction practice. The original spaced-repetition due date is unchanged.")).toBeVisible();
  await page.locator(".j5-choices").getByRole("button",{name:"a",exact:true}).click();
  await expect(page.getByText("Correct",{exact:true})).toBeVisible();
  const evidence=await readKanaEvidence(page);
  expect(evidence.events).toHaveLength(2);
  expect(evidence.events.map(item=>item.result)).toEqual(["incorrect","correct"]);
  expect(evidence.events[1]?.metadata?.schedulerExcluded).toBe(true);
  expect(evidence.trace?.revision).toBe(1);
  expect(evidence.trace?.card.reps).toBe(1);
  await page.getByRole("button",{name:"Exit"}).click();
  await page.reload();
  const saved=await readKanaEvidence(page);
  expect(saved).toEqual(evidence);
});

test("mixed kana includes both scripts in the initial session",async({page})=>{
  await page.goto("./");
  const review=page.getByRole("region",{name:"Kana Review"});
  await review.getByRole("button",{name:"Mixed"}).click();
  await review.getByRole("button",{name:"Recognition"}).click();
  await review.getByRole("button",{name:"Start kana practice"}).click();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.locator(".j5-prompt")).toContainText("あ");
  await page.locator(".j5-choices").getByRole("button",{name:"a",exact:true}).click();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.locator(".study-lesson")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.locator(".j5-prompt")).toContainText("ア");
});
