import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import * as BP from '../dakuten-bp-engine.mjs';

const KEY=BP.STORAGE_KEY;
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
 'thiepn:kana-foundations:dakuten-gz:prototype-only:v1',
 'thiepn:kana-foundations:dakuten-d:prototype-only:v1'
];
async function start(page){
 await page.goto('/dakuten-bp.html');
 await page.getByRole('button',{name:'Start Unit 14'}).click();
}
async function correct(page,t,value=t.answer){
 if(t.mode==='introduction'&&!t.correction)
  await page.getByRole('button',{name:'Try recalling '+t.kana}).click();
 if(t.choices){
  const option=t.choices.find(c=>c.value===value);
  expect(option).toBeTruthy();
  await page.getByRole('button',{name:(t.mode==='contrast'?'Character ':'Reading ')+option.label,exact:true}).click();
 }else{
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(value);
  await page.getByRole('button',{name:'Check answer'}).click();
 }
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:/^Continue/}).click();
}
test('Unit 14 all 36 prompts and authentic words complete in all six browsers without touching older data',async({page},info)=>{
 await page.goto('/dakuten-bp.html');
 await page.evaluate(keys=>{
  keys.forEach((key,i)=>localStorage.setItem(key,'older-unit-sentinel-'+i));
  localStorage.setItem('thiepn:account:sentinel','account-preserved');
  localStorage.setItem('thiepn:fsrs:sentinel','fsrs-preserved');
 },priorKeys);
 const old=await page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),priorKeys);
 await expect(page.getByRole('heading',{name:'Learn the B-row and P-row'})).toBeVisible();
 await expect(page.getByText(/P is voiceless|voiceless P sound/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 14'}).click();
 if(process.env.CI){
  mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});
  await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit14-first.png'});
 }
 for(let i=0;i<36;i++){
  if(i===17){
   await expect(page.getByRole('heading',{name:'B-row checkpoint'})).toBeVisible();
   await expect(page.getByText('17 / 17')).toBeVisible();
   await page.reload();
   await expect(page.getByRole('heading',{name:'B-row checkpoint'})).toBeVisible();
   await page.getByRole('button',{name:'Continue to Stage B · P-row'}).click();
  }
  await correct(page,BP.TASKS[i]);
 }
 await expect(page.getByRole('heading',{name:'B/P-row practice completed'})).toBeVisible();
 const saved=await page.evaluate(async keys=>({
  older:Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),
  s:JSON.parse(localStorage.getItem('thiepn:kana-foundations:dakuten-bp:prototype-only:v1')),
  account:localStorage.getItem('thiepn:account:sentinel'),
  fsrs:localStorage.getItem('thiepn:fsrs:sentinel'),
  dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(db=>db.name):[]
 }),priorKeys);
 expect(saved.older).toEqual(old);
 expect(saved.account).toBe('account-preserved');
 expect(saved.fsrs).toBe('fsrs-preserved');
 expect(saved.dbs).toEqual([]);
 expect(saved.s.finished).toBe(true);
 expect(saved.s.checkpointPassed).toBe(true);
 expect(saved.s.records).toHaveLength(36);
 expect(saved.s.records.every(x=>x.correct===true&&!x.assisted&&!x.correction)).toBe(true);
 expect(saved.s.records.find(x=>x.taskId==='word-enpitsu').submitted).toBe('enpitsu');
 expect(saved.s.records.find(x=>x.taskId==='phrase-where-hat').submitted).toBe('boushiwadokodesuka');
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit14-complete.png'});
 await page.reload();
 await expect(page.getByRole('heading',{name:'B/P-row practice completed'})).toBeVisible();
});
test('Unit 14 wrong, revealed and three-way contrast mistakes create separate persistent corrections',async({page})=>{
 await start(page);
 for(let i=0;i<36;i++){
  if(i===17)await page.getByRole('button',{name:'Continue to Stage B · P-row'}).click();
  const t=BP.TASKS[i];
  if(i===0){
   await page.getByRole('button',{name:'Try recalling ば'}).click();
   await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('ha');
   await page.getByRole('button',{name:'Check answer'}).click();
   await expect(page.getByText('Not quite.')).toBeVisible();
   await page.getByRole('button',{name:'Continue'}).click();
  }else if(i===12){
   await page.getByRole('button',{name:'Show answer (no credit)'}).click();
   await expect(page.getByText(/Answer revealed/)).toBeVisible();
   await page.getByRole('button',{name:'Continue'}).click();
  }else if(i===32){
   await page.getByRole('button',{name:'Character ば'}).click();
   await expect(page.getByText('Not quite.')).toBeVisible();
   await page.getByRole('button',{name:'Continue'}).click();
  }else await correct(page,t);
 }
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await page.reload();
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 for(const id of ['intro-ba','word-buta','contrast-pa-ha-ba']){
  const t=BP.TASKS.find(x=>x.id===id);
  await correct(page,{...t,correction:true});
 }
 await expect(page.getByRole('heading',{name:'B/P-row practice completed'})).toBeVisible();
 const s=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(s.records).toHaveLength(39);
 expect(s.corrections).toEqual(['intro-ba','word-buta','contrast-pa-ha-ba']);
 expect(s.records[0]).toMatchObject({submitted:'ha',correct:false,correction:false});
 expect(s.records[12]).toMatchObject({submitted:'',correct:null,assisted:true,correction:false});
 expect(s.records[32]).toMatchObject({submitted:'ば',correct:false,correction:false});
 expect(s.records.slice(-3).every(x=>x.correction&&x.correct===true)).toBe(true);
});
test('Unit 14 checkpoint cannot be skipped and preserves evidence after Exit and reload',async({page})=>{
 await start(page);
 for(let i=0;i<17;i++)await correct(page,BP.TASKS[i]);
 await expect(page.getByRole('heading',{name:'B-row checkpoint'})).toBeVisible();
 const before=await page.evaluate(key=>localStorage.getItem(key),KEY);
 await page.getByRole('button',{name:'Exit and resume later'}).click();
 await expect(page.getByRole('heading',{name:'Learn the B-row and P-row'})).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:'Resume Unit 14'}).click();
 await expect(page.getByRole('heading',{name:'B-row checkpoint'})).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe(before);
 await page.getByRole('button',{name:'Continue to Stage B · P-row'}).click();
 await expect(page.getByRole('heading',{name:'Meet ぱ'})).toBeVisible();
 const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(saved.checkpointPassed).toBe(true);
 expect(saved.index).toBe(17);
 expect(saved.records).toHaveLength(17);
});
test('Unit 13 completed lesson links to Unit 14 without mutating prior evidence',async({page})=>{
 await page.goto('/dakuten-d.html');
 await page.evaluate(async()=>{
  const d=await import('./dakuten-d-engine.mjs');
  let s=d.resume(d.initialState());
  for(const t of d.TASKS){
   if(t.mode==='introduction')s=d.beginRecall(s);
   s=d.advance(d.answer(s,t.answer));
  }
  if(!s.finished)throw Error('Unit 13 fixture did not finish');
  localStorage.setItem(d.STORAGE_KEY,JSON.stringify(s));
 });
 await page.reload();
 await expect(page.getByRole('heading',{name:'D-row practice completed'})).toBeVisible();
 await expect(page.getByRole('link',{name:'Continue to Unit 14 · B/P rows'})).toBeVisible();
 const before=await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:dakuten-d:prototype-only:v1'));
 await page.getByRole('link',{name:'Continue to Unit 14 · B/P rows'}).click();
 await expect(page.getByRole('heading',{name:'Learn the B-row and P-row'})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:dakuten-d:prototype-only:v1'))).toBe(before);
 await page.getByRole('link',{name:'Back to Unit 13'}).click();
 await expect(page.getByRole('heading',{name:'D-row practice completed'})).toBeVisible();
});
test('invalid storage and concurrent-tab changes are never overwritten by Unit 14',async({page})=>{
 await page.goto('/dakuten-bp.html');
 const invalid='{"schema":99,"keep":"progress"}';
 await page.evaluate(([key,raw])=>localStorage.setItem(key,raw),[KEY,invalid]);
 await page.reload();
 await expect(page.getByText(/progress is invalid or unavailable/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 14'}).click();
 await correct(page,BP.TASKS[0]);
 expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe(invalid);
 await page.evaluate(key=>localStorage.removeItem(key),KEY);
 await page.reload();
 await page.getByRole('button',{name:'Start Unit 14'}).click();
 const foreign='{"schema":2,"changedBy":"other tab"}';
 await page.evaluate(([key,raw])=>localStorage.setItem(key,raw),[KEY,foreign]);
 await page.getByRole('button',{name:'Try recalling ば'}).click();
 await expect(page.getByText(/Another tab changed Unit 14/)).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe(foreign);
});
test('at 320px, keyboard Enter, mobile layout, pause and resume work with no horizontal scroll',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await start(page);
 await page.getByRole('button',{name:'Try recalling ば'}).click();
 const input=page.getByRole('textbox',{name:'Type the romaji reading'});
 await input.fill('ba');
 await input.press('Enter');
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:'Continue'}).click();
 await page.getByRole('button',{name:'Exit lesson; progress is saved',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Learn the B-row and P-row'})).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:'Resume Unit 14'}).click();
 await expect(page.getByRole('heading',{name:'Meet び'})).toBeVisible();
 const s=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(s.index).toBe(1);
 expect(s.records[0]).toMatchObject({submitted:'ba',correct:true,correction:false});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
