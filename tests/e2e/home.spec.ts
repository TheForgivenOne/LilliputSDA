import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hero section renders with title and subtitle', async ({ page }) => {
    await expect(page.getByText('Welcome to', { exact: true })).toBeVisible();
    await expect(page.getByText('Lilliput SDA Church').first()).toBeVisible();
  });

  test('quick info cards are visible', async ({ page }) => {
    await expect(page.getByText('Sabbath Service')).toBeVisible();
    await expect(page.getByText('Location')).toBeVisible();
    await expect(page.getByText('Livestream')).toBeVisible();
  });

  test('about section renders', async ({ page }) => {
    await expect(page.getByText('A Place to Belong')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Learn Our Story' })).toBeVisible();
  });

  test('events section renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Upcoming Events' })).toBeVisible();
  });

  test('announcements section renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Announcements' }).first()).toBeVisible();
  });

  test('ministry section renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Our Ministries' })).toBeVisible();
  });

  test('CTA section renders', async ({ page }) => {
    await expect(page.getByText('Ready to Visit?')).toBeVisible();
  });

  test('footer is visible', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
