import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import * as S from '../sokuon-rhythm-engine.mjs';

const KEY=S.STORAGE_KEY;
const olderKeys=[
 'thiepn:kana-foundations:prototype-only:v1',
 'thiepn:kana-foundations:k-row:prototype-only:v1',
 'thiepn:kana-foundations:s-row:prototype-only:v1',
 'thiepn:kana-foundations:t-row:prototype-only:v1',
 'thiepn:kana-foundations:n-row:prototype-only:v1',
 'thiepn:kana-foundations:h-row:prototype-only:v1',
 'thiepn:kana-foundations:m-row:prototype-only:v1',
 'thiepn:kana-foundations:y-row:prototype-only:v1',
 'thiepn:kana-foundations:r-row:prototype-only:v1',
 'thiepn:kana-foundations:w-row:prototype-only:v1',
 'thiepn:kana-foundations:reading-review:prototype-only:v1',
 'thiepn:kana-foundations:dakuten-gz:prototype-only:v1',
 'thiepn:kana-foundations:dakuten-d:prototype-only:v1',
 'thiepn:kana-foundations:dakuten-bp:prototype-only:v1'
];
async function start(page){
 await page.goto('/sokuon-rhythm.html');
 await page.getByRole('button',{name:'Start Unit 15'}).click();
}
async function correct(page,t,input=t.answer){
 if(t.choices){
  const option=t.choices.find(x=>x.value===input);
  expect(option,'option for '+t.id).toBeTruthy();
  await page.getByRole('button',{name:'Option '+option.label,exact:true}).click();
 }else{
  const field=page.getByRole('textbox',{name:'Type the romaji reading'});
  await field.fill(input);
  await page.getByRole('button',{name:'Check answer'}).click();
 }
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:'Continue',exact:true}).click();
}
test('24 original Unit 15 prompts, saved checkpoint, all six browsers, old data preserved',async({page},info)=>{
 await page.goto('/sokuon-rhythm.html');
 await page.evaluate(keys=>{
  keys.forEach((key,index)=>localStorage.setItem(key,'older-unit-'+index));
  localStorage.setItem('thiepn:account:sentinel','account-safe');
  localStorage.setItem('thiepn:fsrs:sentinel','fsrs-safe');
 },olderKeys);
 const old=await page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),olderKeys);
 await expect(page.getByRole('heading',{name:'Small っ and Japanese rhythm'})).toBeVisible();
 await expect(page.getByText(/no approved pronunciation audio is available/i)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 15'}).click();
 if(process.env.CI){
  mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});
  await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit15-start.png'});
 }
 for(let i=0;i<24;i++){
  if(i===18){
   await expect(page.getByRole('heading',{name:'Rhythm checkpoint'})).toBeVisible();
   await expect(page.getByText('18 / 18')).toBeVisible();
   await page.reload();
   await expect(page.getByRole('heading',{name:'Rhythm checkpoint'})).toBeVisible();
   await page.getByRole('button',{name:'Continue to long-vowel review'}).click();
  }
  await correct(page,S.TASKS[i]);
 }
 await expect(page.getByRole('heading',{name:'Sokuon & Rhythm completed'})).toBeVisible();
 const saved=await page.evaluate(async keys=>({
  old:Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),
  s:JSON.parse(localStorage.getItem('thiepn:kana-foundations:sokuon-rhythm:prototype-only:v1')),
  account:localStorage.getItem('thiepn:account:sentinel'),
  fsrs:localStorage.getItem('thiepn:fsrs:sentinel'),
  databases:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(x=>x.name):[]
 }),olderKeys);
 expect(saved.old).toEqual(old);
 expect(saved.account).toBe('account-safe');
 expect(saved.fsrs).toBe('fsrs-safe');
 expect(saved.databases).toEqual([]);
 expect(saved.s.finished).toBe(true);
 expect(saved.s.checkpointPassed).toBe(true);
 expect(saved.s.records).toHaveLength(24);
 expect(saved.s.records.every(r=>r.correct===true&&!r.assisted&&!r.correction)).toBe(true);
 expect(saved.s.records.find(r=>r.taskId==='word-zasshi').submitted).toBe('zasshi');
 expect(saved.s.records.find(r=>r.taskId==='vowel-read-gakkou').submitted).toBe('gakkou');
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit15-finished.png'});
 await page.reload();
 await expect(page.getByRole('heading',{name:'Sokuon & Rhythm completed'})).toBeVisible();
});
test('wrong つ, revealed reading and omitted doubled consonant create immutable corrections',async({page})=>{
 await start(page);
 for(let i=0;i<24;i++){
  if(i===18)await page.getByRole('button',{name:'Continue to long-vowel review'}).click();
  if(i===0){
   await page.getByRole('button',{name:'Option つ (full tsu)'}).click();
   await expect(page.getByText('Not quite.')).toBeVisible();
   await page.getByRole('button',{name:'Continue'}).click();
  }else if(i===8){
   await page.getByRole('button',{name:'Show answer (no credit)'}).click();
   await expect(page.getByText(/Answer revealed/)).toBeVisible();
   await page.getByRole('button',{name:'Continue'}).click();
  }else if(i===15){
   await page.getByRole('button',{name:'Option kipu',exact:true}).click();
   await expect(page.getByText('Not quite.')).toBeVisible();
   await page.getByRole('button',{name:'Continue'}).click();
  }else await correct(page,S.TASKS[i]);
 }
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await page.reload();
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 for(const id of ['form-small-tsu','word-sakka','spelling-kippu']){
  const task=S.TASKS.find(t=>t.id===id);
  await correct(page,{...task,correction:true});
 }
 await expect(page.getByRole('heading',{name:'Sokuon & Rhythm completed'})).toBeVisible();
 const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(saved.corrections).toEqual(['form-small-tsu','word-sakka','spelling-kippu']);
 expect(saved.records).toHaveLength(27);
 expect(saved.records[0]).toMatchObject({submitted:'つ',correct:false,correction:false});
 expect(saved.records[8]).toMatchObject({submitted:'',correct:null,assisted:true,correction:false});
 expect(saved.records[15]).toMatchObject({submitted:'kipu',correct:false,correction:false});
 expect(saved.records.slice(-3).every(r=>r.correct===true&&r.correction)).toBe(true);
});
test('checkpoint cannot be bypassed, and Exit / reload / resume preserves the original records',async({page})=>{
 await start(page);
 for(let i=0;i<18;i++)await correct(page,S.TASKS[i]);
 await expect(page.getByRole('heading',{name:'Rhythm checkpoint'})).toBeVisible();
 const first=await page.evaluate(key=>localStorage.getItem(key),KEY);
 await page.getByRole('button',{name:'Exit and resume later'}).click();
 await expect(page.getByRole('heading',{name:'Small っ and Japanese rhythm'})).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:'Resume Unit 15'}).click();
 await expect(page.getByRole('heading',{name:'Rhythm checkpoint'})).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe(first);
 await page.getByRole('button',{name:'Continue to long-vowel review'}).click();
 await expect(page.getByRole('heading',{name:'Long-vowel meaning'})).toBeVisible();
 const s=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(s.index).toBe(18);
 expect(s.checkpointPassed).toBe(true);
 expect(s.records).toHaveLength(18);
});
test('completed Unit 14 links to Unit 15 without changing Unit 14 evidence',async({page})=>{
 await page.goto('/dakuten-bp.html');
 await page.evaluate(async()=>{
  const bp=await import('./dakuten-bp-engine.mjs');
  let s=bp.resume(bp.initialState());
  for(let i=0;i<bp.TASKS.length;i++){
   if(i===bp.CHECKPOINT_INDEX)s=bp.acknowledgeCheckpoint(s);
   const t=bp.TASKS[i];
   if(t.mode==='introduction')s=bp.beginRecall(s);
   s=bp.advance(bp.answer(s,t.answer));
  }
  if(!s.finished)throw Error('Unit 14 fixture is not finished');
  localStorage.setItem(bp.STORAGE_KEY,JSON.stringify(s));
 });
 await page.reload();
 await expect(page.getByRole('heading',{name:'B/P-row practice completed'})).toBeVisible();
 await expect(page.getByRole('link',{name:'Continue to Unit 15 · Sokuon & Rhythm'})).toBeVisible();
 const old=await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:dakuten-bp:prototype-only:v1'));
 await page.getByRole('link',{name:'Continue to Unit 15 · Sokuon & Rhythm'}).click();
 await expect(page.getByRole('heading',{name:'Small っ and Japanese rhythm'})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:dakuten-bp:prototype-only:v1'))).toBe(old);
 await page.getByRole('link',{name:'Back to Unit 14'}).click();
 await expect(page.getByRole('heading',{name:'B/P-row practice completed'})).toBeVisible();
});
test('invalid or concurrently modified Unit 15 storage remains untouched',async({page})=>{
 await page.goto('/sokuon-rhythm.html');
 const invalid='{"schema":500,"keep":"original-evidence"}';
 await page.evaluate(([key,raw])=>localStorage.setItem(key,raw),[KEY,invalid]);
 await page.reload();
 await expect(page.getByText(/progress is invalid or unavailable/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 15'}).click();
 await correct(page,S.TASKS[0]);
 expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe(invalid);
 await page.evaluate(key=>localStorage.removeItem(key),KEY);
 await page.reload();
 await page.getByRole('button',{name:'Start Unit 15'}).click();
 const foreign='{"schema":2,"changedBy":"another tab"}';
 await page.evaluate(([key,raw])=>localStorage.setItem(key,raw),[KEY,foreign]);
 await page.getByRole('button',{name:'Option っ (small tsu)'}).click();
 await expect(page.getByText(/Another tab changed Unit 15/)).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe(foreign);
});
test('320px keyboard, choices, mobile no-overflow and persistence after pause/reload',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await start(page);
 await page.getByRole('button',{name:'Option っ (small tsu)'}).focus();
 await page.keyboard.press('Enter');
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:'Continue'}).click();
 await expect(page.getByText(/How many morae does きって/)).toBeVisible();
 await page.getByRole('button',{name:'Exit lesson; progress is saved'}).click();
 await page.reload();
 await page.getByRole('button',{name:'Resume Unit 15'}).click();
 await expect(page.getByText(/How many morae does きって/)).toBeVisible();
 const state=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(state.index).toBe(1);
 expect(state.records[0]).toMatchObject({submitted:'っ',correct:true,correction:false});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
