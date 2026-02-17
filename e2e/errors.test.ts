import { test, expect } from '@playwright/test';

test.describe('Error pages', () => {
  test('404 page renders for invalid routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page.locator('text=404')).toBeVisible();
    await expect(page.locator('text=Page not found')).toBeVisible();
  });

  test('404 page go-home link navigates to homepage', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await page.click('a[href="/"]');
    await page.waitForURL('/');
    await expect(page.locator('h1', { hasText: 'Declan' })).toBeVisible();
  });
});
