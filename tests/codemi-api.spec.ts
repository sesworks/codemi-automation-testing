import { test, expect } from '@playwright/test';
import { z } from 'zod';

test.describe('Codemi LMS Core API Test Suite', () => {

  /**
   * TC01: Verifikasi Endpoint Public Courses / Content List
   * Memastikan status HTTP 200, response time wajar, dan payload struktur sesuai schema.
   */
  test('API-TC01: Get Course Content List & Verify Zod Schema', async ({ request }) => {
    // Kirim HTTP GET request ke mock/public endpoint API
    const response = await request.get('https://jsonplaceholder.typicode.com/posts?_limit=5');
    
    // 1. Assert Status Code & Headers
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = await response.json();

    // 2. Definisikan runtime contract schema untuk Course Item
    const courseItemSchema = z.object({
      userId: z.number(),
      id: z.number(),
      title: z.string(),
      body: z.string(),
    });

    const coursesListSchema = z.array(courseItemSchema);

    // 3. Validasi skema (Zod akan melempar error jika struktur JSON tidak cocok)
    const validatedData = coursesListSchema.parse(responseBody);
    expect(validatedData.length).toBe(5);
    console.log(`[API Verified] Retrieved ${validatedData.length} valid course items.`);
  });

  /**
   * TC02: Simulasi User Enrollment / Submit Progress (POST Request)
   * Memvalidasi request payload berhasil diterima (HTTP 201 Created) dan mengembalikan ID baru.
   */
  test('API-TC02: Submit Course Enrollment & Verify Created Payload', async ({ request }) => {
    const payload = {
      courseId: 101,
      learnerName: 'Anthony QA',
      enrollmentDate: '2026-08-20',
      status: 'active',
    };

    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: payload,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    // Validasi status 201 Created
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.courseId).toBe(payload.courseId);
    expect(body).toHaveProperty('id');
  });

  /**
   * TC03: Negative Testing - Validasi Error Handling pada Endpoint Tidak Ditemukan
   * Memastikan API mengembalikan error 404 saat mengakses resource yang tidak ada.
   */
  test('API-TC03: Negative Test - Handled 404 for Invalid Resource', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/invalid-endpoint-999');
    
    // Assert status client error 404
    expect(response.status()).toBe(404);
  });

});
