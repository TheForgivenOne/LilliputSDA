import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('desktop nav links navigate correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    const navLinks = [
      { href: '/about', label: 'About' },
      { href: '/ministries', label: 'Ministries' },
      { href: '/media', label: 'Media' },
      { href: '/events', label: 'Events' },
      { href: '/contact', label: 'Contact' },
    ];

    for (const { href, label } of navLinks) {
      const link = page.locator('nav').getByRole('link', { name: label });
      await expect(link).toBeVisible({ timeout: 10000 });
      await link.click();
      await expect(page).toHaveURL(new RegExp(href), { timeout: 10000 });
    }
  });

  test('mobile menu button is visible on small viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const menuButton = page.locator('button[aria-label="Open menu"]');
    await expect(menuButton).toBeVisible({ timeout: 10000 });
  });

  test('Join Us button navigates to /visit', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    
    const joinButton = page.locator('header a[href="/visit"]');
    await expect(joinButton).toBeVisible({ timeout: 10000 });
    await joinButton.click();
    await expect(page).toHaveURL(/visit/, { timeout: 10000 });
  });

  test('Decision Card trigger exists in header', async ({ page }) => {
    await page.goto('/');
    const decisionButton = page.locator('header button:has-text("Decision Card")');
    await expect(decisionButton).toBeVisible({ timeout: 10000 });
  });
});
