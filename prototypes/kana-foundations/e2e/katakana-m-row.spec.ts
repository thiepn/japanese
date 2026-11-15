import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import * as U from '../katakana-m-row-engine.mjs';
import * as Prev from '../katakana-h-row-engine.mjs';
const KEY=U.STORAGE_KEY;
const OTHER=[Prev.STORAGE_KEY,'thiepn:kana-foundations:katakana-n-row:prototype-only:v1','thiepn:kana-foundations:katakana-t-row:prototype-only:v1','thiepn:kana-foundations:katakana-s-row:prototype-only:v1','thiepn:kana-foundations:katakana-k-row:prototype-only:v1','thiepn:kana-foundations:katakana-vowels:prototype-only:v1','thiepn:account:test','thiepn:fsrs:test'];
async function start(page){await page.goto('/katakana-m-row.html');await page.getByRole('button',{name:'Start Unit 26'}).click();}
async function respond(page,t,val=t.answer){
 if(t.mode==='introduction'&&!t.correction)await page.getByRole('button',{name:'Try recalling '+t.kana}).click();
 if(t.choices){const c=t.choices.find(x=>x.value===val);expect(c).toBeTruthy();await page.getByRole('button',{name:(t.mode==='contrast'?'Character ':'Reading ')+c.label,exact:true}).click();}
 else{await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(val);await page.getByRole('button',{name:'Check answer'}).click();}
 await expect(page.getByText('Correct.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();
}
test('complete Unit 26 31-prompt journey saves first records while leaving older unit and Account/FSRS data untouched',async({page},info)=>{
 await page.goto('/katakana-m-row.html');await page.evaluate(keys=>keys.forEach((k,i)=>localStorage.setItem(k,'preserve-'+i)),OTHER);
 await expect(page.getByRole('heading',{name:'Learn マ・ミ・ム・メ・モ'})).toBeVisible();await page.getByRole('button',{name:'Start Unit 26'}).click();
 if(process.env.CI){mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit26-start.png'});}
 for(let i=0;i<U.TASKS.length;i++){
  if(i===15){await expect(page.getByRole('heading',{name:'Katakana M-row checkpoint'})).toBeVisible();await expect(page.getByText('15 / 15')).toBeVisible();await page.reload();await expect(page.getByRole('heading',{name:'Katakana M-row checkpoint'})).toBeVisible();await page.getByRole('button',{name:'Continue to Stage B · Words'}).click();}
  await respond(page,U.TASKS[i]);
 }
 await expect(page.getByRole('heading',{name:'Katakana M-row completed'})).toBeVisible();
 const x=await page.evaluate(async keys=>({s:JSON.parse(localStorage.getItem('thiepn:kana-foundations:katakana-m-row:prototype-only:v1')),old:keys.map(k=>localStorage.getItem(k)),dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(d=>d.name):[]}),OTHER);
 expect(x.s.finished).toBe(true);expect(x.s.records).toHaveLength(31);expect(x.s.corrections).toHaveLength(0);
 expect(x.s.records.every(r=>r.correct===true&&!r.assisted&&!r.correction)).toBe(true);
 for(const w of U.WORDS)expect(x.s.records.find(r=>r.taskId==='word-'+w.id).submitted).toBe(w.reading);
 x.old.forEach((v,i)=>expect(v).toBe('preserve-'+i));expect(x.dbs).toEqual([]);
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit26-finished.png'});
 await page.reload();await expect(page.getByRole('heading',{name:'Katakana M-row completed'})).toBeVisible();
});
test('wrong initial, assisted ear and incorrect bug/bean answer preserve original records and separate corrections',async({page})=>{
 await start(page);
 for(let i=0;i<31;i++){
  if(i===15)await page.getByRole('button',{name:'Continue to Stage B · Words'}).click();
  const t=U.TASKS[i];
  if(i===0){await page.getByRole('button',{name:'Try recalling マ'}).click();await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('mi');await page.getByRole('button',{name:'Check answer'}).click();await expect(page.getByText('Not quite.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else if(i===11){await page.getByRole('button',{name:'Show answer (no credit)'}).click();await expect(page.getByText(/Answer revealed/)).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else if(i===30){await page.getByRole('button',{name:'Character マメ — bean',exact:true}).click();await expect(page.getByText('Not quite.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else await respond(page,t);
 }
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();await page.reload();
 for(const id of ['intro-ma','word-mimi','contrast-bug'])await respond(page,{...U.TASKS.find(t=>t.id===id),correction:true});
 await expect(page.getByRole('heading',{name:'Katakana M-row completed'})).toBeVisible();
 const s=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 expect(s.records).toHaveLength(34);expect(s.corrections).toEqual(['intro-ma','word-mimi','contrast-bug']);
 expect(s.records[0]).toMatchObject({submitted:'mi',correct:false,correction:false});
 expect(s.records[11]).toMatchObject({submitted:'',correct:null,assisted:true,correction:false});
 expect(s.records[30]).toMatchObject({submitted:'マメ',correct:false,correction:false});
 expect(s.records.slice(-3).every(r=>r.correction&&r.correct===true)).toBe(true);
});
test('Unit 25 completed progress links forward and backward without modifying prior bytes',async({page})=>{
 await page.goto('/katakana-h-row.html');
 await page.evaluate(async()=>{const M=await import('./katakana-h-row-engine.mjs');let s=M.resume(M.initialState());
  for(let i=0;i<M.TASKS.length;i++){if(i===M.CHECKPOINT_INDEX)s=M.acknowledgeCheckpoint(s);const t=M.taskAt(s);if(t.mode==='introduction')s=M.beginRecall(s);s=M.advance(M.answer(s,t.answer));}
  if(!s.finished)throw Error('Unit25 completion fixture failed');localStorage.setItem(M.STORAGE_KEY,JSON.stringify(s));});
 await page.reload();await expect(page.getByRole('heading',{name:'Katakana H-row completed'})).toBeVisible();
 const saved=await page.evaluate(k=>localStorage.getItem(k),Prev.STORAGE_KEY);
 await page.getByRole('link',{name:'Continue to Unit 26 · M-row'}).click();await expect(page.getByRole('heading',{name:'Learn マ・ミ・ム・メ・モ'})).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),Prev.STORAGE_KEY)).toBe(saved);
 await page.getByRole('link',{name:'Back to Unit 25'}).click();await expect(page.getByRole('heading',{name:'Katakana H-row completed'})).toBeVisible();
});
test('checkpoint cannot be bypassed and survives pause/reload with first records intact',async({page})=>{
 await start(page);for(let i=0;i<15;i++)await respond(page,U.TASKS[i]);
 await expect(page.getByRole('heading',{name:'Katakana M-row checkpoint'})).toBeVisible();
 const first=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 await page.getByRole('button',{name:'Exit and resume later'}).click();await page.reload();await page.getByRole('button',{name:'Resume Unit 26'}).click();
 await expect(page.getByRole('heading',{name:'Katakana M-row checkpoint'})).toBeVisible();
 const after=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 expect(after.records).toEqual(first.records);expect(after.checkpointPassed).toBe(false);
 await page.getByRole('button',{name:'Continue to Stage B · Words'}).click();
 await expect(page.getByRole('heading',{name:'Read the authentic word'})).toBeVisible();
});
test('valid shi/si and chi/ti variants are accepted but word meanings remain concealed before answer',async({page})=>{
 await start(page);for(let i=0;i<10;i++)await respond(page,U.TASKS[i]);
 await respond(page,U.TASKS[10]);await respond(page,U.TASKS[11]);
 await expect(page.getByRole('heading',{name:'Read the authentic word'})).toBeVisible();
 await expect(page.getByText(/Meaning: insect/)).toHaveCount(0);
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('MUSI');await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();await expect(page.getByText(/Meaning: insect/)).toBeVisible();
 await page.getByRole('button',{name:/^Continue/}).click();
 await respond(page,U.TASKS[13]);await respond(page,U.TASKS[14]);await page.getByRole('button',{name:'Continue to Stage B · Words'}).click();
 for(let i=15;i<21;i++)await respond(page,U.TASKS[i]);
 await expect(page.getByText(/Meaning: mochi/)).toHaveCount(0);
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('MOTI');await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();await expect(page.getByText(/Meaning: mochi/)).toBeVisible();
 const s=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 expect(s.records[12]).toMatchObject({submitted:'musi',correct:true,assisted:false});
 expect(s.records[21]).toMatchObject({submitted:'moti',correct:true,assisted:false});
});
test('320px mobile reflow and invalid save or stale writer never overwrite foreign progress bytes',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/katakana-m-row.html');
 await expect(page.getByRole('link',{name:'Skip to lesson content'})).toBeAttached();
 const bad='{"schema":900,"preserve":true}';await page.evaluate(([k,v])=>localStorage.setItem(k,v),[KEY,bad]);await page.reload();
 await expect(page.getByText(/progress is invalid or unavailable/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 26'}).click();await page.getByRole('button',{name:'Try recalling マ'}).click();
 const field=page.getByRole('textbox',{name:'Type the romaji reading'});await field.fill('MA');await field.press('Enter');
 await expect(page.getByText('Correct.')).toBeVisible();expect(await page.evaluate(k=>localStorage.getItem(k),KEY)).toBe(bad);
 await page.evaluate(k=>localStorage.removeItem(k),KEY);await page.reload();await page.getByRole('button',{name:'Start Unit 26'}).click();
 const foreign='{"otherTab":true}';await page.evaluate(([k,v])=>localStorage.setItem(k,v),[KEY,foreign]);
 await page.getByRole('button',{name:'Try recalling マ'}).click();await expect(page.getByText(/Another tab changed Unit 26/)).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),KEY)).toBe(foreign);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
