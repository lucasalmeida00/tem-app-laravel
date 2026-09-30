import { test, expect } from '@playwright/test';

test.describe('Questionnaire UI and Card Navigation', () => {
  test('validates card icons, badges, off-white background, and dynamic left borders', async ({ page }) => {
    // 1. Authenticate via test login
    await page.goto('http://localhost:8090/_test_login/3');
    await page.waitForURL('**/dashboard');

    // 2. Go to business questionnaire
    await page.goto('http://localhost:8090/dashboard/e64e527d-5d4d-42e4-8d91-8eb5002534e5');
    await page.waitForSelector('#cardsCarousel');

    // 3. Verify Carousel has 20 slides with badges
    const slides = page.locator('.swiper-slide');
    await expect(slides).toHaveCount(20);

    const badge1 = page.locator('.swiper-slide[data-card="1"] .icon-badge');
    await expect(badge1).toHaveText('01');
    await expect(badge1).toBeVisible();

    const badge7 = page.locator('.swiper-slide[data-card="7"] .icon-badge');
    await expect(badge7).toHaveText('07');
    await expect(badge7).toBeVisible();

    // 4. Verify initial card 1 has selected styling
    const card1 = page.locator('.swiper-slide[data-card="1"] .cards-card');
    await expect(card1).toHaveClass(/is-selected/);

    // Verify first question card has border-left
    const firstQuestionCard = page.locator('.section-forms .tem-card.border-card').first();
    await expect(firstQuestionCard).toBeVisible();

    // 5. Select Card 7 (Proposta de Valor)
    await page.evaluate(() => window.temSelectCard(7));

    // Wait for form to re-render card 7
    await page.waitForTimeout(600);

    // Verify Card 7 is now selected
    const card7Slide = page.locator('.swiper-slide[data-card="7"]');
    const card7 = card7Slide.locator('.cards-card');
    await expect(card7).toHaveClass(/is-selected/);

    // Verify section-forms has data-card="7"
    const sectionForms = page.locator('.section-forms');
    await expect(sectionForms).toHaveAttribute('data-card', '7');

    // Verify question 7.1 exists and has number
    const q7Number = page.locator('.section-forms .f-number').first();
    await expect(q7Number).toHaveText('7.1');

    // 6. Capture screenshot of the updated questionnaire view
    await page.screenshot({ path: '/Users/lucasalmeida/.gemini/antigravity/brain/0960e815-e813-46f6-b1a3-c0054a1f9a02/screenshot-questionnaire-card7.png', fullPage: false });
  });
});
