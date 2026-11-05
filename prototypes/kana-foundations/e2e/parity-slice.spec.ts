import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';

async function fixture(page){
 await page.goto('/index.html');
 await page.evaluate(async()=>{
  const m=await import('./engine.mjs');
  const s={...m.initialState(),phase:7,paused:false,
   introduced:['h-a','h-i','h-u','h-e','h-o'],
   records:[{stage:'recall',mode:'recall',item:'h-a',correct:false,assisted:false,
    correction:false,practiceOnly:false,submitted:'i',at:'2026-11-04T12:00:00.000Z'}]};
  localStorage.setItem(m.PROTOTYPE_STORAGE_KEY,JSON.stringify(s));
  localStorage.setItem('synthetic-account-sentinel','DO_NOT_TOUCH');
  localStorage.setItem('synthetic-fsrs-sentinel','DO_NOT_TOUCH');
 });
 await page.reload();
}

async function answerCurrent(page){
 const prompt=await page.evaluate(async()=>{
  const m=await import('./engine.mjs');
  return m.currentPracticePrompt(JSON.parse(localStorage.getItem(m.PROTOTYPE_STORAGE_KEY)));
 });
 if(prompt.mode==='sequence'){
  await page.getByRole('textbox',{name:'Type the three-vowel reading'}).fill(prompt.answer);
  await page.getByRole('button',{name:'Check practice answer'}).click();
 }else{
  await page.locator('button[data-practice-value="'+prompt.answer+'"]').click();
 }
 await expect(page.getByText(/Practice-only: correct/)).toBeVisible();
 await page.getByRole('button',{name:'Next practice question'}).click();
}
test('S1 complete guided-to-practice journey preserves legacy records and unrelated storage',async({page},testInfo)=>{
 await fixture(page);
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('thiepn:kana-foundations:prototype-only:v1')).records);
 await page.getByRole('button',{name:'Start 15-question mixed practice'}).click();
 await expect(page.getByRole('heading',{name:'Mixed recognition'})).toBeVisible();
 for(let i=0;i<15;i++){
  if(i===5)await expect(page.getByRole('heading',{name:'Reverse matching'})).toBeVisible();
  if(i===10)await expect(page.getByRole('heading',{name:'Three-character reading'})).toBeVisible();
  if([0,5,10].includes(i)&&process.env.CI){
   const dir='prototypes/kana-foundations/.visual-evidence';mkdirSync(dir,{recursive:true});
   await page.screenshot({path:dir+'/'+testInfo.project.name+'-s1-'+i+'.png',fullPage:true});
  }
  await answerCurrent(page);
 }
 await expect(page.getByRole('heading',{name:'Your five-vowel results'})).toBeVisible();
 await expect(page.getByText(/15 independent answers out of 15/)).toBeVisible();
 const after=await page.evaluate(async()=>{
  const m=await import('./engine.mjs');
  const stored=JSON.parse(localStorage.getItem(m.PROTOTYPE_STORAGE_KEY));
  return {records:stored.records,phase:stored.phase,status:stored.practiceSession.status,
   attempts:stored.practiceSession.attempts.length,independent:stored.practiceSession.attempts.filter(a=>a.independent).length,
   sentinels:[localStorage.getItem('synthetic-account-sentinel'),localStorage.getItem('synthetic-fsrs-sentinel')],
   dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(db=>db.name):[]};
 });
 expect(after.records).toEqual(before);
 expect(after.phase).toBe(7);
 expect(after.status).toBe('completed');
 expect(after.attempts).toBe(15);
 expect(after.independent).toBe(15);
 expect(after.sentinels).toEqual(['DO_NOT_TOUCH','DO_NOT_TOUCH']);
 expect(after.dbs).toEqual([]);
 await page.reload();
 await expect(page.getByText(/15 independent answers out of 15/)).toBeVisible();
});
test('S1 hints, wrong answers, reload and correction retain first evidence',async({page},testInfo)=>{
 await fixture(page);
 await page.getByRole('button',{name:'Start 15-question mixed practice'}).click();
 const p=await page.evaluate(async()=>{
  const m=await import('./engine.mjs');
  return m.currentPracticePrompt(JSON.parse(localStorage.getItem(m.PROTOTYPE_STORAGE_KEY)));
 });
 const wrong=p.choices.find(v=>v!==p.answer);
 await page.locator('button[data-practice-value="'+wrong+'"]').click();
 await expect(page.getByText(/Practice-only: incorrect/)).toBeVisible();
 await page.reload();
 await expect(page.getByText(/Practice-only: incorrect/)).toBeVisible();
 const record=await page.evaluate(()=>JSON.parse(localStorage.getItem('thiepn:kana-foundations:prototype-only:v1')).practiceSession.attempts[0]);
 expect(record.correct).toBe(false);
 expect(record.responseNormalized).toBe(wrong);
 await page.getByRole('button',{name:'Next practice question'}).click();
 await page.getByRole('button',{name:'Need a hint?'}).click();
 const q=await page.evaluate(async()=>{
  const m=await import('./engine.mjs');
  return m.currentPracticePrompt(JSON.parse(localStorage.getItem(m.PROTOTYPE_STORAGE_KEY)));
 });
 await page.locator('button[data-practice-value="'+q.answer+'"]').click();
 await expect(page.getByText(/Assisted practice/)).toBeVisible();
 if(process.env.CI){
  const dir='prototypes/kana-foundations/.visual-evidence';mkdirSync(dir,{recursive:true});
  await page.screenshot({path:dir+'/'+testInfo.project.name+'-s1-assisted.png',fullPage:true});
 }
 const events=await page.evaluate(()=>JSON.parse(localStorage.getItem('thiepn:kana-foundations:prototype-only:v1')).practiceSession.attempts);
 expect(events).toEqual(expect.arrayContaining([
  expect.objectContaining({correct:false,independent:false,correction:false,practiceOnly:true,canonicalEligible:false}),
  expect.objectContaining({correct:true,independent:false,assistanceLevel:'cue',practiceOnly:true})
 ]));
});
test('S1 pause/resume, 320px overflow, keyboard and reduced motion',async({page},testInfo)=>{
 await fixture(page);
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.setViewportSize({width:320,height:700});
 await page.getByRole('button',{name:'Start 15-question mixed practice'}).click();
 const check=async()=>{
  const rect=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth,
    buttons:[...document.querySelectorAll('button:not([disabled])')].map(b=>b.getBoundingClientRect().height)}));
  expect(rect.scroll).toBeLessThanOrEqual(rect.width+1);
  expect(Math.min(...rect.buttons)).toBeGreaterThanOrEqual(30);
 };
 await check();
 await page.getByRole('button',{name:'Exit lesson; progress is saved'}).click();
 await page.reload();
 await page.getByRole('button',{name:'Resume learning'}).click();
 await expect(page.getByRole('heading',{name:'Mixed recognition'})).toBeVisible();
 for(let i=0;i<10;i++)await answerCurrent(page);
 await expect(page.getByRole('heading',{name:'Three-character reading'})).toBeVisible();
 await expect(page.getByRole('textbox',{name:'Type the three-vowel reading'})).toBeFocused();
 await check();
 const prompt=await page.evaluate(async()=>{
  const m=await import('./engine.mjs');return m.currentPracticePrompt(JSON.parse(localStorage.getItem(m.PROTOTYPE_STORAGE_KEY)));
 });
 await page.getByRole('textbox',{name:'Type the three-vowel reading'}).fill(prompt.answer.toUpperCase());
 await page.getByRole('textbox',{name:'Type the three-vowel reading'}).press('Enter');
 await expect(page.getByText(/Practice-only: correct/)).toBeVisible();
 if(process.env.CI){
  const dir='prototypes/kana-foundations/.visual-evidence';mkdirSync(dir,{recursive:true});
  await page.screenshot({path:dir+'/'+testInfo.project.name+'-s1-sequence-feedback.png',fullPage:true});
 }
});
test('S1 detects stale sequential storage changes without erasing newer saved evidence',async({context})=>{
 const pageA=await context.newPage(),pageB=await context.newPage();
 await fixture(pageA);
 await pageB.goto('/index.html');
 await pageA.getByRole('button',{name:'Start 15-question mixed practice'}).click();
 const snapshot=await pageB.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:prototype-only:v1'));
 await pageB.getByRole('button',{name:'Start 15-question mixed practice'}).click();
 await expect(pageB.getByText(/another tab|changed since this tab loaded/i)).toBeVisible();
 const after=await pageB.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:prototype-only:v1'));
 expect(after).toBe(snapshot);
 await pageA.close();await pageB.close();
});
