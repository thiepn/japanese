import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import * as Y from '../yoon-nhmr-engine.mjs';
import * as U16 from '../yoon-kshch-engine.mjs';
const KEY=Y.STORAGE_KEY;
const SENTINELS=[U16.STORAGE_KEY,'thiepn:kana-foundations:prototype-only:v1','thiepn:account:test','thiepn:fsrs:test'];
async function start(page){
 await page.goto('/yoon-nhmr.html');
 await page.getByRole('button',{name:'Start Unit 17'}).click();
}
async function respond(page,t,value=t.answer){
 if(t.mode==='introduction'&&!t.correction)await page.getByRole('button',{name:'Try recalling '+t.kana}).click();
 if(t.choices){
  const option=t.choices.find(x=>x.value===value);
  expect(option).toBeTruthy();
  await page.getByRole('button',{name:(t.mode==='contrast'?'Character ':'Reading ')+option.label,exact:true}).click();
 }else{
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(value);
  await page.getByRole('button',{name:'Check answer'}).click();
 }
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:/^Continue/}).click();
}
test('Unit 17 complete genuine 39-prompt journey, checkpoint, reload and older-data isolation',async({page},info)=>{
 await page.goto('/yoon-nhmr.html');
 await page.evaluate(keys=>keys.forEach((key,i)=>localStorage.setItem(key,'untouched-'+i)),SENTINELS);
 await expect(page.getByRole('heading',{name:'Read N, H, M and R yōon'})).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 17'}).click();
 if(process.env.CI){mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit17-first.png'});}
 for(let i=0;i<39;i++){
  if(i===18){
   await expect(page.getByRole('heading',{name:'Yōon checkpoint'})).toBeVisible();
   await expect(page.getByText('18 / 18')).toBeVisible();
   await page.reload();
   await expect(page.getByRole('heading',{name:'Yōon checkpoint'})).toBeVisible();
   await page.getByRole('button',{name:'Continue to Stage B · M/R'}).click();
   if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit17-stageb.png'});
  }
  await respond(page,Y.TASKS[i]);
 }
 await expect(page.getByRole('heading',{name:'N/H/M/R yōon completed'})).toBeVisible();
 const x=await page.evaluate(async keys=>({
  saved:JSON.parse(localStorage.getItem('thiepn:kana-foundations:yoon-nhmr:prototype-only:v1')),
  old:keys.map(key=>localStorage.getItem(key)),
  dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(d=>d.name):[]
 }),SENTINELS);
 expect(x.saved.finished).toBe(true);
 expect(x.saved.records).toHaveLength(39);
 expect(x.saved.records.every(r=>r.correct===true&&!r.assisted&&!r.correction)).toBe(true);
 expect(x.saved.records.find(r=>r.taskId==='word-myouji').submitted).toBe('myouji');
 expect(x.saved.records.find(r=>r.taskId==='phrase-cooking').submitted).toBe('ryouriosuru');
 x.old.forEach((value,i)=>expect(value).toBe('untouched-'+i));
 expect(x.dbs).toEqual([]);
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-unit17-complete.png'});
 await page.reload();await expect(page.getByRole('heading',{name:'N/H/M/R yōon completed'})).toBeVisible();
});
test('Unit 17 wrong, reveal and mora errors leave independent first attempts immutable',async({page})=>{
 await start(page);
 for(let i=0;i<39;i++){
  if(i===18)await page.getByRole('button',{name:'Continue to Stage B · M/R'}).click();
  const t=Y.TASKS[i];
  if(i===0){
   await page.getByRole('button',{name:'Try recalling にゃ'}).click();
   await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('niya');
   await page.getByRole('button',{name:'Check answer'}).click();
   await expect(page.getByText('Not quite.')).toBeVisible();
   await page.getByRole('button',{name:/^Continue/}).click();
  }else if(i===13){
   await page.getByRole('button',{name:'Show answer (no credit)'}).click();
   await expect(page.getByText(/Answer revealed/)).toBeVisible();
   await page.getByRole('button',{name:/^Continue/}).click();
  }else if(i===35){
   const opt=t.choices.find(x=>x.value==='2');
   await page.getByRole('button',{name:'Character '+opt.label,exact:true}).click();
   await expect(page.getByText('Not quite.')).toBeVisible();
   await page.getByRole('button',{name:/^Continue/}).click();
  }else await respond(page,t);
 }
 await page.reload();
 for(const id of ['intro-nya','word-nyuugaku','contrast-myouji-mora'])
  await respond(page,{...Y.TASKS.find(x=>x.id===id),correction:true});
 await expect(page.getByRole('heading',{name:'N/H/M/R yōon completed'})).toBeVisible();
 const s=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
 expect(s.corrections).toEqual(['intro-nya','word-nyuugaku','contrast-myouji-mora']);
 expect(s.records.slice(0,39)[0]).toMatchObject({submitted:'niya',correct:false,correction:false});
 expect(s.records[13]).toMatchObject({submitted:'',correct:null,assisted:true,correction:false});
 expect(s.records[35]).toMatchObject({submitted:'2',correct:false,correction:false});
 expect(s.records.slice(-3).every(x=>x.correction&&x.correct===true)).toBe(true);
});
test('Unit 16 completed journey links into Unit 17 but retains Unit 16 evidence',async({page})=>{
 await page.goto('/yoon-kshch.html');
 await page.evaluate(async()=>{
  const M=await import('./yoon-kshch-engine.mjs');
  let s=M.resume(M.initialState());
  for(let i=0;i<M.TASKS.length;i++){
   if(i===M.CHECKPOINT_INDEX)s=M.acknowledgeCheckpoint(s);
   const t=M.taskAt(s);
   if(t.mode==='introduction')s=M.beginRecall(s);
   s=M.advance(M.answer(s,t.answer));
  }
  if(!s.finished)throw Error('Unit 16 fixture invalid');
  localStorage.setItem(M.STORAGE_KEY,JSON.stringify(s));
 });
 await page.reload();
 await expect(page.getByRole('heading',{name:'Yōon foundations completed'})).toBeVisible();
 const prior=await page.evaluate(key=>localStorage.getItem(key),U16.STORAGE_KEY);
 await page.getByRole('link',{name:'Continue to Unit 17 · N/H/M/R'}).click();
 await expect(page.getByRole('heading',{name:'Read N, H, M and R yōon'})).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),U16.STORAGE_KEY)).toBe(prior);
 await page.getByRole('link',{name:'Back to Unit 16'}).click();
 await expect(page.getByRole('heading',{name:'Yōon foundations completed'})).toBeVisible();
});
test('compact keyboard, corrupt snapshot, and concurrent-tab guard never overwrite evidence',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/yoon-nhmr.html');
 await expect(page.getByRole('link',{name:'Skip to lesson content'})).toBeAttached();
 const corrupt='{"schema":999,"keep":"this"}';
 await page.evaluate(([key,v])=>localStorage.setItem(key,v),[KEY,corrupt]);
 await page.reload();
 await expect(page.getByText(/progress is invalid or unavailable/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 17'}).click();
 await page.getByRole('button',{name:'Try recalling にゃ'}).click();
 const field=page.getByRole('textbox',{name:'Type the romaji reading'});
 await field.fill('NYA');await field.press('Enter');
 await expect(page.getByText('Correct.')).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe(corrupt);
 await page.evaluate(key=>localStorage.removeItem(key),KEY);
 await page.reload();
 await page.getByRole('button',{name:'Start Unit 17'}).click();
 const foreign='{"writer":"different-tab"}';
 await page.evaluate(([key,v])=>localStorage.setItem(key,v),[KEY,foreign]);
 await page.getByRole('button',{name:'Try recalling にゃ'}).click();
 await expect(page.getByText(/Another tab changed Unit 17/)).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe(foreign);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
