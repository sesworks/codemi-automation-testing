import { test, expect } from '@playwright/test';
import { LMSDatabase } from '../utils/db';

test.describe('Codemi LMS Backend Database Verification Suite', () => {
  let db: LMSDatabase;

  test.beforeEach(async () => {
    db = new LMSDatabase();
    await db.initSchema();
    await db.seedBaseData();
  });

  test.afterEach(async () => {
    db.close();
  });

  test('DB-TC01: Validasi Sertifikat Terbit Otomatis Saat Skor >= Passing Grade (85 >= 80)', async () => {
    // Skenario: User mengerjakan quiz dan dapat nilai 85 (Lulus)
    await db.submitQuiz(1, 1, 85);

    // QA Verifikasi SQL: Cek tabel certificates
    const certs = await db.getCertificatesByUser(1);

    expect(certs.length).toBe(1);
    expect(certs[0].certificate_code).toContain('CERT-LMS-1-');
    console.log(`[DB PASS] Sertifikat berhasil terbit di DB: ${certs[0].certificate_code}`);
  });

  test('DB-TC02: Validasi Sertifikat TIDAK Boleh Terbit Saat Skor < Passing Grade (75 < 80)', async () => {
    // Skenario: User mengerjakan quiz dan hanya dapat nilai 75 (Gagal)
    await db.submitQuiz(1, 1, 75);

    // QA Verifikasi SQL: Cek tabel certificates harus kosong (0)
    const certs = await db.getCertificatesByUser(1);

    expect(certs.length).toBe(0);
    console.log('[DB PASS] Verifikasi integritas: Tidak ada sertifikat terbit untuk nilai 75.');
  });

  test('DB-TC03: Data Integrity Audit - Zero Tolerance for Illegal Certificates', async () => {
    // Skenario: Simulasi normal submission
    await db.submitQuiz(1, 1, 90);

    // QA Audit SQL: Mencari apakah ada data bocor / sertifikat terbit di bawah KKM
    const illegalRecords = await db.findIllegalCertificates();

    // Nilai array harus 0 (tidak boleh ada satupun anomali data di DB)
    expect(illegalRecords.length).toBe(0);
    console.log('[DB PASS] Audit Integritas Data Bersih (0 illegal records).');
  });
});
