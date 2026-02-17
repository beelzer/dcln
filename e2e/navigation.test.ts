import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/dcln\.me/);
  });

  test('homepage shows featured projects heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h2', { hasText: 'Featured Projects' })).toBeVisible();
  });

  test('projects page renders correctly', async ({ page }) => {
    await page.goto('/projects/');
    await expect(page.locator('h1', { hasText: 'Projects' })).toBeVisible();
  });

  test('about page renders correctly', async ({ page }) => {
    await page.goto('/about/');
    await expect(page.locator('h1', { hasText: 'About' })).toBeVisible();
  });

  test('nav links point to correct pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav a[href="/projects"]')).toBeVisible();
    await expect(page.locator('nav a[href="/about"]')).toBeVisible();
  });

  test('logo links to homepage', async ({ page }) => {
    await page.goto('/about/');
    await expect(page.locator('a.header__logo[href="/"]')).toBeVisible();
  });
});
