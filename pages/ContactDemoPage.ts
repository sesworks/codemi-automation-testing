import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model untuk formulir pendaftaran Jadwalkan Demo Codemi
 */
export class ContactDemoPage {
  readonly page: Page;
  readonly namaLengkapInput: Locator;
  readonly jabatanInput: Locator;
  readonly perusahaanInput: Locator;
  readonly jumlahKaryawanDropdown: Locator;
  readonly emailKerjaInput: Locator;
  readonly noWhatsappInput: Locator;
  readonly industriDropdown: Locator;
  readonly produkDropdown: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Input text fields
    this.namaLengkapInput = page.getByPlaceholder('Nama Anda').or(page.locator('input[name*="name"], input[placeholder*="Nama"]')).first();
    this.jabatanInput = page.getByPlaceholder('e.g. Training Manager').or(page.locator('input[name*="job"], input[name*="jabatan"], input[name*="title"]')).first();
    this.perusahaanInput = page.getByPlaceholder('Nama perusahaan').or(page.locator('input[name*="company"], input[name*="perusahaan"]')).first();
    this.emailKerjaInput = page.getByPlaceholder('nama@perusahaan.com').or(page.locator('input[type="email"]')).first();
    this.noWhatsappInput = page.getByPlaceholder('08xxxxxxxxxx').or(page.locator('input[type="tel"], input[name*="phone"], input[name*="whatsapp"]')).first();

    // Dropdown fields
    this.jumlahKaryawanDropdown = page.locator('select').nth(0).or(page.getByRole('combobox').nth(0));
    this.industriDropdown = page.locator('select').nth(1).or(page.getByRole('combobox').nth(1));
    this.produkDropdown = page.locator('select').nth(2).or(page.getByRole('combobox').nth(2));

    // Submit button
    this.submitButton = page.getByRole('button', { name: /Kirim Permintaan Demo/i }).first();
  }

  /**
   * Mengisi seluruh field input formulir satu per satu secara perlahan
   */
  async fillFullDemoForm(data: {
    nama: string;
    jabatan: string;
    perusahaan: string;
    email: string;
    whatsapp: string;
  }): Promise<void> {
    const delay = 80;

    // 1. Nama Lengkap
    if (await this.namaLengkapInput.isVisible()) {
      await this.namaLengkapInput.click();
      await this.namaLengkapInput.pressSequentially(data.nama, { delay });
    }

    // 2. Jabatan
    if (await this.jabatanInput.isVisible()) {
      await this.jabatanInput.click();
      await this.jabatanInput.pressSequentially(data.jabatan, { delay });
    }

    // 3. Perusahaan
    if (await this.perusahaanInput.isVisible()) {
      await this.perusahaanInput.click();
      await this.perusahaanInput.pressSequentially(data.perusahaan, { delay });
    }

    // 4. Dropdown Jumlah Karyawan
    if (await this.jumlahKaryawanDropdown.isVisible()) {
      await this.jumlahKaryawanDropdown.click();
      await this.page.keyboard.press('ArrowDown');
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(300);
    }

    // 5. Email Kerja
    if (await this.emailKerjaInput.isVisible()) {
      await this.emailKerjaInput.click();
      await this.emailKerjaInput.pressSequentially(data.email, { delay });
    }

    // 6. Nomor WhatsApp
    if (await this.noWhatsappInput.isVisible()) {
      await this.noWhatsappInput.click();
      await this.noWhatsappInput.pressSequentially(data.whatsapp, { delay });
    }

    // 7. Dropdown Industri
    if (await this.industriDropdown.isVisible()) {
      await this.industriDropdown.click();
      await this.page.keyboard.press('ArrowDown');
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(300);
    }

    // 8. Dropdown Produk yang Diminati
    if (await this.produkDropdown.isVisible()) {
      await this.produkDropdown.click();
      await this.page.keyboard.press('ArrowDown');
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(300);
    }
  }
}
