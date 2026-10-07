import { test, expect } from '@playwright/test';

test.describe('TEM Questionnaire and Resume E2E Visual Verification', () => {

  test('1. Validates questionnaire cards, dynamic color palette, and navigation footer', async ({ page }) => {
    // Authenticate via test login
    await page.goto('http://localhost:8090/_test_login/3');
    await page.waitForURL('**/dashboard');

    // Go to business questionnaire
    await page.goto('http://localhost:8090/dashboard/e64e527d-5d4d-42e4-8d91-8eb5002534e5');
    await page.waitForSelector('#cardsCarousel');

    // 1. Verify Carousel has 20 slides with numeric badges 01..20
    const slides = page.locator('.swiper-slide');
    await expect(slides).toHaveCount(20);

    const badge1 = page.locator('.swiper-slide[data-card="1"] .icon-badge');
    await expect(badge1).toHaveText('01');
    await expect(badge1).toBeVisible();

    const badge20 = page.locator('.swiper-slide[data-card="20"] .icon-badge');
    await expect(badge20).toHaveText('20');
    await expect(badge20).toBeVisible();

    // 2. Card 1 selected state
    const card1 = page.locator('.swiper-slide[data-card="1"] .cards-card');
    await expect(card1).toHaveClass(/is-selected/);

    // Save screenshot of Card 1
    await page.screenshot({ path: 'tests/e2e/screenshots/01_card1_identificacao.png', fullPage: false });

    // 3. Select Card 7 (Proposta de Valor - Laranja)
    await page.evaluate(() => window.temSelectCard(7));
    await page.waitForTimeout(600);

    const card7 = page.locator('.swiper-slide[data-card="7"] .cards-card');
    await expect(card7).toHaveClass(/is-selected/);

    const sectionForms = page.locator('.section-forms');
    await expect(sectionForms).toHaveAttribute('data-card', '7');

    const q7Number = page.locator('.section-forms .f-number').first();
    await expect(q7Number).toHaveText('7.1');

    await page.screenshot({ path: 'tests/e2e/screenshots/02_card7_proposta_de_valor.png', fullPage: false });

    // 4. Select Card 20 (Parcerias - Roxo)
    await page.evaluate(() => window.temSelectCard(20));
    await page.waitForTimeout(600);

    // Verify dynamic buttons:
    // Prev button should exist and have "Bloco anterior: (19/20)"
    const prevLabel = page.locator('#prevBlockLabel');
    await expect(prevLabel).toHaveText('Bloco anterior: (19/20)');

    // Finish button should be visible with text "Finalizar Questionário"
    const finishBtn = page.locator('#btnFinish');
    await expect(finishBtn).toBeVisible();
    await expect(finishBtn).toHaveText(/Finalizar Questionário/);

    // Next button should be hidden
    const nextBtn = page.locator('#btnNextBlock');
    await expect(nextBtn).toBeHidden();

    await page.screenshot({ path: 'tests/e2e/screenshots/03_card20_finish_button.png', fullPage: false });
  });

  test('2. Validates Resume page (/resume) alignment, colored timeline, and detail popover', async ({ page }) => {
    // Authenticate via test login
    await page.goto('http://localhost:8090/_test_login/3');
    await page.waitForURL('**/dashboard');

    // Go to business resume
    await page.goto('http://localhost:8090/dashboard/e64e527d-5d4d-42e4-8d91-8eb5002534e5/resume');
    await page.waitForSelector('.tem-resume-page');

    // 1. Verify hero title is present
    const heroTitle = page.locator('.resume-hero-card .tem-title');
    await expect(heroTitle).toBeVisible();

    // 2. Verify timeline items exist
    const timelineItems = page.locator('.timeline-item');
    const count = await timelineItems.count();
    expect(count).toBeGreaterThan(0);

    // 3. Click first timeline item to open popover
    await timelineItems.first().click();
    await page.waitForTimeout(400);

    const popover = page.locator('.detail-popover-overlay');
    await expect(popover).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/screenshots/04_resume_timeline_popover.png', fullPage: false });
  });

  test('3. Validates Business Model Canvas headers use the single app brand blue', async ({ page }) => {
    // Authenticate via test login
    await page.goto('http://localhost:8090/_test_login/3');
    await page.waitForURL('**/dashboard');

    // Go to business resume
    await page.goto('http://localhost:8090/dashboard/e64e527d-5d4d-42e4-8d91-8eb5002534e5/resume');
    await page.waitForSelector('.bmodel-board');

    // Every BMC header must use the same brand blue (var(--color-primary): #1E3A8A),
    // not the per-section rainbow palette this PR had introduced.
    const headers = page.locator('.bmodel-board .bmodel-header');
    const count = await headers.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const bg = await headers.nth(i).evaluate(el => getComputedStyle(el).backgroundColor);
      expect(bg).toBe('rgb(30, 58, 138)'); // #1E3A8A
    }

    await page.locator('.bmodel-board').screenshot({ path: 'tests/e2e/screenshots/05_resume_bmc_blue.png' });
  });

});
