import { test, expect } from '@playwright/test';

test.describe('Page Load Smoke Tests', () => {
  const pages = [
    { path: '/', name: 'Home' },
    { path: '/about', name: 'About' },
    { path: '/ministries', name: 'Ministries' },
    { path: '/media', name: 'Media' },
    { path: '/events', name: 'Events' },
    { path: '/contact', name: 'Contact' },
    { path: '/visit', name: 'Visit' },
    { path: '/decision', name: 'Decision' },
  ];

  pages.forEach(({ path, name }) => {
    test(`${name} page loads without errors`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.goto(path);
      await expect(page).toHaveTitle(/Lilliput SDA/i);
      await expect(page.locator('header')).toBeVisible();

      const criticalErrors = consoleErrors.filter(
        err => !err.includes('Warning') && !err.includes('hydration')
      );
      expect(criticalErrors).toHaveLength(0);
    });
  });
});
