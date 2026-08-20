import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model (POM) untuk Landing Page resmi Codemi (https://codemi.co.id/).
 * Pola POM memisahkan logic interaksi UI dari file test spec agar kode rapi dan mudah di-maintain.
 */
export class CodemiHomePage {
  // Deklarasi properti readonly untuk page context dan web locators
  readonly page: Page;
  readonly logo: Locator;
  readonly navMenu: Locator;
  readonly requestDemoButton: Locator;
  readonly footer: Locator;

  /**
   * Konstruktor: Menerima instance Page dari Playwright test runner
   * @param page Instance halaman browser aktif
   */
  constructor(page: Page) {
    this.page = page;

    // Locator untuk Logo: mencari tag img di dalam header atau navbar brand
    this.logo = page.locator('header img, header .navbar-brand').first();

    // Locator untuk Menu Navigasi utama di bagian atas
    this.navMenu = page.locator('nav, header ul');

    // Locator untuk tombol CTA Demo / Kontak menggunakan ekspresi regex fleksibel
    this.requestDemoButton = page.getByRole('link', { name: /demo|coba gratis|hubungi kami/i }).first();

    // Locator untuk bagian Footer di bagian paling bawah halaman
    this.footer = page.locator('footer');
  }

  /**
   * Navigasi langsung ke URL Codemi
   * Menggunakan domcontentloaded agar test tidak timeout menunggu aset pihak ketiga (seperti analytics/tracker)
   */
  async navigate(): Promise<void> {
    await this.page.goto('https://codemi.co.id/', { waitUntil: 'domcontentloaded' });
  }

  /**
   * Verifikasi halaman berhasil termuat dengan mengecek URL dan keberadaan logo
   */
  async verifyPageLoaded(): Promise<void> {
    // Assert URL mengandung domain codemi.co.id
    await expect(this.page).toHaveURL(/codemi\.co\.id/);
    
    // Assert elemen logo terlihat di layar (Web-first assertion dengan auto-wait)
    await expect(this.logo).toBeVisible();
  }

  /**
   * Mengklik tombol CTA Request Demo / Hubungi Kami
   */
  async clickRequestDemo(): Promise<void> {
    await this.requestDemoButton.click();
  }
}