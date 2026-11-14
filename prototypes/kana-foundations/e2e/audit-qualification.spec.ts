import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';

test('skipped unavailable listening is shown as not assessed, not a failing numerical score',async({page},testInfo)=>{
 await page.goto('/index.html');
 await page.evaluate(async()=>{
  const m=await import('./engine.mjs');
  const base=m.initialState();
  const records=m.VOWELS.map(v=>({
   stage:'listening',mode:'listening',item:v.id,correct:null,assisted:false,
   correction:false,practiceOnly:false,skipped:true,submitted:null,at:'2026-11-05T10:00:00.000Z'
  }));
  localStorage.setItem(m.PROTOTYPE_STORAGE_KEY,JSON.stringify({
   ...base,phase:7,paused:false,introduced:m.VOWELS.map(v=>v.id),records
  }));
 });
 await page.reload();
 const tile=page.locator('.metric').filter({hasText:'Listening'});
 await expect(tile.getByText('Not assessed')).toBeVisible();
 await expect(tile.getByText('5 skipped')).toBeVisible();
 await expect(tile).not.toContainText('0 / 5');
 if(process.env.CI){
  mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});
  await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+testInfo.project.name+'-s1-audited-listening-metric.png',fullPage:true});
 }
});
test('assisted practice cue is character-specific, actionable and remains ungraded',async({page},testInfo)=>{
 await page.goto('/index.html');
 await page.evaluate(async()=>{
  const m=await import('./engine.mjs');
  localStorage.setItem(m.PROTOTYPE_STORAGE_KEY,JSON.stringify({
   ...m.initialState(),phase:7,paused:false,introduced:m.VOWELS.map(v=>v.id)
  }));
 });
 await page.reload();
 await page.getByRole('button',{name:'Start 15-question mixed practice'}).click();
 const p=await page.evaluate(async()=>{
  const m=await import('./engine.mjs');
  return m.currentPracticePrompt(JSON.parse(localStorage.getItem(m.PROTOTYPE_STORAGE_KEY)));
 });
 await page.getByRole('button',{name:'Need a hint?'}).click();
 const cue=page.locator('.practice-screen .hint');
 await expect(cue).toContainText('strokes');
 await expect(cue).toContainText('Recall cue');
 const vowel=await page.evaluate(async id=>{
  const m=await import('./engine.mjs');return m.vowel(id);
 },p.kanaIds[0]);
 await expect(cue).toContainText(String(vowel.strokes));
 if(process.env.CI){
  mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});
  await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+testInfo.project.name+'-s1-audited-hint.png',fullPage:true});
 }
 await page.locator('button[data-practice-value="'+p.answer+'"]').click();
 const evidence=await page.evaluate(async()=>{
  const m=await import('./engine.mjs');
  return JSON.parse(localStorage.getItem(m.PROTOTYPE_STORAGE_KEY)).practiceSession.attempts.at(-1);
 });
 expect(evidence).toMatchObject({correct:true,assistanceLevel:'cue',independent:false,practiceOnly:true,canonicalEligible:false});
});
