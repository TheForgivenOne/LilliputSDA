import { test, expect } from '@playwright/test';

test.describe('Events Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/events');
  });

  test('page hero renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Events & News' })).toBeVisible();
  });

  test('tabs are visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^Events$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^News$/i })).toBeVisible();
  });

  test('sidebar renders', async ({ page }) => {
    await expect(page.getByText('Stay Updated')).toBeVisible();
  });
});
