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

  test('The Gauntlet: Complete Awakening & Interaction', async ({ page }) => {
    // 1. Landing Page
    await page.goto('/?autopilot=true&e2e=true'); // Both flags just in case, but autopilot drives AI
    await expect(page.locator('h1', { hasText: 'AETHERIA' }).first()).toBeVisible();
    
    // 2. Open New Game Modal
    await page.getByRole('button', { name: 'New Game' }).click();
    
    // 3. Class Selection (Dread Knight)
    await page.getByRole('button', { name: 'Dread Knight' }).click();
    await expect(page.getByRole('heading', { name: 'Dread Knight' })).toBeVisible();
    
    // 4. Embark
    await page.getByRole('button', { name: 'Awaken' }).click();
    
    // 5. Game Load Check
    // Wait for the 'Vitality' HUD element to signify the UI Layer is active
    await expect(page.getByText('Vitality')).toBeVisible({ timeout: 45000 });
    
    // Wait for the Canvas to be present and stable
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // 6. Interaction Logic (Verified by E2E Governor)
    console.log("Monitoring autonomous interaction...");
    
    // The E2E Governor will seek the anchor at (0,0)
    // We wait for the Dialogue UI to pop up, proving:
    // a) Player spawned and moved
    // b) Anchor spawned in the correct chunk
    // c) Raycasting worked
    // d) Narrative state machine updated
    const dialogueBox = page.getByText('Ancient Anchor');
    await expect(dialogueBox).toBeVisible({ timeout: 60000 });
    
    // 7. Verify Quest Progress
    // After interaction, the quest objective should update or dialogue should show options
    const attuneButton = page.getByRole('button', { name: /Attune/i });
    await expect(attuneButton).toBeVisible({ timeout: 10000 });
    await attuneButton.click();
    
    // Capture visual state of the world + UI
    await page.screenshot({ path: 'test-results/screenshots/gauntlet-complete.png', fullPage: true });
    
    // 8. Clean Exit
    console.log("Gauntlet Success: Awakening Cycle Verified.");
  });
});
