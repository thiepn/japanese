import {expect,test} from '@playwright/test';

test('old chart link opens the original chart inside Japanese, not a standalone app',async({page})=>{
  await page.goto('kana/?view=chart');
  await expect(page).toHaveURL(/\/japanese\/?$/,{timeout:20000});
  const primary=page.getByRole('navigation',{name:'Primary'});
  await expect(primary.getByRole('button',{name:'Kana'})).toHaveAttribute('aria-current','page');
  await expect(page.getByRole('navigation',{name:'Kana sections'})
    .getByRole('button',{name:/Kana chart/})).toHaveAttribute('aria-current','page');
  await expect(page.locator('.j2-brand')).toBeVisible();
  await expect(page.getByRole('button',{name:'Back to Japanese app'})).toHaveCount(0);
  await primary.getByRole('button',{name:'Learn'}).click();
  await expect(primary.getByRole('button',{name:'Learn'})).toHaveAttribute('aria-current','page');
});
test('direct Kana lessons resolve one Account-owned workspace',async({page})=>{
  await page.goto('kana/?view=learn');
  await expect(page).toHaveURL(/\/japanese\/?$/,{timeout:20000});
  await expect(page.getByRole('navigation',{name:'Kana sections'})
    .getByRole('button',{name:/Lessons/})).toHaveAttribute('aria-current','page');
  await expect(page.getByText('1. Hiragana Vowels',{exact:false})).toBeVisible();
});
test('cross-tab owner change invalidates the current embedded Kana without exposing old cards',async({page,context})=>{
  await page.goto('./');
  await page.getByRole('navigation',{name:'Primary'}).getByRole('button',{name:'Kana'}).click();
  await expect(page.locator('.kana-native')).toBeVisible();
  const other=await context.newPage();
  await other.goto('./');
  await other.evaluate(()=>{
    localStorage.setItem('thiepn:japanese:kana-owner:v2',
      JSON.stringify({owner:'other-account',epoch:'b'.repeat(32)}));
  });
  await expect(page.getByRole('alert')).toContainText('Account changed');
  await expect(page.locator('.kana-native')).toHaveCount(0);
  await other.close();
});
