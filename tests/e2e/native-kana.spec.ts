import {expect,test} from '@playwright/test';

test('native Kana is part of Japanese primary navigation, with all Google learning views',async({page})=>{
  await page.goto('./');
  await page.getByRole('navigation',{name:'Primary'}).getByRole('button',{name:'Kana'}).click();
  await expect(page).toHaveURL(/\/japanese\/?$/);
  await expect(page.getByRole('heading',{name:'Kana',exact:true})).toBeVisible();
  await expect(page.getByRole('navigation',{name:'Primary'}).getByRole('button',{name:'Kana'}))
    .toHaveAttribute('aria-current','page');
  await expect(page.getByRole('navigation',{name:'Kana sections'})).toBeVisible();
  await page.getByRole('navigation',{name:'Kana sections'}).getByRole('button',{name:'Lessons'}).click();
  await expect(page.getByText('1. Hiragana Vowels', {exact:false})).toBeVisible();
  await page.getByRole('navigation',{name:'Kana sections'}).getByRole('button',{name:'Flashcards'}).click();
  await expect(page.getByRole('button',{name:'Back to Japanese app'})).toHaveCount(0);
  await page.getByRole('navigation',{name:'Kana sections'}).getByRole('button',{name:'Words'}).click();
  await page.getByRole('navigation',{name:'Kana sections'}).getByRole('button',{name:'Kana chart'}).click();
  await expect(page.locator('.kana-native')).toBeVisible();
  await page.getByRole('button',{name:'Settings & backup'}).click();
  await expect(page.getByRole('dialog',{name:'',exact:true}).first()).toBeVisible();
  await expect(page.getByText('Export Progress',{exact:false})).toBeVisible();
});
test('older public Kana link resolves into the same Japanese native section',async({page})=>{
  await page.goto('kana/?view=review');
  await expect(page).toHaveURL(/\/japanese\/?$/);
  await expect(page.getByRole('navigation',{name:'Primary'}).getByRole('button',{name:'Kana'})).toHaveAttribute('aria-current','page');
  await expect(page.getByRole('navigation',{name:'Kana sections'}).getByRole('button',{name:/Flashcards/})).toHaveAttribute('aria-current','page');
});
test('Kana retains native Japanese header on mobile and has no horizontal overflow',async({page,isMobile})=>{
  if(!isMobile)test.skip();
  await page.goto('./');
  await page.getByRole('navigation',{name:'Primary'}).getByRole('button',{name:'Kana'}).click();
  await expect(page.locator('.j2-brand')).toBeVisible();
  await expect(page.locator('.kana-native')).toBeVisible();
  const width=await page.evaluate(()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth]);
  expect(width[0]).toBeLessThanOrEqual(width[1]+1);
});
