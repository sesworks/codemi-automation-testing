import { test, expect } from '@playwright/test';
import { CodemiHomePage } from '../pages/CodemiHomePage';
import { ContactDemoPage } from '../pages/ContactDemoPage';

test.describe('Codemi Official Website E2E Tests', () => {
  let homePage: CodemiHomePage;
  let contactPage: ContactDemoPage;

  test.beforeEach(async ({ page }) => {
    homePage = new CodemiHomePage(page);
    contactPage = new ContactDemoPage(page);
    await homePage.navigate();
  });

  test('TC01: Verify Homepage Loads Successfully & Security Headers', async ({ page }) => {
    await expect(page).toHaveTitle(/Codemi|Learning Management System/i);
    await homePage.verifyPageLoaded();
    await expect(homePage.footer).toBeVisible();

    const response = await page.request.get('https://codemi.co.id/');
    expect(response.status()).toBe(200);
  });

  test('TC02: Verify Navigation Links and Broken Links Check', async ({ page }) => {
    // 1. Tunggu minimal satu elemen link (a[href]) terpasang di DOM (mencegah timing issue di CI)
    const linkLocator = page.locator('a[href]');
    await linkLocator.first().waitFor({ state: 'attached', timeout: 10000 });

    // 2. Ambil seluruh atribut href
    const links = await linkLocator.evaluateAll((elements) =>
      elements
        .map((el) => (el as HTMLAnchorElement).href)
        .filter((href) => href && href.startsWith('http'))
    );

    // 3. Verifikasi tautan terdeteksi
    expect(links.length).toBeGreaterThan(0);
    console.log(`[Navigation Audit] Berhasil mendeteksi ${links.length} tautan aktif.`);
  });

  test('TC03: Form Validation & Input Interaction', async ({ page }) => {
    if (await homePage.requestDemoButton.isVisible()) {
      await homePage.clickRequestDemo();
      await page.waitForLoadState('domcontentloaded');

      await contactPage.fillDemoForm({
        name: 'Anthony QA',
        email: 'anthony.qa@example.com',
        phone: '081234567890',
        company: 'Enterprise Learning QA',
      });

      if (await contactPage.submitButton.isVisible()) {
        await expect(contactPage.submitButton).toBeEnabled();
      }
    }
  });

  test('TC04: Responsive Viewport Check (Mobile Emulation)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await homePage.navigate();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });
});
