import { test, expect } from '@playwright/test';

test.describe('Gameplay Loop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('New Game Flow', async ({ page }) => {
    // 1. Landing Page
    // Target the main landing title specifically
    await expect(page.locator('h1.text-6xl')).toHaveText('AETHERIA');
    await expect(page.getByText('The Fractured Realm')).toBeVisible();
    
    // 2. Open New Game Modal
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page.getByText('Rise from the Grave')).toBeVisible();

    // 3. Select Class (Warrior default)
    // Check that the heading with class details is visible
    await expect(page.getByRole('heading', { name: 'Dread Knight' })).toBeVisible();
    
    // 4. Roll Stats
    await page.locator('text=STR').locator('xpath=..').textContent();
    // Re-roll
    await page.getByRole('button', { name: 'Re-Roll Stats' }).click();
    // (Value might change, but tough to assert determinism without seed input)
    
    // 5. Embark
    await page.getByRole('button', { name: 'Awaken' }).click();
    
    // 6. Verify Game Load (HUD visible)
    await expect(page.locator('.glass-metallic').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Vitality')).toBeVisible();
    
    // 7. Verify Quest Tracker
    await expect(page.getByText('The Awakening')).toBeVisible();
    await expect(page.getByText('Inspect the Ancient Anchor')).toBeVisible();
  });
});
