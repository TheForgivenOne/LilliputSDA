import { test, expect } from '@playwright/test';

test.describe('Media Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/media');
  });

  test('page renders correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sermons & Media' })).toBeVisible();
  });

  test('search input is visible', async ({ page }) => {
    await expect(page.getByPlaceholder('Search videos...')).toBeVisible();
  });

  test('youtube subscribe section renders', async ({ page }) => {
    await expect(page.getByText('Subscribe on YouTube')).toBeVisible();
  });
});
