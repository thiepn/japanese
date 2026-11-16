import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import * as U from '../katakana-h-row-engine.mjs';
import * as Prev from '../katakana-n-row-engine.mjs';
const KEY=U.STORAGE_KEY;
const OTHER=[Prev.STORAGE_KEY,'thiepn:kana-foundations:katakana-t-row:prototype-only:v1','thiepn:kana-foundations:katakana-s-row:prototype-only:v1','thiepn:kana-foundations:katakana-k-row:prototype-only:v1','thiepn:kana-foundations:katakana-vowels:prototype-only:v1','thiepn:account:test','thiepn:fsrs:test'];
async function start(page){await page.goto('/katakana-h-row.html');await page.getByRole('button',{name:'Start Unit 25'}).click();}
async function respond(page,t,val=t.answer){
 if(t.mode==='introduction'&&!t.correction)await page.getByRole('button',{name:'Try recalling '+t.kana}).click();
 if(t.choices){const c=t.choices.find(x=>x.value===val);expect(c).toBeTruthy();await page.getByRole('button',{name:(t.mode==='contrast'?'Character ':'Reading ')+c.label,exact:true}).click();}
 else{await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(val);await page.getByRole('button',{name:'Check answer'}).click();}
 await expect(page.getByText('Correct.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();
}
test('full Unit 25 journey, 31 first records, pause-safe checkpoint and isolated legacy progress',async({page},info)=>{
 await page.goto('/katakana-h-row.html');await page.evaluate(keys=>keys.forEach((k,i)=>localStorage.setItem(k,'preserve-'+i)),OTHER);
 await expect(page.getByRole('heading',{name:'Learn ハ・ヒ・フ・ヘ・ホ'})).toBeVisible();await page.getByRole('button',{name:'Start Unit 25'}).click();
 if(process.env.CI){mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit25-start.png'});}
 for(let i=0;i<U.TASKS.length;i++){
  if(i===15){await expect(page.getByRole('heading',{name:'Katakana H-row checkpoint'})).toBeVisible();await expect(page.getByText('15 / 15')).toBeVisible();await page.reload();await expect(page.getByRole('heading',{name:'Katakana H-row checkpoint'})).toBeVisible();await page.getByRole('button',{name:'Continue to Stage B · Words'}).click();}
  await respond(page,U.TASKS[i]);
 }
 await expect(page.getByRole('heading',{name:'Katakana H-row completed'})).toBeVisible();
 const x=await page.evaluate(async keys=>({state:JSON.parse(localStorage.getItem('thiepn:kana-foundations:katakana-h-row:prototype-only:v1')),old:keys.map(k=>localStorage.getItem(k)),dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(d=>d.name):[]}),OTHER);
 expect(x.state.finished).toBe(true);expect(x.state.records).toHaveLength(31);expect(x.state.corrections).toHaveLength(0);
 expect(x.state.records.every(r=>r.correct===true&&!r.assisted&&!r.correction)).toBe(true);
 for(const w of U.WORDS)expect(x.state.records.find(r=>r.taskId==='word-'+w.id).submitted).toBe(w.reading);
 x.old.forEach((v,i)=>expect(v).toBe('preserve-'+i));expect(x.dbs).toEqual([]);
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit25-completed.png'});
 await page.reload();await expect(page.getByRole('heading',{name:'Katakana H-row completed'})).toBeVisible();
});
test('wrong first, assisted lid and incorrect navel/bone answer retain separate corrections',async({page})=>{
 await start(page);
 for(let i=0;i<31;i++){
  if(i===15)await page.getByRole('button',{name:'Continue to Stage B · Words'}).click();
  const t=U.TASKS[i];
  if(i===0){await page.getByRole('button',{name:'Try recalling ハ'}).click();await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('hi');await page.getByRole('button',{name:'Check answer'}).click();await expect(page.getByText('Not quite.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else if(i===11){await page.getByRole('button',{name:'Show answer (no credit)'}).click();await expect(page.getByText(/Answer revealed/)).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else if(i===30){await page.getByRole('button',{name:'Character ホネ — bone',exact:true}).click();await expect(page.getByText('Not quite.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else await respond(page,t);
 }
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();await page.reload();
 for(const id of ['intro-ha','word-futa','contrast-navel'])await respond(page,{...U.TASKS.find(t=>t.id===id),correction:true});
 await expect(page.getByRole('heading',{name:'Katakana H-row completed'})).toBeVisible();
 const s=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 expect(s.records).toHaveLength(34);expect(s.corrections).toEqual(['intro-ha','word-futa','contrast-navel']);
 expect(s.records[0]).toMatchObject({submitted:'hi',correct:false,correction:false});
 expect(s.records[11]).toMatchObject({submitted:'',correct:null,assisted:true,correction:false});
 expect(s.records[30]).toMatchObject({submitted:'ホネ',correct:false,correction:false});
 expect(s.records.slice(-3).every(r=>r.correction&&r.correct===true)).toBe(true);
});
test('completed Unit 24 links forward and back with exact unchanged previous evidence',async({page})=>{
 await page.goto('/katakana-n-row.html');await page.evaluate(async()=>{const M=await import('./katakana-n-row-engine.mjs');let s=M.resume(M.initialState());
  for(let i=0;i<M.TASKS.length;i++){if(i===M.CHECKPOINT_INDEX)s=M.acknowledgeCheckpoint(s);const t=M.taskAt(s);if(t.mode==='introduction')s=M.beginRecall(s);s=M.advance(M.answer(s,t.answer));}
  if(!s.finished)throw Error('Unit24 completion fixture failed');localStorage.setItem(M.STORAGE_KEY,JSON.stringify(s));});
 await page.reload();await expect(page.getByRole('heading',{name:'Katakana N-row completed'})).toBeVisible();
 const old=await page.evaluate(k=>localStorage.getItem(k),Prev.STORAGE_KEY);
 await page.getByRole('link',{name:'Continue to Unit 25 · H-row'}).click();await expect(page.getByRole('heading',{name:'Learn ハ・ヒ・フ・ヘ・ホ'})).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),Prev.STORAGE_KEY)).toBe(old);
 await page.getByRole('link',{name:'Back to Unit 24'}).click();await expect(page.getByRole('heading',{name:'Katakana N-row completed'})).toBeVisible();
});
test('checkpoint cannot be bypassed and persists original responses across exit/reload',async({page})=>{
 await start(page);for(let i=0;i<15;i++)await respond(page,U.TASKS[i]);
 await expect(page.getByRole('heading',{name:'Katakana H-row checkpoint'})).toBeVisible();
 const before=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 await page.getByRole('button',{name:'Exit and resume later'}).click();await page.reload();await page.getByRole('button',{name:'Resume Unit 25'}).click();
 await expect(page.getByRole('heading',{name:'Katakana H-row checkpoint'})).toBeVisible();
 const after=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 expect(after.records).toEqual(before.records);expect(after.checkpointPassed).toBe(false);
 await page.getByRole('button',{name:'Continue to Stage B · Words'}).click();
 await expect(page.getByRole('heading',{name:'Read the authentic word'})).toBeVisible();
});
test('Hepburn fu and Kunrei hu and chi/ti are fairly graded, meanings hidden until response',async({page})=>{
 await start(page);
 for(let i=0;i<10;i++){
  const t=U.TASKS[i],v=i===2?'HU':undefined;
  await respond(page,t,v??t.answer);
 }
 await expect(page.getByRole('heading',{name:'Read the authentic word'})).toBeVisible();
 await expect(page.getByText(/Meaning: bee/)).toHaveCount(0);
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('HATI');
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();await expect(page.getByText(/Meaning: bee/)).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();
 await expect(page.getByText(/Meaning: lid/)).toHaveCount(0);
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('HUTA');
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();await expect(page.getByText(/Meaning: lid/)).toBeVisible();
 const s=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 expect(s.records[2]).toMatchObject({submitted:'hu',correct:true,assisted:false});
 expect(s.records[10]).toMatchObject({submitted:'hati',correct:true,assisted:false});
 expect(s.records[11]).toMatchObject({submitted:'huta',correct:true,assisted:false});
});
test('320px mobile reflow, corrupt saved progress and stale writer preserve original stored bytes',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/katakana-h-row.html');
 await expect(page.getByRole('link',{name:'Skip to lesson content'})).toBeAttached();
 const bad='{"schema":900,"preserve":true}';await page.evaluate(([k,v])=>localStorage.setItem(k,v),[KEY,bad]);await page.reload();
 await expect(page.getByText(/progress is invalid or unavailable/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 25'}).click();await page.getByRole('button',{name:'Try recalling ハ'}).click();
 const field=page.getByRole('textbox',{name:'Type the romaji reading'});await field.fill('HA');await field.press('Enter');
 await expect(page.getByText('Correct.')).toBeVisible();expect(await page.evaluate(k=>localStorage.getItem(k),KEY)).toBe(bad);
 await page.evaluate(k=>localStorage.removeItem(k),KEY);await page.reload();await page.getByRole('button',{name:'Start Unit 25'}).click();
 const foreign='{"otherTab":true}';await page.evaluate(([k,v])=>localStorage.setItem(k,v),[KEY,foreign]);
 await page.getByRole('button',{name:'Try recalling ハ'}).click();await expect(page.getByText(/Another tab changed Unit 25/)).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),KEY)).toBe(foreign);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
