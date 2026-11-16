import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import * as D from '../dakuten-gz-engine.mjs';

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
 'thiepn:kana-foundations:reading-review:prototype-only:v1'
];
async function respond(page,t,value=t.answer){
 if(t.mode==='introduction')
  await page.getByRole('button',{name:'Try recalling '+t.kana}).click();
 if(t.choices){
  await page.getByRole('button',{name:(t.mode==='contrast'?'Character ':'Reading ')+value,exact:true}).click();
 }else{
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(value);
  await page.getByRole('button',{name:'Check answer'}).click();
 }
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:/^Continue/}).click();
}
async function start(page){await page.goto('/dakuten-gz.html');await page.getByRole('button',{name:'Start Unit 12'}).click();}
test('Unit 12 completes 17 + checkpoint + 17 + 2 with authentic words and isolated saved evidence',async({page},info)=>{
 await page.goto('/dakuten-gz.html');
 await page.evaluate(async()=>{
  const vowels=await import('./engine.mjs');
  const rowEngines=await Promise.all(['k','s','t','n','h','m','y','r','w'].map(row=>import('./'+row+'-row-engine.mjs')));
  const review=await import('./reading-review-engine.mjs');
  localStorage.setItem(vowels.PROTOTYPE_STORAGE_KEY,JSON.stringify(vowels.initialState()));
  for(const engine of rowEngines)localStorage.setItem(engine.STORAGE_KEY,JSON.stringify(engine.initialState()));
  localStorage.setItem(review.STORAGE_KEY,JSON.stringify(review.initialState()));
  localStorage.setItem('thiepn:account:sentinel','account-original');
  localStorage.setItem('thiepn:fsrs:sentinel','fsrs-original');
 });
 const prior=await page.evaluate(keys=>Object.fromEntries(keys.map(x=>[x,localStorage.getItem(x)])),priorKeys);
 await expect(page.getByRole('heading',{name:'Add the dakuten marks'})).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 12'}).click();
 if(process.env.CI){
  mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});
  await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit12-intro.png'});
 }
 for(let i=0;i<17;i++){
  const t=D.TASKS[i];
  await respond(page,t);
 }
 await expect(page.getByRole('heading',{name:'G-row checkpoint'})).toBeVisible();
 await expect(page.getByText('17 / 17')).toBeVisible();
 await page.reload();
 await expect(page.getByRole('heading',{name:'G-row checkpoint'})).toBeVisible();
 await page.getByRole('button',{name:'Continue to Stage B · Z-row'}).click();
 for(let i=17;i<36;i++){
  const t=D.TASKS[i];
  const value=t.id==='intro-ji'?'zi':t.id==='word-jikan'?'zi kan':t.id==='phrase-kagi-sagasu'?'kagi wo sagasu':t.answer;
  await respond(page,t,value);
 }
 await expect(page.getByRole('heading',{name:'Voiced hiragana practice completed'})).toBeVisible();
 await expect(page.getByText('10 / 10').first()).toBeVisible();
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit12-complete.png'});
 const saved=await page.evaluate(async keys=>({
  older:Object.fromEntries(keys.map(x=>[x,localStorage.getItem(x)])),
  s:JSON.parse(localStorage.getItem('thiepn:kana-foundations:dakuten-gz:prototype-only:v1')),
  account:localStorage.getItem('thiepn:account:sentinel'),
  fsrs:localStorage.getItem('thiepn:fsrs:sentinel'),
  dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(db=>db.name):[]
 }),priorKeys);
 expect(saved.older).toEqual(prior);
 expect(saved.account).toBe('account-original');
 expect(saved.fsrs).toBe('fsrs-original');
 expect(saved.dbs).toEqual([]);
 expect(saved.s.finished).toBe(true);
 expect(saved.s.checkpointPassed).toBe(true);
 expect(saved.s.records).toHaveLength(36);
 expect(saved.s.records.every(r=>r.correct===true&&!r.assisted&&!r.correction)).toBe(true);
 expect(saved.s.records.find(r=>r.taskId==='intro-ji').submitted).toBe('zi');
 expect(saved.s.records.find(r=>r.taskId==='word-jikan').submitted).toBe('zikan');
 expect(saved.s.records.find(r=>r.taskId==='phrase-kagi-sagasu').submitted).toBe('kagiwosagasu');
 await page.reload();
 await expect(page.getByRole('heading',{name:'Voiced hiragana practice completed'})).toBeVisible();
});
test('Unit 12 separates wrong and revealed first attempts from correction responses',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await start(page);
 for(let i=0;i<36;i++){
  if(i===17){
   await expect(page.getByRole('heading',{name:'G-row checkpoint'})).toBeVisible();
   await page.getByRole('button',{name:'Continue to Stage B · Z-row'}).click();
  }
  const t=D.TASKS[i];
  if(i===0){
   await page.getByRole('button',{name:'Try recalling が'}).click();
   await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('ka');
   await page.getByRole('button',{name:'Check answer'}).click();
   await expect(page.getByText('Not quite.')).toBeVisible();
   await page.getByRole('button',{name:'Continue'}).click();
  }else if(i===12){
   await page.getByRole('button',{name:'Show answer (no credit)'}).click();
   await expect(page.getByText(/Answer revealed/)).toBeVisible();
   await page.getByRole('button',{name:'Continue'}).click();
  }else if(i===33){
   await page.getByRole('button',{name:'Character す'}).click();
   await expect(page.getByText('Not quite.')).toBeVisible();
   await page.getByRole('button',{name:'Continue'}).click();
  }else await respond(page,t);
 }
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await page.reload();
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await respond(page,{mode:'word',answer:'ga'},'ga');
 await respond(page,{mode:'word',answer:'kagu'},'kagu');
 await page.getByRole('button',{name:'Character ず'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:'Continue'}).click();
 await expect(page.getByRole('heading',{name:'Voiced hiragana practice completed'})).toBeVisible();
 const s=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(s.records).toHaveLength(39);
 expect(s.corrections).toEqual(['intro-ga','word-kagu','contrast-zu-su']);
 expect(s.records[0].submitted).toBe('ka');
 expect(s.records[0].correct).toBe(false);
 expect(s.records[12].correct).toBeNull();
 expect(s.records[12].assisted).toBe(true);
 expect(s.records[33].submitted).toBe('す');
 expect(s.records[33].correct).toBe(false);
 expect(s.records.slice(-3).map(x=>x.taskId)).toEqual(s.corrections);
 expect(s.records.slice(-3).every(x=>x.correction&&x.correct===true)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
test('G-row checkpoint cannot be skipped; Exit, resume and Stage B keep evidence',async({page})=>{
 await start(page);
 for(let i=0;i<17;i++)await respond(page,D.TASKS[i]);
 await expect(page.getByRole('heading',{name:'G-row checkpoint'})).toBeVisible();
 const before=await page.evaluate(key=>localStorage.getItem(key),KEY);
 await page.getByRole('button',{name:'Exit and resume later'}).click();
 await expect(page.getByRole('heading',{name:'Add the dakuten marks'})).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:'Resume Unit 12'}).click();
 await expect(page.getByRole('heading',{name:'G-row checkpoint'})).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe(before); // no evidence or checkpoint state changed during Exit → Resume
 await page.getByRole('button',{name:'Continue to Stage B · Z-row'}).click();
 await expect(page.getByRole('heading',{name:'Meet ざ'})).toBeVisible();
 const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(saved.checkpointPassed).toBe(true);
 expect(saved.index).toBe(17);
 expect(saved.records).toHaveLength(17);
});
test('completed Unit 11 offers Unit 12 without changing original Unit 11 records',async({page})=>{
 await page.goto('/reading-review.html');
 await page.evaluate(async()=>{
  const r=await import('./reading-review-engine.mjs');
  let s=r.resume(r.initialState());
  for(const t of r.TASKS)s=r.advance(r.answer(s,t.answer));
  localStorage.setItem(r.STORAGE_KEY,JSON.stringify(s));
 });
 await page.reload();
 await expect(page.getByRole('heading',{name:'Reading review completed'})).toBeVisible();
 await expect(page.getByRole('link',{name:'Continue to Unit 12 · Dakuten G/Z'})).toBeVisible();
 const before=await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:reading-review:prototype-only:v1'));
 await page.getByRole('link',{name:'Continue to Unit 12 · Dakuten G/Z'}).click();
 await expect(page.getByRole('heading',{name:'Add the dakuten marks'})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:reading-review:prototype-only:v1'))).toBe(before);
 await page.getByRole('link',{name:'Back to Unit 11'}).click();
 await expect(page.getByRole('heading',{name:'Reading review completed'})).toBeVisible();
});
test('malformed or concurrently changed Unit 12 state is never overwritten',async({page})=>{
 await page.goto('/dakuten-gz.html');
 const corrupt='{"schema":7,"preserve":"evidence"}';
 await page.evaluate(([key,raw])=>localStorage.setItem(key,raw),[KEY,corrupt]);
 await page.reload();
 await expect(page.getByText(/progress is invalid or unavailable/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 12'}).click();
 await respond(page,D.TASKS[0]);
 expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe(corrupt);
 await page.evaluate(key=>localStorage.removeItem(key),KEY);
 await page.reload();
 await page.getByRole('button',{name:'Start Unit 12'}).click();
 const foreign='{"schema":2,"changedBy":"other tab"}';
 await page.evaluate(([key,raw])=>localStorage.setItem(key,raw),[KEY,foreign]);
 await page.getByRole('button',{name:'Try recalling が'}).click();
 await expect(page.getByText(/Another tab changed Unit 12/)).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe(foreign);
});
