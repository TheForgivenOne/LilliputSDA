import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('page hero renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
  });

  test('contact form renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'General' })).toBeVisible();
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Message')).toBeVisible();
  });

  test('map section renders', async ({ page }) => {
    await expect(page.getByText('Find Us')).toBeVisible();
  });
});
