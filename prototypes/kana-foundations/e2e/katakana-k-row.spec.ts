import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import * as U from '../katakana-k-row-engine.mjs';
import * as Prev from '../katakana-vowels-engine.mjs';
const KEY=U.STORAGE_KEY;
const OTHER=[Prev.STORAGE_KEY,'thiepn:kana-foundations:integrated-reading:prototype-only:v1','thiepn:kana-foundations:prototype-only:v1','thiepn:account:test','thiepn:fsrs:test'];
async function start(page){await page.goto('/katakana-k-row.html');await page.getByRole('button',{name:'Start Unit 21'}).click();}
async function respond(page,t,val=t.answer){
 if(t.mode==='introduction'&&!t.correction)await page.getByRole('button',{name:'Try recalling '+t.kana}).click();
 if(t.choices){const c=t.choices.find(x=>x.value===val);expect(c).toBeTruthy();await page.getByRole('button',{name:(t.mode==='contrast'?'Character ':'Reading ')+c.label,exact:true}).click();}
 else{await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(val);await page.getByRole('button',{name:'Check answer'}).click();}
 await expect(page.getByText('Correct.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();
}
test('entire Unit 21 27-prompt journey, checkpoint, first answers, old data and no IndexedDB writes',async({page},info)=>{
 await page.goto('/katakana-k-row.html');await page.evaluate(keys=>keys.forEach((k,i)=>localStorage.setItem(k,'keep-'+i)),OTHER);
 await expect(page.getByRole('heading',{name:'Learn カ・キ・ク・ケ・コ'})).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 21'}).click();
 if(process.env.CI){mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit21-first.png'});}
 for(let i=0;i<U.TASKS.length;i++){
  if(i===15){await expect(page.getByRole('heading',{name:'Katakana K-row checkpoint'})).toBeVisible();await expect(page.getByText('15 / 15')).toBeVisible();await page.reload();await expect(page.getByRole('heading',{name:'Katakana K-row checkpoint'})).toBeVisible();await page.getByRole('button',{name:'Continue to Stage B · Words'}).click();if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit21-stageb.png'});}
  await respond(page,U.TASKS[i]);
 }
 await expect(page.getByRole('heading',{name:'Katakana K-row completed'})).toBeVisible();
 const x=await page.evaluate(async keys=>({s:JSON.parse(localStorage.getItem('thiepn:kana-foundations:katakana-k-row:prototype-only:v1')),old:keys.map(k=>localStorage.getItem(k)),dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(d=>d.name):[]}),OTHER);
 expect(x.s.finished).toBe(true);expect(x.s.records).toHaveLength(27);expect(x.s.corrections).toHaveLength(0);expect(x.s.records.every(r=>r.correct===true&&!r.assisted&&!r.correction)).toBe(true);
 for(const w of U.WORDS)expect(x.s.records.find(r=>r.taskId==='word-'+w.id).submitted).toBe(w.reading);
 x.old.forEach((s,i)=>expect(s).toBe('keep-'+i));expect(x.dbs).toEqual([]);
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit21-finish.png'});
 await page.reload();await expect(page.getByRole('heading',{name:'Katakana K-row completed'})).toBeVisible();
});
test('wrong K-row initial, revealed flower word and mistaken moss/carnation preserve correction evidence',async({page})=>{
 await start(page);
 for(let i=0;i<27;i++){
  if(i===15)await page.getByRole('button',{name:'Continue to Stage B · Words'}).click();
  const t=U.TASKS[i];
  if(i===0){await page.getByRole('button',{name:'Try recalling カ'}).click();await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('ko');await page.getByRole('button',{name:'Check answer'}).click();await expect(page.getByText('Not quite.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else if(i===11){await page.getByRole('button',{name:'Show answer (no credit)'}).click();await expect(page.getByText(/Answer revealed/)).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else if(i===26){await page.getByRole('button',{name:'Character キク',exact:true}).click();await expect(page.getByText('Not quite.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else await respond(page,t);
 }
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();await page.reload();
 for(const id of ['intro-ka','word-kiku','contrast-moss'])await respond(page,{...U.TASKS.find(t=>t.id===id),correction:true});
 await expect(page.getByRole('heading',{name:'Katakana K-row completed'})).toBeVisible();
 const s=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);expect(s.records).toHaveLength(30);expect(s.corrections).toEqual(['intro-ka','word-kiku','contrast-moss']);
 expect(s.records[0]).toMatchObject({submitted:'ko',correct:false,correction:false});expect(s.records[11]).toMatchObject({submitted:'',correct:null,assisted:true,correction:false});
 expect(s.records[26]).toMatchObject({submitted:'キク',correct:false,correction:false});expect(s.records.slice(-3).every(r=>r.correction&&r.correct===true)).toBe(true);
});
test('finished Unit 20 links to Unit 21 and back without changing any prior Unit 20 evidence',async({page})=>{
 await page.goto('/katakana-vowels.html');await page.evaluate(async()=>{
  const M=await import('./katakana-vowels-engine.mjs');let s=M.resume(M.initialState());
  for(let i=0;i<M.TASKS.length;i++){if(i===M.CHECKPOINT_INDEX)s=M.acknowledgeCheckpoint(s);const t=M.taskAt(s);if(t.mode==='introduction')s=M.beginRecall(s);s=M.advance(M.answer(s,t.answer));}
  if(!s.finished)throw Error('Unit20 fixture invalid');localStorage.setItem(M.STORAGE_KEY,JSON.stringify(s));
 });
 await page.reload();await expect(page.getByRole('heading',{name:'Five katakana vowels completed'})).toBeVisible();
 const prior=await page.evaluate(k=>localStorage.getItem(k),Prev.STORAGE_KEY);
 await page.getByRole('link',{name:'Continue to Unit 21 · K-row'}).click();await expect(page.getByRole('heading',{name:'Learn カ・キ・ク・ケ・コ'})).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),Prev.STORAGE_KEY)).toBe(prior);
 await page.getByRole('link',{name:'Back to Unit 20'}).click();await expect(page.getByRole('heading',{name:'Five katakana vowels completed'})).toBeVisible();
});
test('checkpoint is explicit and persistent across exit/reload, with no premature Stage B progression',async({page})=>{
 await start(page);for(let i=0;i<15;i++)await respond(page,U.TASKS[i]);
 await expect(page.getByRole('heading',{name:'Katakana K-row checkpoint'})).toBeVisible();
 const before=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 await page.getByRole('button',{name:'Exit and resume later'}).click();await page.reload();await page.getByRole('button',{name:'Resume Unit 21'}).click();
 await expect(page.getByRole('heading',{name:'Katakana K-row checkpoint'})).toBeVisible();
 const after=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);expect(after.records).toEqual(before.records);expect(after.checkpointPassed).toBe(false);
 await page.getByRole('button',{name:'Continue to Stage B · Words'}).click();
 await expect(page.getByRole('heading',{name:'Read the authentic word'})).toBeVisible();
});
test('K-row script traps fail, word meanings appear only after learner answer, and all word input is decodable',async({page})=>{
 await start(page);
 for(let i=0;i<10;i++)await respond(page,U.TASKS[i]);
 await expect(page.getByRole('heading',{name:'Read the authentic word'})).toBeVisible();
 await expect(page.getByText(/Meaning: oyster/)).toHaveCount(0);
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('kaki');
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText(/Meaning: oyster/)).toBeVisible();
 await page.getByRole('button',{name:/^Continue/}).click();
 for(let i=11;i<13;i++)await respond(page,U.TASKS[i]);
 await page.getByRole('button',{name:'Character か',exact:true}).click();await expect(page.getByText('Not quite.')).toBeVisible();
 await page.getByRole('button',{name:/^Continue/}).click();
 const records=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).records,KEY);
 expect(records[10]).toMatchObject({submitted:'kaki',correct:true,assisted:false});
 expect(records[13]).toMatchObject({submitted:'か',correct:false,assisted:false});
});
test('320px layout, invalid saved state and stale writer fail closed without destructive overwrite',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/katakana-k-row.html');
 await expect(page.getByRole('link',{name:'Skip to lesson content'})).toBeAttached();
 const bad='{"schema":900,"preserve":"true"}';await page.evaluate(([key,val])=>localStorage.setItem(key,val),[KEY,bad]);
 await page.reload();await expect(page.getByText(/progress is invalid or unavailable/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 21'}).click();await page.getByRole('button',{name:'Try recalling カ'}).click();
 const field=page.getByRole('textbox',{name:'Type the romaji reading'});await field.fill('KA');await field.press('Enter');
 await expect(page.getByText('Correct.')).toBeVisible();expect(await page.evaluate(k=>localStorage.getItem(k),KEY)).toBe(bad);
 await page.evaluate(k=>localStorage.removeItem(k),KEY);await page.reload();await page.getByRole('button',{name:'Start Unit 21'}).click();
 const foreign='{"other":"tab"}';await page.evaluate(([key,val])=>localStorage.setItem(key,val),[KEY,foreign]);
 await page.getByRole('button',{name:'Try recalling カ'}).click();await expect(page.getByText(/Another tab changed Unit 21/)).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),KEY)).toBe(foreign);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
