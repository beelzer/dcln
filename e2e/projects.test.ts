import { test, expect } from '@playwright/test';

test.describe('Projects', () => {
  test('projects page shows project cards', async ({ page }) => {
    await page.goto('/projects/');
    const cards = page.locator('article');
    await expect(cards).not.toHaveCount(0);
  });

  test('project cards link to detail pages', async ({ page }) => {
    await page.goto('/projects/');
    const firstCardLink = page.locator('article a').first();
    const href = await firstCardLink.getAttribute('href');
    expect(href).toMatch(/^\/projects\/.+/);
  });

  test('project detail page renders correctly', async ({ page }) => {
    await page.goto('/projects/');
    const firstCardLink = page.locator('article a').first();
    const href = await firstCardLink.getAttribute('href');
    await page.goto(href!);
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
