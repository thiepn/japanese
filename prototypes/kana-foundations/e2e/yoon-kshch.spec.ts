import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import * as Y from '../yoon-kshch-engine.mjs';

const KEY=Y.STORAGE_KEY;
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
 'thiepn:kana-foundations:dakuten-bp:prototype-only:v1',
 'thiepn:kana-foundations:sokuon-rhythm:prototype-only:v1'
];
async function start(page){
 await page.goto('/yoon-kshch.html');
 await page.getByRole('button',{name:'Start Unit 16'}).click();
}
async function respond(page,t,value=t.answer){
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
test('Unit 16 all 33 prompts, genuine words, checkpoint and six-browser persistence preserve earlier units',async({page},info)=>{
 await page.goto('/yoon-kshch.html');
 await page.evaluate(keys=>{
  keys.forEach((key,i)=>localStorage.setItem(key,'unit-'+i+'-sentinel'));
  localStorage.setItem('thiepn:account:test','account-sentinel');
  localStorage.setItem('thiepn:fsrs:test','fsrs-sentinel');
 },olderKeys);
 await expect(page.getByRole('heading',{name:'Read small ゃ, ゅ and ょ'})).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 16'}).click();
 if(process.env.CI){
  mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});
  await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit16-first.png'});
 }
 for(let i=0;i<33;i++){
  if(i===20){
   await expect(page.getByRole('heading',{name:'Yōon checkpoint'})).toBeVisible();
   await expect(page.getByText('20 / 20')).toBeVisible();
   await page.reload();
   await expect(page.getByRole('heading',{name:'Yōon checkpoint'})).toBeVisible();
   await page.getByRole('button',{name:'Continue to Stage B · CH'}).click();
   if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit16-stageb.png'});
  }
  await respond(page,Y.TASKS[i]);
 }
 await expect(page.getByRole('heading',{name:'Yōon foundations completed'})).toBeVisible();
 const data=await page.evaluate(async keys=>({
  saved:JSON.parse(localStorage.getItem('thiepn:kana-foundations:yoon-kshch:prototype-only:v1')),
  old:Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),
  account:localStorage.getItem('thiepn:account:test'),
  fsrs:localStorage.getItem('thiepn:fsrs:test'),
  dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(d=>d.name):[]
 }),olderKeys);
 expect(data.saved.finished).toBe(true);
 expect(data.saved.index).toBe(33);
 expect(data.saved.records).toHaveLength(33);
 expect(data.saved.records.every(r=>r.correct===true&&!r.assisted&&!r.correction)).toBe(true);
 expect(data.saved.checkpointPassed).toBe(true);
 expect(data.saved.records.find(r=>r.taskId==='word-kyou').submitted).toBe('kyou');
 expect(data.saved.records.find(r=>r.taskId==='word-chotto').submitted).toBe('chotto');
 expect(data.saved.records.find(r=>r.taskId==='phrase-tea').submitted).toBe('kyouwaochaonomu');
 olderKeys.forEach((key,i)=>expect(data.old[key]).toBe('unit-'+i+'-sentinel'));
 expect(data.account).toBe('account-sentinel');
 expect(data.fsrs).toBe('fsrs-sentinel');
 expect(data.dbs).toEqual([]);
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit16-complete.png'});
 await page.reload();
 await expect(page.getByRole('heading',{name:'Yōon foundations completed'})).toBeVisible();
});
test('wrong reading, revealed long vowel and wrong CH mora count create immutable correction attempts',async({page})=>{
 await start(page);
 for(let i=0;i<33;i++){
  if(i===20)await page.getByRole('button',{name:'Continue to Stage B · CH'}).click();
  const t=Y.TASKS[i];
  if(i===0){
   await page.getByRole('button',{name:'Try recalling きゃ'}).click();
   await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('kiya');
   await page.getByRole('button',{name:'Check answer'}).click();
   await expect(page.getByText('Not quite.')).toBeVisible();
   await page.getByRole('button',{name:/^Continue/}).click();
  }else if(i===14){
   await page.getByRole('button',{name:'Show answer (no credit)'}).click();
   await expect(page.getByText(/Answer revealed/)).toBeVisible();
   await page.getByRole('button',{name:/^Continue/}).click();
  }else if(i===30){
   const wrong=t.choices.find(c=>c.value==='2');
   await page.getByRole('button',{name:'Character '+wrong.label,exact:true}).click();
   await expect(page.getByText('Not quite.')).toBeVisible();
   await page.getByRole('button',{name:/^Continue/}).click();
  }else await respond(page,t);
 }
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await page.reload();
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 for(const id of ['intro-kya','word-kyou','contrast-chotto-mora'])
  await respond(page,{...Y.TASKS.find(t=>t.id===id),correction:true});
 await expect(page.getByRole('heading',{name:'Yōon foundations completed'})).toBeVisible();
 const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(saved.corrections).toEqual(['intro-kya','word-kyou','contrast-chotto-mora']);
 expect(saved.records).toHaveLength(36);
 expect(saved.records[0]).toMatchObject({submitted:'kiya',correct:false,correction:false});
 expect(saved.records[14]).toMatchObject({submitted:'',correct:null,assisted:true,correction:false});
 expect(saved.records[30]).toMatchObject({submitted:'2',correct:false,correction:false});
 expect(saved.records.slice(-3).every(r=>r.correction&&r.correct===true)).toBe(true);
});
test('Stage A checkpoint cannot be skipped; exit, reload and resume preserve first records',async({page})=>{
 await start(page);
 for(let i=0;i<20;i++)await respond(page,Y.TASKS[i]);
 await expect(page.getByRole('heading',{name:'Yōon checkpoint'})).toBeVisible();
 const before=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 await page.getByRole('button',{name:'Exit and resume later'}).click();
 await expect(page.getByRole('heading',{name:'Read small ゃ, ゅ and ょ'})).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:'Resume Unit 16'}).click();
 await expect(page.getByRole('heading',{name:'Yōon checkpoint'})).toBeVisible();
 const after=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(after.records).toEqual(before.records);
 expect(after.checkpointPassed).toBe(false);
 expect(after.index).toBe(20);
 await page.getByRole('button',{name:'Continue to Stage B · CH'}).click();
 await expect(page.getByRole('heading',{name:'Meet ちゃ'})).toBeVisible();
 const continued=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(continued.checkpointPassed).toBe(true);
 expect(continued.records).toHaveLength(20);
});
test('Unit 15 completion links to Unit 16 without modifying existing Unit 15 evidence',async({page})=>{
 await page.goto('/sokuon-rhythm.html');
 await page.evaluate(async()=>{
  const m=await import('./sokuon-rhythm-engine.mjs');
  let s=m.resume(m.initialState());
  for(let i=0;i<m.TASKS.length;i++){
   if(i===m.CHECKPOINT_INDEX)s=m.acknowledgeCheckpoint(s);
   const t=m.taskAt(s);
   s=m.advance(m.answer(s,t.answer));
  }
  if(!s.finished)throw Error('Unit 15 fixture invalid');
  localStorage.setItem(m.STORAGE_KEY,JSON.stringify(s));
 });
 await page.reload();
 await expect(page.getByRole('heading',{name:'Sokuon & Rhythm completed'})).toBeVisible();
 const before=await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:sokuon-rhythm:prototype-only:v1'));
 await page.getByRole('link',{name:'Continue to Unit 16 · Yōon K/SH/CH'}).click();
 await expect(page.getByRole('heading',{name:'Read small ゃ, ゅ and ょ'})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:sokuon-rhythm:prototype-only:v1'))).toBe(before);
 await page.getByRole('link',{name:'Back to Unit 15'}).click();
 await expect(page.getByRole('heading',{name:'Sokuon & Rhythm completed'})).toBeVisible();
});
test('corrupted saves and concurrent-tab edits are protected from overwrite',async({page})=>{
 await page.goto('/yoon-kshch.html');
 const bad='{"schema":99,"preserve":"this"}';
 await page.evaluate(([key,value])=>localStorage.setItem(key,value),[KEY,bad]);
 await page.reload();
 await expect(page.getByText(/progress is invalid or unavailable/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 16'}).click();
 await respond(page,Y.TASKS[0]);
 expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe(bad);
 await page.evaluate(key=>localStorage.removeItem(key),KEY);
 await page.reload();
 await page.getByRole('button',{name:'Start Unit 16'}).click();
 const foreign='{"schema":123,"writer":"another-tab"}';
 await page.evaluate(([key,value])=>localStorage.setItem(key,value),[KEY,foreign]);
 await page.getByRole('button',{name:'Try recalling きゃ'}).click();
 await expect(page.getByText(/Another tab changed Unit 16/)).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe(foreign);
});
test('320px reduced-motion keyboard submission, skip link and pause/resume do not overflow',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/yoon-kshch.html');
 await expect(page.getByRole('link',{name:'Skip to lesson content'})).toBeAttached();
 await page.getByRole('button',{name:'Start Unit 16'}).click();
 await page.getByRole('button',{name:'Try recalling きゃ'}).click();
 const field=page.getByRole('textbox',{name:'Type the romaji reading'});
 await field.fill('KYA');await field.press('Enter');
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:/^Continue/}).click();
 await page.getByRole('button',{name:'Exit lesson; progress is saved',exact:true}).click();
 await page.reload();
 await page.getByRole('button',{name:'Resume Unit 16'}).click();
 await expect(page.getByRole('heading',{name:'Meet きゅ'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 const s=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(s.index).toBe(1);
 expect(s.records[0]).toMatchObject({submitted:'kya',correct:true,correction:false});
});
