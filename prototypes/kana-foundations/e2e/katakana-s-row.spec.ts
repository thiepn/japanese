import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import * as U from '../katakana-s-row-engine.mjs';
import * as Prev from '../katakana-k-row-engine.mjs';
const KEY=U.STORAGE_KEY;
const OTHER=[Prev.STORAGE_KEY,'thiepn:kana-foundations:katakana-vowels:prototype-only:v1','thiepn:kana-foundations:integrated-reading:prototype-only:v1','thiepn:kana-foundations:prototype-only:v1','thiepn:account:test','thiepn:fsrs:test'];
async function start(page){await page.goto('/katakana-s-row.html');await page.getByRole('button',{name:'Start Unit 22'}).click();}
async function answer(page,t,val=t.answer){
 if(t.mode==='introduction'&&!t.correction)await page.getByRole('button',{name:'Try recalling '+t.kana}).click();
 if(t.choices){const c=t.choices.find(x=>x.value===val);expect(c).toBeTruthy();await page.getByRole('button',{name:(t.mode==='contrast'?'Character ':'Reading ')+c.label,exact:true}).click();}
 else{await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(val);await page.getByRole('button',{name:'Check answer'}).click();}
 await expect(page.getByText('Correct.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();
}
test('full Unit 22 31-prompt journey, checkpoint and independently stored first records, no foreign writes',async({page},info)=>{
 await page.goto('/katakana-s-row.html');await page.evaluate(keys=>keys.forEach((key,i)=>localStorage.setItem(key,'foreign-'+i)),OTHER);
 await expect(page.getByRole('heading',{name:'Learn サ・シ・ス・セ・ソ'})).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 22'}).click();
 if(process.env.CI){mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit22-start.png'});}
 for(let i=0;i<U.TASKS.length;i++){
  if(i===15){await expect(page.getByRole('heading',{name:'Katakana S-row checkpoint'})).toBeVisible();await expect(page.getByText('15 / 15')).toBeVisible();await page.reload();await expect(page.getByRole('heading',{name:'Katakana S-row checkpoint'})).toBeVisible();await page.getByRole('button',{name:'Continue to Stage B · Reading'}).click();if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit22-stageb.png'});}
  await answer(page,U.TASKS[i]);
 }
 await expect(page.getByRole('heading',{name:'Katakana S-row completed'})).toBeVisible();
 const x=await page.evaluate(async keys=>({saved:JSON.parse(localStorage.getItem('thiepn:kana-foundations:katakana-s-row:prototype-only:v1')),old:keys.map(k=>localStorage.getItem(k)),dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(d=>d.name):[]}),OTHER);
 expect(x.saved.finished).toBe(true);expect(x.saved.records).toHaveLength(31);expect(x.saved.corrections).toHaveLength(0);expect(x.saved.records.every(r=>r.correct===true&&!r.assisted&&!r.correction)).toBe(true);
 for(const w of U.WORDS)expect(x.saved.records.find(r=>r.taskId==='word-'+w.id).submitted).toBe(w.reading);
 x.old.forEach((v,i)=>expect(v).toBe('foreign-'+i));expect(x.dbs).toEqual([]);
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit22-end.png'});
 await page.reload();await expect(page.getByRole('heading',{name:'Katakana S-row completed'})).toBeVisible();
});
test('wrong introduction, assisted chair reading and mistaken salmon meaning retain separate corrections',async({page})=>{
 await start(page);
 for(let i=0;i<31;i++){
  if(i===15)await page.getByRole('button',{name:'Continue to Stage B · Reading'}).click();
  const t=U.TASKS[i];
  if(i===0){await page.getByRole('button',{name:'Try recalling サ'}).click();await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('so');await page.getByRole('button',{name:'Check answer'}).click();await expect(page.getByText('Not quite.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else if(i===11){await page.getByRole('button',{name:'Show answer (no credit)'}).click();await expect(page.getByText(/Answer revealed/)).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else if(i===30){await page.getByRole('button',{name:'Character エサ — bait / feed',exact:true}).click();await expect(page.getByText('Not quite.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else await answer(page,t);
 }
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();await page.reload();
 for(const id of ['intro-sa','word-isu','contrast-salmon'])await answer(page,{...U.TASKS.find(t=>t.id===id),correction:true});
 await expect(page.getByRole('heading',{name:'Katakana S-row completed'})).toBeVisible();
 const s=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(s.records).toHaveLength(34);expect(s.corrections).toEqual(['intro-sa','word-isu','contrast-salmon']);
 expect(s.records[0]).toMatchObject({submitted:'so',correct:false,correction:false});
 expect(s.records[11]).toMatchObject({submitted:'',correct:null,assisted:true,correction:false});
 expect(s.records[30]).toMatchObject({submitted:'エサ',correct:false,correction:false});
 expect(s.records.slice(-3).every(r=>r.correction&&r.correct===true)).toBe(true);
});
test('completed Unit 21 links to Unit 22 and back without rewriting historical Unit 21 records',async({page})=>{
 await page.goto('/katakana-k-row.html');
 await page.evaluate(async()=>{const M=await import('./katakana-k-row-engine.mjs');let s=M.resume(M.initialState());
  for(let i=0;i<M.TASKS.length;i++){if(i===M.CHECKPOINT_INDEX)s=M.acknowledgeCheckpoint(s);const t=M.taskAt(s);if(t.mode==='introduction')s=M.beginRecall(s);s=M.advance(M.answer(s,t.answer));}
  if(!s.finished)throw Error('Unit21 fixture invalid');localStorage.setItem(M.STORAGE_KEY,JSON.stringify(s));});
 await page.reload();await expect(page.getByRole('heading',{name:'Katakana K-row completed'})).toBeVisible();
 const old=await page.evaluate(k=>localStorage.getItem(k),Prev.STORAGE_KEY);
 await page.getByRole('link',{name:'Continue to Unit 22 · S-row'}).click();await expect(page.getByRole('heading',{name:'Learn サ・シ・ス・セ・ソ'})).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),Prev.STORAGE_KEY)).toBe(old);
 await page.getByRole('link',{name:'Back to Unit 21'}).click();await expect(page.getByRole('heading',{name:'Katakana K-row completed'})).toBeVisible();
});
test('explicit saved checkpoint cannot be bypassed and survives paused reload',async({page})=>{
 await start(page);for(let i=0;i<15;i++)await answer(page,U.TASKS[i]);
 await expect(page.getByRole('heading',{name:'Katakana S-row checkpoint'})).toBeVisible();
 const before=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 await page.getByRole('button',{name:'Exit and resume later'}).click();await page.reload();await page.getByRole('button',{name:'Resume Unit 22'}).click();
 await expect(page.getByRole('heading',{name:'Katakana S-row checkpoint'})).toBeVisible();
 const after=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);expect(after.records).toEqual(before.records);expect(after.checkpointPassed).toBe(false);
 await page.getByRole('button',{name:'Continue to Stage B · Reading'}).click();
 await expect(page.getByRole('heading',{name:'Read the authentic word'})).toBeVisible();
});
test('Hepburn shi versus Kunrei si accepted only for the proper sound and words; meanings not shown early',async({page})=>{
 await start(page);await answer(page,U.TASKS[0]);
 await page.getByRole('button',{name:'Try recalling シ'}).click();
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('SI');
 await page.getByRole('button',{name:'Check answer'}).click();await expect(page.getByText('Correct.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();
 for(let i=2;i<10;i++)await answer(page,U.TASKS[i]);
 await expect(page.getByRole('heading',{name:'Read the authentic word'})).toBeVisible();
 await expect(page.getByText(/Meaning: sushi/)).toHaveCount(0);
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('SUSI');
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();
 await expect(page.getByText(/Meaning: sushi/)).toBeVisible();
 const s=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 expect(s.records[1]).toMatchObject({submitted:'si',correct:true,assisted:false});
 expect(s.records[10]).toMatchObject({submitted:'susi',correct:true,assisted:false});
});
test('320px reflow, invalid saved state and stale-tab collision fail closed without overwriting data',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/katakana-s-row.html');await expect(page.getByRole('link',{name:'Skip to lesson content'})).toBeAttached();
 const bad='{"schema":900,"preserve":"yes"}';await page.evaluate(([k,v])=>localStorage.setItem(k,v),[KEY,bad]);await page.reload();
 await expect(page.getByText(/progress is invalid or unavailable/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 22'}).click();await page.getByRole('button',{name:'Try recalling サ'}).click();
 const field=page.getByRole('textbox',{name:'Type the romaji reading'});await field.fill('SA');await field.press('Enter');
 await expect(page.getByText('Correct.')).toBeVisible();expect(await page.evaluate(k=>localStorage.getItem(k),KEY)).toBe(bad);
 await page.evaluate(k=>localStorage.removeItem(k),KEY);await page.reload();await page.getByRole('button',{name:'Start Unit 22'}).click();
 const foreign='{"other":"writer"}';await page.evaluate(([k,v])=>localStorage.setItem(k,v),[KEY,foreign]);
 await page.getByRole('button',{name:'Try recalling サ'}).click();await expect(page.getByText(/Another tab changed Unit 22/)).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),KEY)).toBe(foreign);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
