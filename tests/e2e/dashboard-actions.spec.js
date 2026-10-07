import { test, expect } from '@playwright/test';

test.describe('Dashboard business CRUD and resume report download (PR #2 bugfix verification)', () => {

  test('1. Creates and deletes a business via the dashboard modals', async ({ page }) => {
    await page.goto('http://localhost:8090/_test_login/3');
    await page.waitForURL('**/dashboard');

    const businessName = `E2E Test Business ${Date.now()}`;

    // Open "Adicionar empreendimento" modal
    await page.click('[data-bs-target="#newBusinessModal"]');
    await page.waitForSelector('#newBusinessModal.show');

    await page.fill('#business_name', businessName);

    const [createResponse] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/dashboard/business') && resp.request().method() === 'POST'),
      page.click('#new-business-submit'),
    ]);
    expect(createResponse.ok()).toBeTruthy();

    await page.waitForURL('**/dashboard');
    await page.waitForSelector('.business-grid');

    const newCard = page.locator('.business-card-item', { hasText: businessName });
    await expect(newCard).toBeVisible();

    // Delete the business we just created
    await newCard.locator('.js-delete-business').click();
    await page.waitForSelector('#deleteBusinessModal.show');
    await expect(page.locator('#delete-business-name')).toHaveText(businessName);

    const [deleteResponse] = await Promise.all([
      page.waitForResponse(resp => resp.request().method() === 'DELETE'),
      page.click('#confirm-delete-business'),
    ]);
    expect(deleteResponse.ok()).toBeTruthy();

    await expect(page.locator('.business-card-item', { hasText: businessName })).toHaveCount(0);
  });

  test('2. Resume page "Baixar Relatório" button triggers the PDF download request', async ({ page }) => {
    await page.goto('http://localhost:8090/_test_login/3');
    await page.waitForURL('**/dashboard');

    await page.goto('http://localhost:8090/dashboard/e64e527d-5d4d-42e4-8d91-8eb5002534e5/resume');
    await page.waitForSelector('#btnDownloadReport');

    const [reportResponse] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/report/download')),
      page.click('#btnDownloadReport'),
    ]);
    expect(reportResponse.ok()).toBeTruthy();
    expect(reportResponse.headers()['content-type']).toContain('pdf');
  });

});
