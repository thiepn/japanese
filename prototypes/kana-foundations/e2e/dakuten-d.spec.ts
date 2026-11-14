import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import * as D from '../dakuten-d-engine.mjs';

const KEY=D.STORAGE_KEY;
const priorKeys=[
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
 'thiepn:kana-foundations:dakuten-gz:prototype-only:v1'
];
async function start(page){
 await page.goto('/dakuten-d.html');
 await page.getByRole('button',{name:'Start Unit 13'}).click();
}
async function correct(page,t,value=t.answer){
 if(t.mode==='introduction'&&!t.correction)
  await page.getByRole('button',{name:'Try recalling '+t.kana}).click();
 if(t.choices){
  const prefix=t.mode==='spelling'?'Spelling ':t.mode==='contrast'?'Character ':t.mode==='recognition'?'Reading ':'Meaning ';
  const choice=t.choices.find(c=>c.value===value);
  await page.getByRole('button',{name:prefix+choice.label,exact:true}).click();
 }else{
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(value);
  await page.getByRole('button',{name:'Check answer'}).click();
 }
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:'Continue'}).click();
}
test('Unit 13 completes exactly 23 prompts; old units, Account, FSRS and IDB remain unchanged',async({page},info)=>{
 await page.goto('/dakuten-d.html');
 await page.evaluate(keys=>{
  keys.forEach((key,i)=>localStorage.setItem(key,'previous-unit-'+i));
  localStorage.setItem('thiepn:account:sentinel','account-safe');
  localStorage.setItem('thiepn:fsrs:sentinel','fsrs-safe');
 },priorKeys);
 const old=await page.evaluate(keys=>Object.fromEntries(keys.map(x=>[x,localStorage.getItem(x)])),priorKeys);
 await expect(page.getByRole('heading',{name:'Voiced D-row'})).toBeVisible();
 await expect(page.getByText(/not spoken romaji answers/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 13'}).click();
 if(process.env.CI){
  mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});
  await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit13-first.png'});
 }
 for(const t of D.TASKS)await correct(page,t);
 await expect(page.getByRole('heading',{name:'D-row practice completed'})).toBeVisible();
 const saved=await page.evaluate(async keys=>({
  older:Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),
  state:JSON.parse(localStorage.getItem('thiepn:kana-foundations:dakuten-d:prototype-only:v1')),
  account:localStorage.getItem('thiepn:account:sentinel'),
  fsrs:localStorage.getItem('thiepn:fsrs:sentinel'),
  databases:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(db=>db.name):[]
 }),priorKeys);
 expect(saved.older).toEqual(old);
 expect(saved.account).toBe('account-safe');
 expect(saved.fsrs).toBe('fsrs-safe');
 expect(saved.databases).toEqual([]);
 expect(saved.state.finished).toBe(true);
 expect(saved.state.records).toHaveLength(23);
 expect(saved.state.records.every(x=>x.correct===true&&!x.assisted&&!x.correction)).toBe(true);
 expect(saved.state.records.find(x=>x.taskId==='word-chijimu').submitted).toBe('chijimu');
 expect(saved.state.records.find(x=>x.taskId==='word-tsuzuku').submitted).toBe('tsuzuku');
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit13-results.png'});
 await page.reload();
 await expect(page.getByRole('heading',{name:'D-row practice completed'})).toBeVisible();
});
test('Unit 13 preserves wrong, revealed and misspelled first answers after correction and reload',async({page})=>{
 await start(page);
 for(let i=0;i<23;i++){
  const t=D.TASKS[i];
  if(i===1){
   await page.getByRole('button',{name:'Try recalling ぢ'}).click();
   await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('di');
   await page.getByRole('button',{name:'Check answer'}).click();
   await expect(page.getByText('Not quite.')).toBeVisible();
   await page.getByRole('button',{name:'Continue'}).click();
  }else if(i===12){
   await page.getByRole('button',{name:'Show answer (no credit)'}).click();
   await expect(page.getByText(/Answer revealed/)).toBeVisible();
   await page.getByRole('button',{name:'Continue'}).click();
  }else if(i===15){
   await page.getByRole('button',{name:'Spelling ちじむ'}).click();
   await expect(page.getByText('Not quite.')).toBeVisible();
   await page.getByRole('button',{name:'Continue'}).click();
  }else await correct(page,t);
 }
 await expect(page.getByText(/Correction practice · original first attempt retained/)).toBeVisible();
 await page.reload();
 await expect(page.getByText(/Correction practice · original first attempt retained/)).toBeVisible();
 for(const id of ['intro-di','word-tsuzuku','spelling-chijimu']){
  const t=D.TASKS.find(x=>x.id===id);
  await correct(page,{...t,correction:true});
 }
 await expect(page.getByRole('heading',{name:'D-row practice completed'})).toBeVisible();
 const s=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(s.records).toHaveLength(26);
 expect(s.corrections).toEqual(['intro-di','word-tsuzuku','spelling-chijimu']);
 expect(s.records[1]).toMatchObject({submitted:'di',correct:false,correction:false});
 expect(s.records[12]).toMatchObject({submitted:'',correct:null,assisted:true,correction:false});
 expect(s.records[15]).toMatchObject({submitted:'ちじむ',correct:false,correction:false});
 expect(s.records.slice(-3).every(x=>x.correct===true&&x.correction)).toBe(true);
});
test('Unit 13 invalid evidence and other-tab conflicts are never overwritten',async({page})=>{
 await page.goto('/dakuten-d.html');
 const corrupt='{"schema":99,"keep":"saved"}';
 await page.evaluate(([key,value])=>localStorage.setItem(key,value),[KEY,corrupt]);
 await page.reload();
 await expect(page.getByText(/progress is invalid or unavailable/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 13'}).click();
 await correct(page,D.TASKS[0]);
 expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe(corrupt);
 await page.evaluate(key=>localStorage.removeItem(key),KEY);
 await page.reload();
 await page.getByRole('button',{name:'Start Unit 13'}).click();
 const concurrent='{"schema":11,"otherTab":"wins"}';
 await page.evaluate(([key,value])=>localStorage.setItem(key,value),[KEY,concurrent]);
 await page.getByRole('button',{name:'Try recalling だ'}).click();
 await expect(page.getByText(/Another tab changed Unit 13/)).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe(concurrent);
});
test('Unit 12 completed lesson links to Unit 13 without modifying saved Unit 12 evidence',async({page})=>{
 await page.goto('/dakuten-gz.html');
 await page.evaluate(async()=>{
  const gz=await import('./dakuten-gz-engine.mjs');
  let s=gz.resume(gz.initialState());
  for(const t of gz.TASKS){
   if(s.index===gz.CHECKPOINT_INDEX)s=gz.acknowledgeCheckpoint(s);
   if(t.mode==='introduction')s=gz.beginRecall(s);
   s=gz.advance(gz.answer(s,t.answer));
  }
  if(!s.finished)throw Error('Failed to prepare authentic Unit 12 completion');
  localStorage.setItem(gz.STORAGE_KEY,JSON.stringify(s));
 });
 await page.reload();
 await expect(page.getByRole('heading',{name:'Voiced hiragana practice completed'})).toBeVisible();
 await expect(page.getByRole('link',{name:'Continue to Unit 13 · D-row'})).toBeVisible();
 const old=await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:dakuten-gz:prototype-only:v1'));
 await page.getByRole('link',{name:'Continue to Unit 13 · D-row'}).click();
 await expect(page.getByRole('heading',{name:'Voiced D-row'})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:dakuten-gz:prototype-only:v1'))).toBe(old);
 await page.getByRole('link',{name:'Back to Unit 12'}).click();
 await expect(page.getByRole('heading',{name:'Voiced hiragana practice completed'})).toBeVisible();
});
test('Unit 13 is usable by keyboard at 320px with no overflow and preserved resume',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await start(page);
 await page.getByRole('button',{name:'Try recalling だ'}).click();
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('da');
 await page.getByRole('textbox',{name:'Type the romaji reading'}).press('Enter');
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:'Continue'}).click();
 await page.getByRole('button',{name:'Exit lesson; progress is saved',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Voiced D-row'})).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:'Resume Unit 13'}).click();
 await expect(page.getByRole('heading',{name:'Meet ぢ'})).toBeVisible();
 const state=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(state.index).toBe(1);
 expect(state.records[0]).toMatchObject({submitted:'da',correct:true,correction:false});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
