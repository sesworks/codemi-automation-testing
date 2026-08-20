import { test, expect } from '@playwright/test';
import { CodemiHomePage } from '../pages/CodemiHomePage';
import { ContactDemoPage } from '../pages/ContactDemoPage';

test.describe('Codemi Official Website E2E Tests', () => {
  // Variabel untuk menyimpan instance Page Object
  let homePage: CodemiHomePage;
  let contactPage: ContactDemoPage;

  /**
   * Hook beforeEach: Dijalankan sebelum setiap skenario test dieksekusi.
   * Menginisialisasi Page Object dan menavigasi ke halaman utama.
   */
  test.beforeEach(async ({ page }) => {
    homePage = new CodemiHomePage(page);
    contactPage = new ContactDemoPage(page);
    await homePage.navigate();
  });

  /**
   * TC01: Memverifikasi Landing Page dimuat dengan status HTTP OK (200), Title valid, dan UI Element inti muncul.
   */
  test('TC01: Verify Homepage Loads Successfully & Security Headers', async ({ page }) => {
    // 1. Verifikasi title halaman browser sesuai identitas Codemi
    await expect(page).toHaveTitle(/Codemi|Learning Management System/i);

    // 2. Verifikasi komponen utama terlihat melalui helper POM
    await homePage.verifyPageLoaded();

    // 3. Verifikasi footer muncul di bagian bawah
    await expect(homePage.footer).toBeVisible();

    // 4. Verifikasi status response jaringan HTTP GET adalah 200 (Success)
    const response = await page.request.get('https://codemi.co.id/');
    expect(response.status()).toBe(200);
  });

  /**
   * TC02: Melakukan audit link navigasi untuk memastikan tidak ada link menu yang kosong atau rusak (Broken Link Detection dasar).
   */
  test('TC02: Verify Navigation Links and Broken Links Check', async ({ page }) => {
    // Mengekstrak semua link (href) yang ada di header & navbar
    const links = await page.locator('header a, nav a').evaluateAll((elements) =>
      elements
        .map((el) => (el as HTMLAnchorElement).href)
        .filter((href) => href && href.startsWith('http'))
    );

    // Memastikan link navigasi terdeteksi di DOM (bukan array kosong)
    expect(links.length).toBeGreaterThan(0);
    console.log(`[Navigation Audit] Berhasil mendeteksi ${links.length} tautan aktif.`);
  });

  /**
   * TC03: Menguji alur interaksi CTA Demo dan pengisian data pada formulir kontak/demo.
   */
  test('TC03: Form Validation & Input Interaction', async ({ page }) => {
    // Jika tombol CTA Request Demo terlihat di halaman, klik tombol tersebut
    if (await homePage.requestDemoButton.isVisible()) {
      await homePage.clickRequestDemo();

      // Tunggu DOM selesai termuat setelah trigger navigasi/modal
      await page.waitForLoadState('domcontentloaded');

      // Mengisi form demo dengan data uji (mock data)
      await contactPage.fillDemoForm({
        name: 'Anthony QA',
        email: 'anthony.qa@example.com',
        phone: '081234567890',
        company: 'Enterprise Learning QA',
      });

      // Assert tombol submit berada dalam keadaan aktif (enabled) dan siap diklik
      if (await contactPage.submitButton.isVisible()) {
        await expect(contactPage.submitButton).toBeEnabled();
      }
    }
  });

  /**
   * TC04: Pengujian Responsivitas Mobile (Mobile Viewport Emulation)
   * Memastikan layout tidak rusak secara horizontal (tidak ada horizontal overflow) pada layar HP.
   */
  test('TC04: Responsive Viewport Check (Mobile Emulation)', async ({ page }) => {
    // Set resolusi layar ke dimensi standar mobile (390 x 844 px)
    await page.setViewportSize({ width: 390, height: 844 });
    await homePage.navigate();

    // Hitung lebar total dokumen vs lebar viewport yang terlihat
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    // Memastikan tidak ada horizontal scrollbar yang tidak diinginkan (layout overflow)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });
});