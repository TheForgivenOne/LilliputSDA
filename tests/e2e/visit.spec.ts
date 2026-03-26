import { test, expect } from '@playwright/test';

test.describe('Visit Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/visit');
  });

  test('page hero renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Plan Your Visit' })).toBeVisible();
  });

  test('What to Expect section renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'What to Expect' })).toBeVisible();
  });

  test('FAQ section renders', async ({ page }) => {
    await expect(page.getByText('Common Questions')).toBeVisible();
  });
});
