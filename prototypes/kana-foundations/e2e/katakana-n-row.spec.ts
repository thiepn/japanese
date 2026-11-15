import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import * as U from '../katakana-n-row-engine.mjs';
import * as Prev from '../katakana-t-row-engine.mjs';
const KEY=U.STORAGE_KEY;
const OTHER=[Prev.STORAGE_KEY,'thiepn:kana-foundations:katakana-s-row:prototype-only:v1','thiepn:kana-foundations:katakana-k-row:prototype-only:v1','thiepn:kana-foundations:katakana-vowels:prototype-only:v1','thiepn:kana-foundations:integrated-reading:prototype-only:v1','thiepn:account:test','thiepn:fsrs:test'];
async function start(page){await page.goto('/katakana-n-row.html');await page.getByRole('button',{name:'Start Unit 24'}).click();}
async function respond(page,t,val=t.answer){
 if(t.mode==='introduction'&&!t.correction)await page.getByRole('button',{name:'Try recalling '+t.kana}).click();
 if(t.choices){const c=t.choices.find(x=>x.value===val);expect(c).toBeTruthy();await page.getByRole('button',{name:(t.mode==='contrast'?'Character ':'Reading ')+c.label,exact:true}).click();}
 else{await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(val);await page.getByRole('button',{name:'Check answer'}).click();}
 await expect(page.getByText('Correct.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();
}
test('entire Unit 24 journey saves 31 independently correct first attempts, checkpoint and isolates all previous progress',async({page},info)=>{
 await page.goto('/katakana-n-row.html');await page.evaluate(keys=>keys.forEach((key,i)=>localStorage.setItem(key,'preserve-'+i)),OTHER);
 await expect(page.getByRole('heading',{name:'Learn ナ・ニ・ヌ・ネ・ノ'})).toBeVisible();await page.getByRole('button',{name:'Start Unit 24'}).click();
 if(process.env.CI){mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit24-start.png'});}
 for(let i=0;i<U.TASKS.length;i++){
  if(i===15){await expect(page.getByRole('heading',{name:'Katakana N-row checkpoint'})).toBeVisible();await expect(page.getByText('15 / 15')).toBeVisible();await page.reload();await expect(page.getByRole('heading',{name:'Katakana N-row checkpoint'})).toBeVisible();await page.getByRole('button',{name:'Continue to Stage B · Vocabulary'}).click();}
  await respond(page,U.TASKS[i]);
 }
 await expect(page.getByRole('heading',{name:'Katakana N-row completed'})).toBeVisible();
 const x=await page.evaluate(async keys=>({s:JSON.parse(localStorage.getItem('thiepn:kana-foundations:katakana-n-row:prototype-only:v1')),old:keys.map(k=>localStorage.getItem(k)),dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(d=>d.name):[]}),OTHER);
 expect(x.s.finished).toBe(true);expect(x.s.records).toHaveLength(31);expect(x.s.corrections).toHaveLength(0);expect(x.s.records.every(r=>r.correct===true&&!r.assisted&&!r.correction)).toBe(true);
 for(const w of U.WORDS)expect(x.s.records.find(r=>r.taskId==='word-'+w.id).submitted).toBe(w.reading);
 x.old.forEach((v,i)=>expect(v).toBe('preserve-'+i));expect(x.dbs).toEqual([]);
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit24-finish.png'});
 await page.reload();await expect(page.getByRole('heading',{name:'Katakana N-row completed'})).toBeVisible();
});
test('wrong original, assisted dog and wrong seed/sushi answer get separate recorded corrections',async({page})=>{
 await start(page);
 for(let i=0;i<31;i++){
  if(i===15)await page.getByRole('button',{name:'Continue to Stage B · Vocabulary'}).click();
  const t=U.TASKS[i];
  if(i===0){await page.getByRole('button',{name:'Try recalling ナ'}).click();await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('ni');await page.getByRole('button',{name:'Check answer'}).click();await expect(page.getByText('Not quite.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else if(i===11){await page.getByRole('button',{name:'Show answer (no credit)'}).click();await expect(page.getByText(/Answer revealed/)).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else if(i===30){await page.getByRole('button',{name:'Character ネタ — sushi topping',exact:true}).click();await expect(page.getByText('Not quite.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else await respond(page,t);
 }
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();await page.reload();
 for(const id of ['intro-na','word-inu','contrast-seed'])await respond(page,{...U.TASKS.find(t=>t.id===id),correction:true});
 await expect(page.getByRole('heading',{name:'Katakana N-row completed'})).toBeVisible();
 const s=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(s.records).toHaveLength(34);expect(s.corrections).toEqual(['intro-na','word-inu','contrast-seed']);
 expect(s.records[0]).toMatchObject({submitted:'ni',correct:false,correction:false});
 expect(s.records[11]).toMatchObject({submitted:'',correct:null,assisted:true,correction:false});
 expect(s.records[30]).toMatchObject({submitted:'ネタ',correct:false,correction:false});
 expect(s.records.slice(-3).every(r=>r.correct===true&&r.correction)).toBe(true);
});
test('Unit 23 completed progress navigates into Unit 24 and back with byte-identical old records',async({page})=>{
 await page.goto('/katakana-t-row.html');
 await page.evaluate(async()=>{const M=await import('./katakana-t-row-engine.mjs');let s=M.resume(M.initialState());
  for(let i=0;i<M.TASKS.length;i++){if(i===M.CHECKPOINT_INDEX)s=M.acknowledgeCheckpoint(s);const t=M.taskAt(s);if(t.mode==='introduction')s=M.beginRecall(s);s=M.advance(M.answer(s,t.answer));}
  if(!s.finished)throw Error('Unit23 fixture invalid');localStorage.setItem(M.STORAGE_KEY,JSON.stringify(s));
 });
 await page.reload();await expect(page.getByRole('heading',{name:'Katakana T-row completed'})).toBeVisible();
 const prior=await page.evaluate(k=>localStorage.getItem(k),Prev.STORAGE_KEY);
 await page.getByRole('link',{name:'Continue to Unit 24 · N-row'}).click();await expect(page.getByRole('heading',{name:'Learn ナ・ニ・ヌ・ネ・ノ'})).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),Prev.STORAGE_KEY)).toBe(prior);
 await page.getByRole('link',{name:'Back to Unit 23'}).click();await expect(page.getByRole('heading',{name:'Katakana T-row completed'})).toBeVisible();
});
test('checkpoint blocks Stage B until learner acknowledgment and survives pause-reload',async({page})=>{
 await start(page);for(let i=0;i<15;i++)await respond(page,U.TASKS[i]);
 await expect(page.getByRole('heading',{name:'Katakana N-row checkpoint'})).toBeVisible();
 const initial=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 await page.getByRole('button',{name:'Exit and resume later'}).click();await page.reload();await page.getByRole('button',{name:'Resume Unit 24'}).click();
 await expect(page.getByRole('heading',{name:'Katakana N-row checkpoint'})).toBeVisible();
 const after=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 expect(after.records).toEqual(initial.records);expect(after.checkpointPassed).toBe(false);
 await page.getByRole('button',{name:'Continue to Stage B · Vocabulary'}).click();await expect(page.getByRole('heading',{name:'Read the authentic word'})).toBeVisible();
});
test('prior shi/tsu romanization equivalents accepted in N-row words and meanings withheld until answer',async({page})=>{
 await start(page);for(let i=0;i<15;i++)await respond(page,U.TASKS[i]);
 await page.getByRole('button',{name:'Continue to Stage B · Vocabulary'}).click();
 await respond(page,U.TASKS[15]); // キノコ
 await expect(page.getByRole('heading',{name:'Read the authentic word'})).toBeVisible();
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('KITUNE');await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();await expect(page.getByText(/Meaning: fox/)).toBeVisible();
 await page.getByRole('button',{name:/^Continue/}).click();
 for(let i=17;i<19;i++)await respond(page,U.TASKS[i]);
 await expect(page.getByText(/Meaning: Japanese pear/)).toHaveCount(0);
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('NASI');await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();await expect(page.getByText(/Meaning: Japanese pear/)).toBeVisible();
 const s=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 expect(s.records[16]).toMatchObject({submitted:'kitune',correct:true,assisted:false});
 expect(s.records[19]).toMatchObject({submitted:'nasi',correct:true,assisted:false});
});
test('320px reflow and invalid-save/stale-writer fail closed without overwriting original bytes',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/katakana-n-row.html');
 await expect(page.getByRole('link',{name:'Skip to lesson content'})).toBeAttached();
 const bad='{"schema":900,"preserve":true}';await page.evaluate(([k,v])=>localStorage.setItem(k,v),[KEY,bad]);await page.reload();
 await expect(page.getByText(/progress is invalid or unavailable/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 24'}).click();await page.getByRole('button',{name:'Try recalling ナ'}).click();
 const field=page.getByRole('textbox',{name:'Type the romaji reading'});await field.fill('NA');await field.press('Enter');
 await expect(page.getByText('Correct.')).toBeVisible();expect(await page.evaluate(k=>localStorage.getItem(k),KEY)).toBe(bad);
 await page.evaluate(k=>localStorage.removeItem(k),KEY);await page.reload();await page.getByRole('button',{name:'Start Unit 24'}).click();
 const foreign='{"otherTab":true}';await page.evaluate(([k,v])=>localStorage.setItem(k,v),[KEY,foreign]);
 await page.getByRole('button',{name:'Try recalling ナ'}).click();await expect(page.getByText(/Another tab changed Unit 24/)).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),KEY)).toBe(foreign);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
