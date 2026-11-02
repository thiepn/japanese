import { expect, test } from '@playwright/test';

test('embedded Kana owns one navigation and opens shortcuts only through Japanese tools', async ({ page }) => {
  await page.goto('./');
  const primary = page.getByRole('navigation', { name: 'Primary' });
  await primary.getByRole('button', { name: 'Kana', exact: true }).click();
  const workspace = page.getByRole('region', { name: 'Kana learning' });
  await expect(workspace.locator('.kana-native')).toBeVisible();
  const sections = page.getByRole('navigation', { name: 'Kana sections' });
  await expect(sections.getByRole('button')).toHaveCount(5);
  await expect(primary.getByRole('button', { name: 'Kana', exact: true })).toHaveAttribute('aria-current', 'page');

  // Embedded '?' must not open Kana's independent keyboard dialog.
  await page.keyboard.press('Shift+/');
  await expect(workspace.getByRole('heading', { name: 'Keyboard Navigation' })).toHaveCount(0);

  // Japanese's explicit Study tools action remains the single entry point.
  await page.getByRole('button', { name: 'Study tools' }).click();
  await page.getByRole('button', { name: 'Keyboard shortcuts' }).click();
  await expect(workspace.getByRole('heading', { name: 'Keyboard Navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(workspace.getByRole('heading', { name: 'Keyboard Navigation' })).toHaveCount(0);
});

test('Kana section navigation stays operable and contained on narrow viewports', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('./');
  await page.getByRole('navigation', { name: 'Primary' })
    .getByRole('button', { name: 'Kana', exact: true }).click();
  const workspace = page.getByRole('region', { name: 'Kana learning' });
  await expect(workspace.locator('.kana-native')).toBeVisible();
  const sections = page.getByRole('navigation', { name: 'Kana sections' });
  for (const name of ['Lessons', 'Words', 'Kana chart', 'Overview', 'Flashcards'] as const) {
    const destination = sections.getByRole('button', { name: new RegExp(name) });
    await destination.click();
    await expect(destination).toHaveAttribute('aria-current', 'page');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  }
});
