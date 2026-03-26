import { test, expect } from '@playwright/test';

test.describe('Ministries Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ministries');
  });

  test('page renders correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Our Ministries' })).toBeVisible();
  });
});
