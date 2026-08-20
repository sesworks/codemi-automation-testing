import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model untuk interaksi Form Demo / Kontak Calon Klien di Codemi
 */
export class ContactDemoPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly companyInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Menggunakan getByPlaceholder atau fallback ke atribut CSS name
    this.nameInput = page.getByPlaceholder(/nama/i).or(page.locator('input[name="name"], input[name*="nama"]')).first();
    this.emailInput = page.getByPlaceholder(/email/i).or(page.locator('input[type="email"]')).first();
    this.phoneInput = page.getByPlaceholder(/telepon|phone|whatsapp/i).or(page.locator('input[type="tel"]')).first();
    this.companyInput = page.getByPlaceholder(/perusahaan|company/i).or(page.locator('input[name*="company"]')).first();
    
    // Locator tombol aksi submit/kirim
    this.submitButton = page.getByRole('button', { name: /kirim|submit|request/i }).first();
  }

  /**
   * Mengisi field formulir pendaftaran demo secara modular
   * @param data Objek berisi name, email, phone, dan company
   */
  async fillDemoForm(data: { name: string; email: string; phone: string; company: string }): Promise<void> {
    // Mengecek apakah elemen muncul sebelum melakukan input (mencegah flaky jika form dinamis)
    if (await this.nameInput.isVisible()) {
      await this.nameInput.fill(data.name);
    }
    if (await this.emailInput.isVisible()) {
      await this.emailInput.fill(data.email);
    }
    if (await this.phoneInput.isVisible()) {
      await this.phoneInput.fill(data.phone);
    }
    if (await this.companyInput.isVisible()) {
      await this.companyInput.fill(data.company);
    }
  }
}