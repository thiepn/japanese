import {expect,test} from "@playwright/test";

async function openMorning(page:import("@playwright/test").Page){
  await page.goto("./");
  await page.getByRole("button",{name:"Immerse",exact:true}).click();
  await page.locator(".j6-cover").filter({hasText:"A school morning"}).getByRole("button",{name:"Open text"}).click();
  await expect(page.locator(".j6-reader")).toBeVisible();
}

test.beforeEach(async({page})=>{
  await page.addInitScript(()=>{
    const w=window as any;
    const state={utterances:[] as any[],cancels:0};
    w.__readerSpeech=state;
    w.SpeechSynthesisUtterance=class {
      lang="";rate=1;voice=null;onend:any=null;onerror:any=null;
      constructor(public text:string){}
    };
    Object.defineProperty(window,"speechSynthesis",{configurable:true,value:{
      cancel(){state.cancels++},
      getVoices(){return []},
      speak(utterance:any){state.utterances.push(utterance)},
    }});
  });
});

test("closing an immersion reader prevents late voice completion from awarding listening mastery",async({page})=>{
  await openMorning(page);
  const button=page.getByRole("button",{name:"Listen to full text"});
  // This reading uses device speech synthesis; native recordings are separately guarded.
  await expect(button).toBeVisible();
  await button.click();
  await expect(page.getByRole("button",{name:"Playing…",exact:true})).toBeVisible();
  await page.locator(".j6-reader__back").click();
  const card=page.locator(".j6-cover").filter({hasText:"A school morning"});
  await expect(card).toBeVisible();
  const before=await card.locator(".j6-cover__footer > div").nth(1).locator("strong").innerText();
  await page.evaluate(()=>{
    const state=(window as any).__readerSpeech;
    const last=state.utterances.at(-1);
    last?.onend?.();
  });
  await expect(card.locator(".j6-cover__footer > div").nth(1).locator("strong")).toHaveText(before);
  const counts=await page.evaluate(()=>({cancels:(window as any).__readerSpeech.cancels}));
  expect(counts.cancels).toBeGreaterThan(0);
});

test("failed sentence speech does not award listening evidence and offers a retry",async({page})=>{
  await openMorning(page);
  const sentence=page.getByRole("button",{name:"Replay sentence"}).first();
  await sentence.click();
  await page.evaluate(()=>{
    const last=(window as any).__readerSpeech.utterances.at(-1);
    last?.onerror?.();
  });
  await expect(page.getByRole("status")).toContainText("Sentence playback failed");
  await expect(page.getByRole("button",{name:"Replay sentence"}).first()).toBeEnabled();
  await page.locator(".j6-reader__back").click();
  const card=page.locator(".j6-cover").filter({hasText:"A school morning"});
  await expect(card.locator(".j6-cover__footer > div").nth(1).locator("strong")).toHaveText("0%");
});
