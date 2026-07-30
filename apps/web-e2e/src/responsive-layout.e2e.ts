import { expect, test } from './fixtures';

test.describe('responsive workspace navigation', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('keeps the mobile rail actions horizontal and fully visible', async ({
        page,
    }) => {
        await page.goto('/');

        const rail = page.locator('app-workspace-shell-rail .app-rail');
        const linkGroups = rail.locator('.rail-links');
        await expect(rail).toBeVisible();
        await expect(linkGroups.first()).toHaveCSS('flex-direction', 'row');

        const layout = await rail.evaluate((railElement) => {
            const railRect = railElement.getBoundingClientRect();
            const actionBoxes = Array.from(
                railElement.querySelectorAll('a')
            ).map((action) => {
                const rect = action.getBoundingClientRect();
                return {
                    top: rect.top,
                    bottom: rect.bottom,
                };
            });
            return {
                actionBoxes,
                railTop: railRect.top,
                railBottom: railRect.bottom,
            };
        });

        expect(layout.actionBoxes.length).toBeGreaterThanOrEqual(3);
        for (const box of layout.actionBoxes) {
            expect(box.top).toBeGreaterThanOrEqual(layout.railTop);
            expect(box.bottom).toBeLessThanOrEqual(layout.railBottom);
        }
    });
});
