import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import * as U from '../integrated-reading-engine.mjs';
import * as P from '../yoon-gjbp-engine.mjs';
const KEY=U.STORAGE_KEY;
const OTHER=[P.STORAGE_KEY,'thiepn:kana-foundations:prototype-only:v1',
'thiepn:kana-foundations:yoon-nhmr:prototype-only:v1',
'thiepn:kana-foundations:yoon-kshch:prototype-only:v1',
'thiepn:account:test','thiepn:fsrs:test'];
async function start(page){await page.goto('/integrated-reading.html');await page.getByRole('button',{name:'Start Unit 19'}).click();}
async function answer(page,t,value=t.answer){
 if(t.choices){const c=t.choices.find(c=>c.value===value);expect(c).toBeTruthy();await page.getByRole('button',{name:'Character '+c.label,exact:true}).click();}
 else{await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(value);await page.getByRole('button',{name:'Check answer'}).click();}
 await expect(page.getByText('Correct.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();
}
test('full Unit 19 28-prompt journey, checkpoint, and isolated progress across six profiles',async({page},info)=>{
 await page.goto('/integrated-reading.html');
 await page.evaluate(keys=>keys.forEach((k,i)=>localStorage.setItem(k,'sentinel-'+i)),OTHER);
 await expect(page.getByRole('heading',{name:'Read real Japanese, not isolated kana'})).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 19'}).click();
 if(process.env.CI){mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit19-first.png'});}
 for(let i=0;i<28;i++){
  if(i===16){await expect(page.getByRole('heading',{name:'Word-reading checkpoint'})).toBeVisible();
   await expect(page.getByText('16 / 16')).toBeVisible();await page.reload();
   await expect(page.getByRole('heading',{name:'Word-reading checkpoint'})).toBeVisible();
   await page.getByRole('button',{name:'Continue to Stage B · Sentences'}).click();
   if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit19-stageb.png'});
  }
  await answer(page,U.TASKS[i]);
 }
 await expect(page.getByRole('heading',{name:'Integrated hiragana reading completed'})).toBeVisible();
 const state=await page.evaluate(async keys=>({s:JSON.parse(localStorage.getItem('thiepn:kana-foundations:integrated-reading:prototype-only:v1')),old:keys.map(k=>localStorage.getItem(k)),dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(x=>x.name):[]}),OTHER);
 expect(state.s.finished).toBe(true);expect(state.s.records).toHaveLength(28);
 expect(state.s.records.every(r=>r.correct===true&&!r.assisted&&!r.correction)).toBe(true);
 expect(state.s.records.find(r=>r.taskId==='word-chuushajou').submitted).toBe('chuushajou');
 state.old.forEach((x,i)=>expect(x).toBe('sentinel-'+i));expect(state.dbs).toEqual([]);
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit19-complete.png'});
 await page.reload();await expect(page.getByRole('heading',{name:'Integrated hiragana reading completed'})).toBeVisible();
});
test('wrong, revealed and nasal reading errors yield separate immutable corrections',async({page})=>{
 await start(page);for(let i=0;i<28;i++){
  if(i===16)await page.getByRole('button',{name:'Continue to Stage B · Sentences'}).click();
  const t=U.TASKS[i];
  if(i===0||i===26){if(i===0){await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('kipu');await page.getByRole('button',{name:'Check answer'}).click();}
   else await page.getByRole('button',{name:'Character byouini — misses nasal ん',exact:true}).click();
   await expect(page.getByText('Not quite.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else if(i===5){await page.getByRole('button',{name:'Show answer (no credit)'}).click();await expect(page.getByText(/Answer revealed/)).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();}
  else await answer(page,t);
 }
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();await page.reload();
 for(const id of ['word-kippu','word-chuushajou','contrast-nasal-ni'])await answer(page,{...U.TASKS.find(x=>x.id===id),correction:true});
 const s=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(s.corrections).toEqual(['word-kippu','word-chuushajou','contrast-nasal-ni']);
 expect(s.records).toHaveLength(31);
 expect(s.records[0]).toMatchObject({submitted:'kipu',correct:false,correction:false});
 expect(s.records[5]).toMatchObject({submitted:'',correct:null,assisted:true,correction:false});
 expect(s.records[26]).toMatchObject({submitted:'byouini',correct:false,correction:false});
});
test('Unit 18 completed lesson leads to Unit 19 without mutating Unit 18 records',async({page})=>{
 await page.goto('/yoon-gjbp.html');await page.evaluate(async()=>{
  const M=await import('./yoon-gjbp-engine.mjs');let s=M.resume(M.initialState());
  for(let i=0;i<M.TASKS.length;i++){if(i===M.CHECKPOINT_INDEX)s=M.acknowledgeCheckpoint(s);const t=M.taskAt(s);if(t.mode==='introduction')s=M.beginRecall(s);s=M.advance(M.answer(s,t.answer));}
  if(!s.finished)throw Error('Unit18 fixture');localStorage.setItem(M.STORAGE_KEY,JSON.stringify(s));
 });
 await page.reload();await expect(page.getByRole('heading',{name:'G/J/B/P yōon completed'})).toBeVisible();
 const original=await page.evaluate(k=>localStorage.getItem(k),P.STORAGE_KEY);
 await page.getByRole('link',{name:'Continue to Unit 19 · Integrated Reading'}).click();
 await expect(page.getByRole('heading',{name:'Read real Japanese, not isolated kana'})).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),P.STORAGE_KEY)).toBe(original);
 await page.getByRole('link',{name:'Back to Unit 18'}).click();
 await expect(page.getByRole('heading',{name:'G/J/B/P yōon completed'})).toBeVisible();
});
test('checkpoint survives pause and reload; cannot be bypassed',async({page})=>{
 await start(page);for(let i=0;i<16;i++)await answer(page,U.TASKS[i]);
 const before=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 await page.getByRole('button',{name:'Exit and resume later'}).click();
 await page.reload();await page.getByRole('button',{name:'Resume Unit 19'}).click();
 await expect(page.getByRole('heading',{name:'Word-reading checkpoint'})).toBeVisible();
 const after=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 expect(after.index).toBe(16);expect(after.records).toEqual(before.records);expect(after.checkpointPassed).toBe(false);
 await page.getByRole('button',{name:'Continue to Stage B · Sentences'}).click();
 await expect(page.getByRole('heading',{name:'Read the sentence'})).toBeVisible();
});
test('correct typed wo does not become correct pronounced wo; topic wa checked',async({page})=>{
 await start(page);for(let i=0;i<16;i++)await answer(page,U.TASKS[i]);
 await page.getByRole('button',{name:'Continue to Stage B · Sentences'}).click();
 await answer(page,U.TASKS[16]);await answer(page,U.TASKS[17],'kippuwokaimasu');
 for(let i=18;i<24;i++)await answer(page,U.TASKS[i]);
 await page.getByRole('button',{name:'Character kyouha — ordinary character ha',exact:true}).click();
 await expect(page.getByText('Not quite.')).toBeVisible();await page.getByRole('button',{name:/^Continue/}).click();
 await answer(page,U.TASKS[25]);
 const s=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 expect(s.records[17]).toMatchObject({submitted:'kippuwokaimasu',correct:true});
 expect(s.records[24]).toMatchObject({submitted:'kyouha',correct:false});
 expect(s.records[25]).toMatchObject({submitted:'kippuo',correct:true});
});
test('320px keyboard, corrupted save and concurrent edits preserve external data',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/integrated-reading.html');
 await expect(page.getByRole('link',{name:'Skip to lesson content'})).toBeAttached();
 const bad='{"schema":999,"keep":1}';await page.evaluate(([k,v])=>localStorage.setItem(k,v),[KEY,bad]);
 await page.reload();await expect(page.getByText(/progress is invalid or unavailable/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 19'}).click();
 const field=page.getByRole('textbox',{name:'Type the romaji reading'});await field.fill('KIPPU');await field.press('Enter');
 await expect(page.getByText('Correct.')).toBeVisible();expect(await page.evaluate(k=>localStorage.getItem(k),KEY)).toBe(bad);
 await page.evaluate(k=>localStorage.removeItem(k),KEY);await page.reload();await page.getByRole('button',{name:'Start Unit 19'}).click();
 const other='{"writer":"tab2"}';await page.evaluate(([k,v])=>localStorage.setItem(k,v),[KEY,other]);
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('kippu');
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText(/Another tab changed Unit 19/)).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),KEY)).toBe(other);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
