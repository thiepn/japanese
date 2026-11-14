import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import * as Y from '../yoon-gjbp-engine.mjs';
import * as U17 from '../yoon-nhmr-engine.mjs';
const KEY=Y.STORAGE_KEY;
const SENTINELS=[U17.STORAGE_KEY,'thiepn:kana-foundations:prototype-only:v1',
 'thiepn:kana-foundations:yoon-kshch:prototype-only:v1','thiepn:account:test','thiepn:fsrs:test'];
async function start(page){
 await page.goto('/yoon-gjbp.html');
 await page.getByRole('button',{name:'Start Unit 18'}).click();
}
async function respond(page,t,value=t.answer){
 if(t.mode==='introduction'&&!t.correction)
  await page.getByRole('button',{name:'Try recalling '+t.kana}).click();
 if(t.choices){
  const c=t.choices.find(x=>x.value===value);
  expect(c).toBeTruthy();
  await page.getByRole('button',{name:(t.mode==='contrast'?'Character ':'Reading ')+c.label,exact:true}).click();
 }else{
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(value);
  await page.getByRole('button',{name:'Check answer'}).click();
 }
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:/^Continue/}).click();
}
test('Unit 18 complete 42-prompt journey, saved checkpoint, old-data isolation in each browser',async({page},info)=>{
 await page.goto('/yoon-gjbp.html');
 await page.evaluate(keys=>keys.forEach((key,i)=>localStorage.setItem(key,'unchanged-'+i)),SENTINELS);
 await expect(page.getByRole('heading',{name:'Read G, J, B and P yōon'})).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 18'}).click();
 if(process.env.CI){mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit18-first.png'});}
 for(let i=0;i<42;i++){
  if(i===20){
   await expect(page.getByRole('heading',{name:'Voiced yōon checkpoint'})).toBeVisible();
   await expect(page.getByText('20 / 20')).toBeVisible();
   await page.reload();
   await expect(page.getByRole('heading',{name:'Voiced yōon checkpoint'})).toBeVisible();
   await page.getByRole('button',{name:'Continue to Stage B · B/P'}).click();
   if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit18-stageb.png'});
  }
  await respond(page,Y.TASKS[i]);
 }
 await expect(page.getByRole('heading',{name:'G/J/B/P yōon completed'})).toBeVisible();
 const x=await page.evaluate(async keys=>({
  s:JSON.parse(localStorage.getItem('thiepn:kana-foundations:yoon-gjbp:prototype-only:v1')),
  old:keys.map(key=>localStorage.getItem(key)),
  dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(d=>d.name):[]
 }),SENTINELS);
 expect(x.s.finished).toBe(true);expect(x.s.checkpointPassed).toBe(true);
 expect(x.s.records).toHaveLength(42);
 expect(x.s.records.every(r=>r.correct===true&&!r.assisted&&!r.correction)).toBe(true);
 expect(x.s.records.find(r=>r.taskId==='word-jugyou').submitted).toBe('jugyou');
 expect(x.s.records.find(r=>r.taskId==='word-happyaku').submitted).toBe('happyaku');
 expect(x.s.records.find(r=>r.taskId==='phrase-milk').submitted).toBe('gyuunyuuonomimasu');
 x.old.forEach((value,i)=>expect(value).toBe('unchanged-'+i));
 expect(x.dbs).toEqual([]);
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit18-complete.png'});
 await page.reload();
 await expect(page.getByRole('heading',{name:'G/J/B/P yōon completed'})).toBeVisible();
});
test('wrong, revealed and wrong 800-mora answers preserve first evidence through corrections',async({page})=>{
 await start(page);
 for(let i=0;i<42;i++){
  if(i===20)await page.getByRole('button',{name:'Continue to Stage B · B/P'}).click();
  const t=Y.TASKS[i];
  if(i===0){
   await page.getByRole('button',{name:'Try recalling ぎゃ'}).click();
   await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('giya');
   await page.getByRole('button',{name:'Check answer'}).click();
   await expect(page.getByText('Not quite.')).toBeVisible();
   await page.getByRole('button',{name:/^Continue/}).click();
  }else if(i===13){
   await page.getByRole('button',{name:'Show answer (no credit)'}).click();
   await expect(page.getByText(/Answer revealed/)).toBeVisible();
   await page.getByRole('button',{name:/^Continue/}).click();
  }else if(i===39){
   await page.getByRole('button',{name:'Character 3 morae',exact:true}).click();
   await expect(page.getByText('Not quite.')).toBeVisible();
   await page.getByRole('button',{name:/^Continue/}).click();
  }else await respond(page,t);
 }
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await page.reload();
 for(const id of ['intro-gya','word-gyuunyuu','contrast-happyaku-mora'])
  await respond(page,{...Y.TASKS.find(t=>t.id===id),correction:true});
 await expect(page.getByRole('heading',{name:'G/J/B/P yōon completed'})).toBeVisible();
 const s=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(s.corrections).toEqual(['intro-gya','word-gyuunyuu','contrast-happyaku-mora']);
 expect(s.records).toHaveLength(45);
 expect(s.records[0]).toMatchObject({submitted:'giya',correct:false,correction:false});
 expect(s.records[13]).toMatchObject({submitted:'',correct:null,assisted:true,correction:false});
 expect(s.records[39]).toMatchObject({submitted:'3',correct:false,correction:false});
 expect(s.records.slice(-3).every(r=>r.correction&&r.correct===true)).toBe(true);
});
test('Unit 17 completion links to Unit 18 without changing Unit 17 scores or progress',async({page})=>{
 await page.goto('/yoon-nhmr.html');
 await page.evaluate(async()=>{
  const M=await import('./yoon-nhmr-engine.mjs');
  let s=M.resume(M.initialState());
  for(let i=0;i<M.TASKS.length;i++){
   if(i===M.CHECKPOINT_INDEX)s=M.acknowledgeCheckpoint(s);
   const t=M.taskAt(s);
   if(t.mode==='introduction')s=M.beginRecall(s);
   s=M.advance(M.answer(s,t.answer));
  }
  if(!s.finished)throw Error('Unit17 fixture invalid');
  localStorage.setItem(M.STORAGE_KEY,JSON.stringify(s));
 });
 await page.reload();
 await expect(page.getByRole('heading',{name:'N/H/M/R yōon completed'})).toBeVisible();
 const prior=await page.evaluate(key=>localStorage.getItem(key),U17.STORAGE_KEY);
 await page.getByRole('link',{name:'Continue to Unit 18 · G/J/B/P'}).click();
 await expect(page.getByRole('heading',{name:'Read G, J, B and P yōon'})).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),U17.STORAGE_KEY)).toBe(prior);
 await page.getByRole('link',{name:'Back to Unit 17'}).click();
 await expect(page.getByRole('heading',{name:'N/H/M/R yōon completed'})).toBeVisible();
});
test('checkpoint is explicit and retained across pause/refresh; cannot silently advance',async({page})=>{
 await start(page);
 for(let i=0;i<20;i++)await respond(page,Y.TASKS[i]);
 await expect(page.getByRole('heading',{name:'Voiced yōon checkpoint'})).toBeVisible();
 const before=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 await page.getByRole('button',{name:'Exit and resume later'}).click();
 await expect(page.getByRole('heading',{name:'Read G, J, B and P yōon'})).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:'Resume Unit 18'}).click();
 await expect(page.getByRole('heading',{name:'Voiced yōon checkpoint'})).toBeVisible();
 const after=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(after.records).toEqual(before.records);
 expect(after.checkpointPassed).toBe(false);
 expect(after.index).toBe(20);
 await page.getByRole('button',{name:'Continue to Stage B · B/P'}).click();
 await expect(page.getByRole('heading',{name:'Meet びゃ'})).toBeVisible();
 expect((await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY)).records).toHaveLength(20);
});
test('only explicit J-row aliases are accepted; long-vowel and full-size confusions remain wrong',async({page})=>{
 await start(page);
 await page.getByRole('button',{name:'Try recalling ぎゃ'}).click();
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('giya');
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Not quite.')).toBeVisible();
 await page.getByRole('button',{name:/^Continue/}).click();
 for(let i=1;i<3;i++)await respond(page,Y.TASKS[i]);
 await page.getByRole('button',{name:'Try recalling じゃ'}).click();
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('zya');
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:/^Continue/}).click();
 const records=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).records,KEY);
 expect(records[0]).toMatchObject({submitted:'giya',correct:false});
 expect(records[3]).toMatchObject({submitted:'zya',correct:true,assisted:false});
});
test('corrupt save and cross-tab change fail closed; compact keyboard and layout remain usable',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/yoon-gjbp.html');
 await expect(page.getByRole('link',{name:'Skip to lesson content'})).toBeAttached();
 const corrupt='{"schema":900,"owner":"retain"}';
 await page.evaluate(([key,value])=>localStorage.setItem(key,value),[KEY,corrupt]);
 await page.reload();
 await expect(page.getByText(/progress is invalid or unavailable/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 18'}).click();
 await page.getByRole('button',{name:'Try recalling ぎゃ'}).click();
 const field=page.getByRole('textbox',{name:'Type the romaji reading'});
 await field.fill('GYA');await field.press('Enter');
 await expect(page.getByText('Correct.')).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe(corrupt);
 await page.evaluate(key=>localStorage.removeItem(key),KEY);
 await page.reload();
 await page.getByRole('button',{name:'Start Unit 18'}).click();
 const foreign='{"schema":500,"another":"writer"}';
 await page.evaluate(([key,value])=>localStorage.setItem(key,value),[KEY,foreign]);
 await page.getByRole('button',{name:'Try recalling ぎゃ'}).click();
 await expect(page.getByText(/Another tab changed Unit 18/)).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe(foreign);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
