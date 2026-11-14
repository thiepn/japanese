import {test,expect} from '@playwright/test';

test('Unit 02 is fully learnable, persists separately and can return to the vowel lesson',async({page})=>{
 await page.goto('/k-row.html');
 await expect(page.getByRole('heading',{name:'Learn か・き・く・け・こ'})).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 02'}).click();
 for(const [kana,reading] of [['か','ka'],['き','ki'],['く','ku'],['け','ke'],['こ','ko']]){
  await expect(page.getByRole('heading',{name:'Meet '+kana})).toBeVisible();
  await page.getByRole('button',{name:'Try recalling '+kana}).click();
  const field=page.getByRole('textbox',{name:'Type the romaji reading'});
  await field.fill(reading);
  await field.press('Enter');
  await expect(page.getByText('Correct.')).toBeVisible();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['ka','ki','ku','ke','ko']){
  await page.getByRole('button',{name:'Reading '+reading}).click();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['kao','ike','koe','kiku','koko']){
  await expect(page.getByRole('heading',{name:'Read the word'})).toBeVisible();
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
  await page.getByRole('button',{name:'Check answer'}).click();
  await expect(page.getByText(/Meaning:/)).toBeVisible();
  await page.getByRole('button',{name:/Continue|See next step/}).click();
 }
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 const state=await page.evaluate(async()=>({
  old:localStorage.getItem('thiepn:kana-foundations:prototype-only:v1'),
  unit:JSON.parse(localStorage.getItem('thiepn:kana-foundations:k-row:prototype-only:v1')),
  dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(d=>d.name):[]
 }));
 expect(state.old).toBeNull();
 expect(state.unit.records).toHaveLength(15);
 expect(state.unit.finished).toBe(true);
 expect(state.dbs).toEqual([]);
 await page.reload();
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 await page.getByRole('link',{name:'Return to Unit 01'}).click();
 await expect(page.getByRole('heading',{name:'Read your first Japanese characters'})).toBeVisible();
});

test('Unit 02 wrong and revealed first answers survive reload and get genuine corrections at 320px',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/k-row.html');
 await page.getByRole('button',{name:'Start Unit 02'}).click();
 await page.getByRole('button',{name:'Try recalling か'}).click();
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('ki');
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Not quite.')).toBeVisible();
 await page.reload();
 await expect(page.getByText('Not quite.')).toBeVisible();
 await page.getByRole('button',{name:'Continue'}).click();
 for(const [kana,reading] of [['き','ki'],['く','ku'],['け','ke'],['こ','ko']]){
  await page.getByRole('button',{name:'Try recalling '+kana}).click();
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
  await page.getByRole('button',{name:'Check answer'}).click();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['ka','ki','ku','ke','ko']){
  await page.getByRole('button',{name:'Reading '+reading}).click();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['kao','ike','koe','kiku','koko']){
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
  await page.getByRole('button',{name:'Check answer'}).click();
  await page.getByRole('button',{name:/Continue|See next step/}).click();
 }
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('ka');
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText(/This correction does not replace your first attempt/)).toBeVisible();
 await page.getByRole('button',{name:'Continue'}).click();
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('thiepn:kana-foundations:k-row:prototype-only:v1')));
 expect(saved.records[0].correct).toBe(false);
 expect(saved.records.at(-1).correction).toBe(true);
 expect(saved.records.at(-1).correct).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});

test('Unit 01 completion links to Unit 02 without changing older local evidence',async({page})=>{
 await page.goto('/index.html');
 await page.evaluate(async()=>{
  const old=await import('./engine.mjs');
  const source={...old.initialState(),phase:7,paused:false,introduced:old.VOWELS.map(x=>x.id)};
  localStorage.setItem(old.PROTOTYPE_STORAGE_KEY,JSON.stringify(source));
 });
 await page.reload();
 await expect(page.getByRole('link',{name:/Continue to Unit 02/})).toBeVisible();
 const old=await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:prototype-only:v1'));
 await page.getByRole('link',{name:/Continue to Unit 02/}).click();
 await expect(page.getByRole('heading',{name:'Learn か・き・く・け・こ'})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:prototype-only:v1'))).toBe(old);
});
