import { test, expect } from '@playwright/test';

test.describe('Gameplay Loop', () => {
  test.beforeEach(async ({ page }) => {
    // Increase timeout for 3D engine load
    test.setTimeout(60000);
    
    // Log console messages
    page.on('console', msg => console.log(`BROWSER: ${msg.text()}`));
    page.on('pageerror', err => console.log(`BROWSER ERROR: ${err.message}`));

    await page.goto('/?e2e=true');
  });

  test('Complete Awakening Flow', async ({ page }) => {
    // 1. Landing Page
    await page.goto('/?e2e=true');
    await expect(page.locator('h1', { hasText: 'AETHERIA' }).first()).toBeVisible();
    await page.screenshot({ path: 'test-results/screenshots/01-landing.png' });
    
    // 2. Open New Game Modal
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page.getByText('Rise from the Grave')).toBeVisible();
    await page.screenshot({ path: 'test-results/screenshots/02-modal.png' });

    // 3. Select Assassin (Test selection logic)
    await page.getByRole('button', { name: 'Assassin' }).click();
    await expect(page.getByRole('heading', { name: 'Assassin' })).toBeVisible();
    await page.screenshot({ path: 'test-results/screenshots/03-class-selected.png' });
    
    // 4. Roll Stats
    await page.getByRole('button', { name: 'Re-Roll Stats' }).click();
    
    // 5. Embark
    await page.getByRole('button', { name: 'Awaken' }).click();
    
    // 6. Verify Game Load (HUD visible)
    // We wait for the 'Vitality' label which only appears in HUD after load
    await expect(page.getByText('Vitality')).toBeVisible({ timeout: 30000 });
    await page.screenshot({ path: 'test-results/screenshots/04-game-loaded.png' });
    
    // 7. Verify Quest Tracker
    await expect(page.getByText('The Awakening')).toBeVisible();
    
    // 8. Automated Gameplay Verification (E2E Governor)
    // The E2E Governor (activated by ?e2e=true) will autonomously:
    // - Move player to Anchor
    // - Trigger Interaction
    // - Add #e2e-complete div when done
    console.log("Waiting for E2E Governor to complete sequence...");
    await expect(page.locator('#e2e-complete')).toBeVisible({ timeout: 60000 });
    
    // 9. Verify Post-Interaction State
    // Dialogue should have opened
    await expect(page.getByText('Ancient Anchor')).toBeVisible();
    await page.screenshot({ path: 'test-results/screenshots/05-interaction.png' });
  });
});
