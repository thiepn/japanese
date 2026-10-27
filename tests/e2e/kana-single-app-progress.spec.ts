import {expect,test,type Page} from '@playwright/test';

const primary=(page:Page)=>page.getByRole('navigation',{name:'Primary'});
const sections=(page:Page)=>page.getByRole('navigation',{name:'Kana sections'});

async function canonicalReviewCount(page:Page):Promise<number>{
  return page.evaluate(async()=>{
    const owner='00000000-0000-4000-8000-000000000001';
    const request=indexedDB.open('thiepn-japanese:'+owner);
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
    try{
      return await new Promise<number>((resolve,reject)=>{
        const tx=db.transaction('study_events','readonly');
        const get=tx.objectStore('study_events').getAll();
        tx.oncomplete=()=>resolve(get.result.length);
        tx.onerror=()=>reject(tx.error);
      });
    }finally{db.close();}
  });
}

test('introducing Kana updates Japanese-owned due count and grading clears it',async({page})=>{
  await page.goto('./');
  await primary(page).getByRole('button',{name:'Kana'}).click();
  await sections(page).getByRole('button',{name:/Lessons/}).click();
  await page.getByRole('button',{name:'Start',exact:true}).first().click();
  await page.getByRole('button',{name:'Next Character'}).click();

  const reviewTab=sections(page).getByRole('button',{name:/Flashcards/});
  await expect(reviewTab.getByLabel('1 Kana reviews due')).toBeVisible();
  await reviewTab.click();
  const input=page.getByPlaceholder('Type romaji... (or Space to reveal)');
  await input.fill('a');
  await input.press('Enter');
  await page.getByRole('button',{name:/3. Good/}).click();

  await expect(reviewTab.locator('.j2-kana-route__due')).toHaveCount(0);
  await expect.poll(()=>canonicalReviewCount(page)).toBe(1);
  await expect(primary(page).getByRole('button',{name:'Kana'})).toHaveAttribute('aria-current','page');
});

test('Kana-chart row drill never mutates Japanese FSRS, then native Flashcards resets to scheduled queue',async({page})=>{
  await page.goto('./');
  await primary(page).getByRole('button',{name:'Kana'}).click();
  await sections(page).getByRole('button',{name:/Kana chart/}).click();
  await page.locator('button[title^="Drill "]').first().click();
  await expect(page.getByText('Cram',{exact:true})).toBeVisible();
  await expect(sections(page).getByRole('button',{name:/Flashcards/})).toHaveAttribute('aria-current','page');

  const input=page.getByPlaceholder('Type romaji... (or Space to reveal)');
  await input.press('Enter');
  await page.getByRole('button',{name:/1. Again/}).click();
  expect(await canonicalReviewCount(page)).toBe(0);

  await sections(page).getByRole('button',{name:/Flashcards/}).click();
  await expect(page.getByText('Cram',{exact:true})).toHaveCount(0);
  await expect(page.getByPlaceholder('Type romaji... (or Space to reveal)')).toBeVisible();
  expect(await canonicalReviewCount(page)).toBe(0);
});

test('mobile six-way Japanese navigation remains on one row and active Kana section stays in sight',async({page,isMobile})=>{
  test.skip(!isMobile);
  await page.setViewportSize({width:320,height:700});
  await page.goto('./');
  const nav=primary(page);
  await expect(nav.getByRole('button')).toHaveCount(6);
  const positions=await nav.getByRole('button').evaluateAll(items=>
    items.map(item=>Math.round(item.getBoundingClientRect().top)));
  expect(Math.max(...positions)-Math.min(...positions)).toBeLessThanOrEqual(2);

  await nav.getByRole('button',{name:'Kana'}).click();
  await sections(page).getByRole('button',{name:/Overview/}).click();
  await page.getByRole('button',{name:/Explore Vocabulary/}).click();
  const visible=await sections(page).evaluate(container=>{
    const selected=container.querySelector('[aria-current="page"]') as HTMLElement|null;
    if(!selected)return false;
    const bounds=container.getBoundingClientRect();
    const tab=selected.getBoundingClientRect();
    return tab.left>=bounds.left-2&&tab.right<=bounds.right+2;
  });
  expect(visible).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth))
    .toBeLessThanOrEqual(1);
});
