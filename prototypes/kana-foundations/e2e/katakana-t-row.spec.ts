import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import * as U from '../katakana-t-row-engine.mjs';
import * as Prev from '../katakana-s-row-engine.mjs';
const KEY=U.STORAGE_KEY;
const OTHER=[Prev.STORAGE_KEY,'thiepn:kana-foundations:katakana-k-row:prototype-only:v1','thiepn:kana-foundations:katakana-vowels:prototype-only:v1','thiepn:kana-foundations:integrated-reading:prototype-only:v1','thiepn:account:test','thiepn:fsrs:test'];
async function start(page){await page.goto('/katakana-t-row.html');await page.getByRole('button',{name:'Start Unit 23'}).click();}
async function respond(page,t,val=t.answer){
 if(t.mode==='introduction'&&!t.correction)await page.getByRole('button',{name:'Try recalling '+t.kana}).click();
 if(t.choices){const c=t.choices.find(x=>x.value===val);expect(c).toBeTruthy();await page.getByRole('button',{name:(t.mode==='contrast'?'Character ':'Reading ')+c.label,exact:true}).click();}
 else{await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(val);await page.getByRole('button',{name:'Check answer'}).click();}
 await expect(page.getByText('Correct.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();
}
test('full 31-task Unit 23, checkpoint saved, all real words, and previous progress untouched',async({page},info)=>{
 await page.goto('/katakana-t-row.html');
 await page.evaluate(keys=>keys.forEach((k,i)=>localStorage.setItem(k,'untouched-'+i)),OTHER);
 await expect(page.getByRole('heading',{name:'Learn タ・チ・ツ・テ・ト'})).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 23'}).click();
 if(process.env.CI){mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit23-start.png'});}
 for(let i=0;i<U.TASKS.length;i++){
  if(i===15){await expect(page.getByRole('heading',{name:'Katakana T-row checkpoint'})).toBeVisible();await expect(page.getByText('15 / 15')).toBeVisible();await page.reload();await expect(page.getByRole('heading',{name:'Katakana T-row checkpoint'})).toBeVisible();await page.getByRole('button',{name:'Continue to Stage B · Words'}).click();}
  await respond(page,U.TASKS[i]);
 }
 await expect(page.getByRole('heading',{name:'Katakana T-row completed'})).toBeVisible();
 const x=await page.evaluate(async keys=>({s:JSON.parse(localStorage.getItem('thiepn:kana-foundations:katakana-t-row:prototype-only:v1')),older:keys.map(k=>localStorage.getItem(k)),dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(d=>d.name):[]}),OTHER);
 expect(x.s.finished).toBe(true);expect(x.s.records).toHaveLength(31);expect(x.s.corrections).toHaveLength(0);
 expect(x.s.records.every(r=>r.correct===true&&!r.assisted&&!r.correction)).toBe(true);
 for(const w of U.WORDS)expect(x.s.records.find(r=>r.taskId==='word-'+w.id).submitted).toBe(w.reading);
 x.older.forEach((v,i)=>expect(v).toBe('untouched-'+i));expect(x.dbs).toEqual([]);
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit23-finish.png'});
 await page.reload();await expect(page.getByRole('heading',{name:'Katakana T-row completed'})).toBeVisible();
});
test('wrong first, assisted shoe word and mistaken desk/shoes choice require independently recorded corrections',async({page})=>{
 await start(page);
 for(let i=0;i<31;i++){
  if(i===15)await page.getByRole('button',{name:'Continue to Stage B · Words'}).click();
  const t=U.TASKS[i];
  if(i===0){await page.getByRole('button',{name:'Try recalling タ'}).click();await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('to');await page.getByRole('button',{name:'Check answer'}).click();await expect(page.getByText('Not quite.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else if(i===11){await page.getByRole('button',{name:'Show answer (no credit)'}).click();await expect(page.getByText(/Answer revealed/)).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else if(i===30){await page.getByRole('button',{name:'Character ツクエ — desk',exact:true}).click();await expect(page.getByText('Not quite.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else await respond(page,t);
 }
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();await page.reload();
 for(const id of ['intro-ta','word-kutsu','contrast-meaning-shoes'])await respond(page,{...U.TASKS.find(t=>t.id===id),correction:true});
 await expect(page.getByRole('heading',{name:'Katakana T-row completed'})).toBeVisible();
 const s=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 expect(s.records).toHaveLength(34);expect(s.corrections).toEqual(['intro-ta','word-kutsu','contrast-meaning-shoes']);
 expect(s.records[0]).toMatchObject({submitted:'to',correct:false,correction:false});
 expect(s.records[11]).toMatchObject({submitted:'',correct:null,assisted:true,correction:false});
 expect(s.records[30]).toMatchObject({submitted:'ツクエ',correct:false,correction:false});
 expect(s.records.slice(-3).every(r=>r.correct&&r.correction)).toBe(true);
});
test('finished Unit 22 navigates forward and back without changing Unit 22 first records',async({page})=>{
 await page.goto('/katakana-s-row.html');await page.evaluate(async()=>{const M=await import('./katakana-s-row-engine.mjs');let s=M.resume(M.initialState());
  for(let i=0;i<M.TASKS.length;i++){if(i===M.CHECKPOINT_INDEX)s=M.acknowledgeCheckpoint(s);const t=M.taskAt(s);if(t.mode==='introduction')s=M.beginRecall(s);s=M.advance(M.answer(s,t.answer));}
  if(!s.finished)throw Error('Unit22 completion fixture failed');localStorage.setItem(M.STORAGE_KEY,JSON.stringify(s));});
 await page.reload();await expect(page.getByRole('heading',{name:'Katakana S-row completed'})).toBeVisible();
 const saved=await page.evaluate(k=>localStorage.getItem(k),Prev.STORAGE_KEY);
 await page.getByRole('link',{name:'Continue to Unit 23 · T-row'}).click();await expect(page.getByRole('heading',{name:'Learn タ・チ・ツ・テ・ト'})).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),Prev.STORAGE_KEY)).toBe(saved);
 await page.getByRole('link',{name:'Back to Unit 22'}).click();await expect(page.getByRole('heading',{name:'Katakana S-row completed'})).toBeVisible();
});
test('checkpoint pause/reload remains explicit without skipping original evidence',async({page})=>{
 await start(page);for(let i=0;i<15;i++)await respond(page,U.TASKS[i]);
 await expect(page.getByRole('heading',{name:'Katakana T-row checkpoint'})).toBeVisible();
 const before=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 await page.getByRole('button',{name:'Exit and resume later'}).click();await page.reload();await page.getByRole('button',{name:'Resume Unit 23'}).click();
 await expect(page.getByRole('heading',{name:'Katakana T-row checkpoint'})).toBeVisible();
 const after=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 expect(after.records).toEqual(before.records);expect(after.checkpointPassed).toBe(false);
 await page.getByRole('button',{name:'Continue to Stage B · Words'}).click();await expect(page.getByRole('heading',{name:'Read the authentic word'})).toBeVisible();
});
test('Hepburn chi/tsu and Kunrei ti/tu accepted, while visually misleading シ and ツ are contrasted',async({page})=>{
 await start(page);await respond(page,U.TASKS[0]);
 await page.getByRole('button',{name:'Try recalling チ'}).click();
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('TI');await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();
 await page.getByRole('button',{name:'Try recalling ツ'}).click();
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('TU');await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();
 for(let i=3;i<10;i++)await respond(page,U.TASKS[i]);
 await respond(page,U.TASKS[10]);
 await expect(page.getByRole('heading',{name:'Read the authentic word'})).toBeVisible();
 await expect(page.getByText(/Meaning: shoes/)).toHaveCount(0);
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('KUTU');await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();await expect(page.getByText(/Meaning: shoes/)).toBeVisible();
 const s=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 expect(s.records[1]).toMatchObject({submitted:'ti',correct:true,assisted:false});
 expect(s.records[2]).toMatchObject({submitted:'tu',correct:true,assisted:false});
 expect(s.records[11]).toMatchObject({submitted:'kutu',correct:true,assisted:false});
});
test('320px reflow, corrupt snapshot and a stale writer preserve stored bytes',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/katakana-t-row.html');
 await expect(page.getByRole('link',{name:'Skip to lesson content'})).toBeAttached();
 const bad='{"schema":900,"preserve":true}';await page.evaluate(([k,v])=>localStorage.setItem(k,v),[KEY,bad]);await page.reload();
 await expect(page.getByText(/progress is invalid or unavailable/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 23'}).click();await page.getByRole('button',{name:'Try recalling タ'}).click();
 const field=page.getByRole('textbox',{name:'Type the romaji reading'});await field.fill('TA');await field.press('Enter');
 await expect(page.getByText('Correct.')).toBeVisible();expect(await page.evaluate(k=>localStorage.getItem(k),KEY)).toBe(bad);
 await page.evaluate(k=>localStorage.removeItem(k),KEY);await page.reload();await page.getByRole('button',{name:'Start Unit 23'}).click();
 const foreign='{"otherTab":true}';await page.evaluate(([k,v])=>localStorage.setItem(k,v),[KEY,foreign]);
 await page.getByRole('button',{name:'Try recalling タ'}).click();await expect(page.getByText(/Another tab changed Unit 23/)).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),KEY)).toBe(foreign);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
