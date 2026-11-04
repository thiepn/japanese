import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';

async function capture(page,testInfo,label){
 if(process.env.CI){
  const dir='prototypes/kana-foundations/.visual-evidence';
  mkdirSync(dir,{recursive:true});
  await page.screenshot({path:dir+'/'+testInfo.project.name+'-'+label+'.png',fullPage:true});
 }
}
test('introduction is active and help never silently earns independent recall',async({page},testInfo)=>{
 await page.goto('/index.html');
 await page.getByRole('button',{name:'Start learning'}).click();
 await expect(page.getByRole('button',{name:'Continue'})).toHaveCount(0);
 await page.getByRole('button',{name:'Try recalling あ'}).click();
 await expect(page.getByRole('textbox',{name:'Type the romaji reading'})).toBeFocused();
 await page.getByRole('button',{name:'Need a hint?'}).click();
 await expect(page.getByText(/Recall cue/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Try guided choices'})).toHaveCount(0);
 await capture(page,testInfo,'first-hint');
 await page.getByRole('button',{name:'Show answer (no credit)'}).click();
 await expect(page.getByText(/Answer revealed/)).toBeVisible();
 await page.getByRole('button',{name:'Continue'}).click();
 await page.getByRole('button',{name:'Try recalling い'}).click();
 await page.getByRole('button',{name:'Need a hint?'}).click();
 await page.getByRole('button',{name:'Try guided choices'}).click();
 await expect(page.getByText(/Guided choices/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Reading a'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Reading i'})).toBeVisible();
 await page.getByRole('button',{name:'Reading i'}).click();
 await expect(page.getByText(/recorded as assisted/)).toBeVisible();
 await page.getByRole('button',{name:'Continue'}).click();
 const r=await page.evaluate(()=>JSON.parse(localStorage.getItem('thiepn:kana-foundations:prototype-only:v1')).records);
 expect(r.filter(x=>x.mode==='intro-check')).toEqual(expect.arrayContaining([
  expect.objectContaining({item:'h-a',correct:null,assisted:true,revealed:true}),
  expect.objectContaining({item:'h-i',correct:true,assisted:true})
 ]));
});

test('mistake feedback contrasts the selected wrong vowel and preserves first response',async({page},testInfo)=>{
 await page.goto('/index.html');
 await page.getByRole('button',{name:'Start learning'}).click();
 for(const [kana,reading] of [['あ','a'],['い','i']]){
  await page.getByRole('button',{name:'Try recalling '+kana}).click();
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
  await page.getByRole('button',{name:'Check answer'}).click();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 await page.getByRole('button',{name:'Reading i'}).click();
 await expect(page.getByText(/You chose the reading of/)).toContainText('い');
 await expect(page.getByText(/Not quite/)).toBeVisible();
 await capture(page,testInfo,'incorrect-feedback');
 const record=await page.evaluate(()=>JSON.parse(localStorage.getItem('thiepn:kana-foundations:prototype-only:v1')).records.find(x=>x.mode==='recognition'));
 expect(record).toEqual(expect.objectContaining({item:'h-a',correct:false,submitted:'i',correction:false}));
});

test('unsent recall input and keyboard focus survive hint change',async({page})=>{
 await page.goto('/index.html');
 await page.evaluate(async()=>{
  const engine=await import('./engine.mjs');
  localStorage.setItem(engine.PROTOTYPE_STORAGE_KEY,JSON.stringify({...engine.initialState(),phase:4,paused:false}));
 });
 await page.reload();
 const input=page.getByRole('textbox',{name:'Type the romaji reading'});
 await input.fill('u');
 await input.press('ArrowLeft');
 await page.getByRole('button',{name:'Need a hint?'}).click();
 await expect(input).toHaveValue('u');
 // Changing hints should not clear the partially typed answer.
 await input.fill('u');
 await input.press('Enter');
 await expect(page.getByText(/recorded as assisted/)).toBeVisible();
});

test('weak items can be practiced without rewriting first assessments',async({page},testInfo)=>{
 await page.goto('/index.html');
 await page.evaluate(async()=>{
  const m=await import('./engine.mjs');
  const s={...m.initialState(),phase:7,paused:false,records:[
   {stage:'recall',mode:'recall',item:'h-u',correct:false,assisted:false,correction:false,practiceOnly:false,submitted:'o',at:'2026-11-05T00:00:00Z'}
  ]};
  localStorage.setItem(m.PROTOTYPE_STORAGE_KEY,JSON.stringify(s));
 });
 await page.reload();
 await expect(page.getByRole('button',{name:'Practice 1 weak character'})).toBeVisible();
 await capture(page,testInfo,'weak-character-results');
 await page.getByRole('button',{name:'Practice 1 weak character'}).click();
 await expect(page.getByRole('heading',{name:'Type the reading'})).toBeVisible();
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('u');
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText(/Practice-only correct answer/)).toBeVisible();
 await page.getByRole('button',{name:'Continue'}).click();
 await expect(page.getByRole('heading',{name:'Your five-vowel results'})).toBeVisible();
 const summary=await page.evaluate(async()=>{
  const m=await import('./engine.mjs');return m.firstAttemptSummary(
   JSON.parse(localStorage.getItem(m.PROTOTYPE_STORAGE_KEY)));
 });
 expect(summary.recall).toEqual({correct:0,total:1,skipped:0,assisted:0});
 expect(summary.needsPractice).toEqual(['h-u']);
});
test('compact viewport has no horizontal overflow on guided, correction or results screens',async({page})=>{
 await page.goto('/index.html');
 for(const state of [
  {phase:0,introStep:'check',hintLevel:1,hint:true},
  {phase:3,feedback:{correct:false,expected:'a',submitted:'o'}},
  {phase:4,hintLevel:2,hint:true},
  {phase:7}
 ]){
  await page.evaluate(async overrides=>{
   const m=await import('./engine.mjs');
   localStorage.setItem(m.PROTOTYPE_STORAGE_KEY,JSON.stringify({...m.initialState(),paused:false,...overrides}));
  },state);
  await page.reload();
  const {scrollWidth,width}=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,width:innerWidth}));
  expect(scrollWidth).toBeLessThanOrEqual(width+1);
 }
});
