import { expect, test } from './fixtures';

test.describe('responsive workspace navigation', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('keeps mobile navigation collapsed and closes the native drawer', async ({
        page,
    }) => {
        await page.goto('/');

        const rail = page.locator('app-workspace-shell-rail .app-rail');
        const toggle = rail.locator('.mobile-menu-toggle');
        const drawer = rail.locator('.rail-navigation');
        await expect(rail).toBeVisible();
        await expect(toggle).toBeVisible();
        await expect(drawer).toBeHidden();

        await toggle.click();
        await expect(drawer).toBeVisible();
        await expect(drawer.locator('.rail-links').first()).toHaveCSS(
            'flex-direction',
            'column'
        );

        const closeButton = drawer.locator('.mobile-menu-close');
        await expect(closeButton).toBeVisible();
        await closeButton.click();
        await expect(drawer).toBeHidden();

        await toggle.click();
        await expect(drawer).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(drawer).toBeHidden();
    });

    test('stacks the mobile header controls without overlap', async ({
        page,
    }) => {
        await page.goto('/');

        const header = page.locator('app-workspace-shell-header');
        const search = header.locator('.search-field');
        const switcher = header.locator('.playlist-switcher');

        await expect(header).toBeVisible();
        await expect(search).toBeVisible();

        const layout = await header.evaluate((headerElement) => {
            const searchElement = headerElement.querySelector('.search-field');
            const switcherElement =
                headerElement.querySelector('.playlist-switcher');
            const headerRect = headerElement.getBoundingClientRect();
            const searchRect = searchElement?.getBoundingClientRect();
            const switcherRect = switcherElement?.getBoundingClientRect();

            return {
                headerRight: headerRect.right,
                searchBottom: searchRect?.bottom ?? 0,
                searchLeft: searchRect?.left ?? 0,
                searchRight: searchRect?.right ?? 0,
                searchTop: searchRect?.top ?? 0,
                switcherBottom: switcherRect?.bottom ?? 0,
            };
        });

        expect(layout.searchRight).toBeLessThanOrEqual(layout.headerRight);
        expect(layout.searchLeft).toBeGreaterThanOrEqual(0);
        expect(layout.searchBottom).toBeGreaterThan(layout.searchTop);
        if (await switcher.count()) {
            expect(layout.searchTop).toBeGreaterThanOrEqual(
                layout.switcherBottom
            );
        }
    });
});
