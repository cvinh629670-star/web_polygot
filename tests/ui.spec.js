import { test as base, expect } from '@playwright/test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const later = Date.now() + 30 * 86_400_000;
const earlier = Date.now() - 86_400_000;
const savedWords = [
  { id: 'en-new', lang: 'en', word: 'Hello', meaning: 'Xin chào', srsLevel: 0, nextReviewTime: 0 },
  { id: 'en-learning', lang: 'en', word: 'Memory', meaning: 'Trí nhớ', srsLevel: 3, nextReviewTime: earlier },
  { id: 'en-mastered', lang: 'en', word: 'Horizon', meaning: 'Chân trời', srsLevel: 8, nextReviewTime: later },
  { id: 'en-nemesis', lang: 'en', word: 'Stubborn', meaning: 'Bướng bỉnh', srsLevel: 2, nextReviewTime: later, forgotCount: 3 },
  { id: 'ko-new', lang: 'ko', word: '안녕', meaning: 'Xin chào', srsLevel: 0, nextReviewTime: 0 },
  { id: 'ko-mastered', lang: 'ko', word: '감사', meaning: 'Cảm ơn', srsLevel: 8, nextReviewTime: later },
  { id: 'zh-learning', lang: 'zh', word: '学习', meaning: 'Học tập', srsLevel: 2, nextReviewTime: later },
  { id: 'ja-new', lang: 'ja', word: 'こんにちは', meaning: 'Xin chào', srsLevel: 0, nextReviewTime: 0 },
  { id: 'ja-learning', lang: 'ja', word: '記憶', meaning: 'Trí nhớ', srsLevel: 1, nextReviewTime: earlier },
  { id: 'ja-mastered', lang: 'ja', word: '世界', meaning: 'Thế giới', srsLevel: 8, nextReviewTime: later },
];

// Exercise the production HTML and IIFE bundle without relying on font/CDN access.
// A fresh browser context per test preserves the distinction between saved data
// loaded on startup and updates made through the actual application controls.
const test = base.extend({
  page: async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => {
      const url = new URL(route.request().url());
      if (['http:', 'https:'].includes(url.protocol) && !['127.0.0.1', 'localhost'].includes(url.hostname)) return route.abort();
      return route.continue();
    });
    await page.addInitScript(words => {
      if (localStorage.getItem('__polyglot_test_seeded')) return;
      localStorage.setItem('__polyglot_test_seeded', 'true');
      localStorage.setItem('polyglot_starter_vocabulary_v1', 'true');
      localStorage.setItem('polyglot_words', JSON.stringify(words));
      localStorage.setItem('polyglot_lang', 'en');
      localStorage.setItem('polyglot_dark', 'false');
      localStorage.setItem('polyglot_music_on', 'false');
      localStorage.setItem('polyglot_auto_tts', 'false');
      localStorage.setItem('polyglot_streak', '3');
      localStorage.setItem('polyglot_gemini_key', 'saved-test-value');
      // Existing installations can lack this old marker. Their data must survive.
      localStorage.removeItem('polyglot_fresh_start_v1');
    }, savedWords);
    await use(page);
    expect(errors, 'The app and its embedded game should not throw JavaScript errors').toEqual([]);
  },
});

async function openApp(page, url = '/') {
  await page.goto(url);
  await expect(page.locator('#react-navigation-root .pg-nav-button')).toHaveCount(6);
  await expect(page.locator('.pg-dashboard')).toBeVisible();
  await expect(page.locator('.pg-hero')).toHaveCount(0);
}

async function expectStats(page, { total, unlearned, learning, mastered, due }) {
  await expect(page.locator('.pg-stat-blue .pg-stat-value')).toHaveText(String(total));
  await expect(page.locator('.pg-stat-amber .pg-stat-value')).toHaveText(String(unlearned));
  await expect(page.locator('.pg-stat-violet .pg-stat-value')).toHaveText(String(learning));
  await expect(page.locator('.pg-stat-emerald .pg-stat-value')).toHaveText(String(mastered));
  await expect(page.locator('.pg-due-count')).toContainText(`${due} TỪ`);
  const mastery = total ? Math.round(mastered / total * 100) : 0;
  await expect(page.getByRole('progressbar', { name: 'Tỷ lệ từ vựng đã thành thạo' })).toHaveAttribute('aria-valuenow', String(mastery));
}

test('preserves saved vocabulary without a reset marker and shows real statistics for four languages', async ({ page }, testInfo) => {
  await openApp(page);
  await expectStats(page, { total: 4, unlearned: 1, learning: 2, mastered: 1, due: 2 });
  await page.screenshot({ path: testInfo.outputPath('desktop.png'), fullPage: true });
  const selectedLanguage = page.locator('#language-tabs button[aria-pressed="true"]');
  await expect(selectedLanguage).toHaveAttribute('id', 'lang-btn-en');
  await page.locator('#lang-btn-ko').hover();
  await expect(selectedLanguage).toHaveAttribute('id', 'lang-btn-en');
  await page.locator('#lang-btn-zh').focus();
  await expect(selectedLanguage).toHaveAttribute('id', 'lang-btn-en');
  for (const [lang, stats] of [
    ['ko', { total: 2, unlearned: 1, learning: 0, mastered: 1, due: 1 }],
    ['zh', { total: 1, unlearned: 0, learning: 1, mastered: 0, due: 0 }],
    ['ja', { total: 3, unlearned: 1, learning: 1, mastered: 1, due: 2 }],
  ]) {
    await page.locator(`#lang-btn-${lang}`).click();
    await expect(selectedLanguage).toHaveAttribute('id', `lang-btn-${lang}`);
    await expectStats(page, stats);
    await expect(page.locator('body')).toHaveClass(new RegExp(`theme-${lang}`));
  }
  await page.reload();
  await expect(selectedLanguage).toHaveAttribute('id', 'lang-btn-ja');
  await expectStats(page, { total: 3, unlearned: 1, learning: 1, mastered: 1, due: 2 });
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('polyglot_words')))).toEqual(savedWords);
  expect(await page.evaluate(() => localStorage.getItem('polyglot_gemini_key'))).toBe('saved-test-value');
});

test('adding a word through the existing form updates React stats and remains saved after reload', async ({ page }) => {
  await openApp(page);
  await page.locator('#react-dashboard-root').getByRole('button', { name: 'Thêm từ mới', exact: true }).click();
  await expect(page.locator('#input-word')).toBeFocused();
  await page.locator('#input-word').fill('Perseverance');
  await page.locator('#input-meaning').fill('Sự kiên trì');
  await page.locator('#add-word-form button[type="submit"]').click();
  await expectStats(page, { total: 5, unlearned: 2, learning: 2, mastered: 1, due: 3 });
  await expect(page.locator('#vocab-table-body')).toContainText('Perseverance');
  await page.reload();
  await expectStats(page, { total: 5, unlearned: 2, learning: 2, mastered: 1, due: 3 });
  await expect(page.locator('#vocab-table-body')).toContainText('Sự kiên trì');
});

test('vocabulary cards, search, selection, export and empty-library import work on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openApp(page);
  const table = page.locator('#vocab-table');
  await expect(table).toHaveCSS('display', 'block');
  await expect(page.locator('#vocab-table-body')).toHaveCSS('display', 'grid');
  await expect(page.locator('#vocab-results-count')).toHaveText('4 từ');
  const search = page.getByRole('searchbox', { name: 'Tìm từ vựng' });
  await search.fill('Memory');
  await expect(page.locator('#vocab-results-count')).toHaveText('1 / 4 từ');
  await page.getByRole('checkbox', { name: 'Chọn tất cả từ đang hiển thị' }).check();
  await expect(page.getByRole('checkbox', { name: 'Chọn từ Memory' })).toBeChecked();
  await page.locator('#vocab-export-menu summary').click();
  await expect(page.getByRole('button', { name: 'Xuất File CSV' })).toBeVisible();
  expect(await table.evaluate(element => element.scrollWidth)).toBeLessThanOrEqual(await table.evaluate(element => element.clientWidth));
  await search.fill('no matching vocabulary');
  await expect(table).toBeHidden();
  await expect(page.locator('#vocab-empty-message')).toHaveText('Không tìm thấy từ vựng phù hợp');
  const importPreset = page.locator('#vocab-empty-state').getByRole('button', { name: 'Nhập bộ từ mẫu', exact: true });
  await expect(importPreset).toBeHidden();
  await page.getByRole('button', { name: 'Đặt lại bộ lọc' }).click();
  await expect(search).toBeFocused();
  await expect(search).toHaveValue('');
  await expect(table).toBeVisible();

  const dialog = page.getByRole('dialog', { name: 'Thêm từ mới' });
  const openForm = page.getByRole('button', { name: 'Thêm từ', exact: true });
  await expect(dialog).toBeHidden();
  const listWidth = await page.locator('#vocab-list-panel').evaluate(panel => panel.clientWidth);
  await openForm.click();
  await expect(dialog).toBeVisible();
  await expect(page.locator('#input-word')).toBeFocused();
  const bounds = await dialog.boundingBox();
  expect(bounds.x + bounds.width / 2).toBeCloseTo(180, 0);
  expect(bounds.y + bounds.height / 2).toBeCloseTo(400, 0);
  expect(await page.locator('#vocab-list-panel').evaluate(panel => panel.clientWidth)).toBe(listWidth);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(openForm).toBeFocused();

  // Keep the saved vocabulary of other languages and reopen the empty English library.
  await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('polyglot_words'));
    localStorage.setItem('polyglot_words', JSON.stringify(saved.filter(item => item.lang !== 'en')));
  });
  await openApp(page);
  await expect(page.locator('#vocab-results-count')).toHaveText('0 từ');
  await expect(importPreset).toBeVisible();
  await importPreset.click();
  await expect(page.locator('#import-modal')).toBeVisible();
  await expect(page.locator('#preset-lang-label')).toHaveText('EN');
});

test('all six React navigation controls open the right view and load the game only on demand', async ({ page }) => {
  await openApp(page);
  const frame = page.locator('#zombie-game-frame');
  expect(await frame.getAttribute('src')).toBeNull();
  for (const tab of ['flashcards', 'listening', 'nemesis', 'vip', 'game', 'vocab']) {
    const button = page.locator(`#react-navigation-root button[aria-controls="view-${tab}"]`);
    await button.click();
    await expect(button).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('.tab-view:visible')).toHaveCount(1);
    await expect(page.locator(`#view-${tab}`)).toBeVisible();
    if (tab !== 'vocab') await expect(page.locator('.pg-dashboard')).toHaveCount(0);
    if (tab === 'game') {
      const game = page.frameLocator('#zombie-game-frame');
      const reverse = game.locator('input[name="start-mode"][value="vi"]');
      await reverse.check();
      await expect(game.locator('#mode')).toHaveValue('vi');
      await expect(game.locator('#vocab-mode')).toBeVisible();
    }
  }
  await expect(frame).toHaveAttribute('src', './Game_zombie.html');
  await expect(frame).toHaveAttribute('data-loaded', 'true');
  await expect(page.locator('.pg-dashboard')).toBeVisible();
});

test('the practice room switches between grammar and interactive Hanzi writing', async ({ page }) => {
  await openApp(page);
  const entry = page.locator('#react-navigation-root button[aria-controls="view-listening"]');
  await entry.click();
  await expect(page.locator('#practice-title')).toHaveText('Luyện ngữ pháp');
  for (let index = 0; index < 8; index++) {
    await page.locator('[data-answer="0"]').click();
    await expect(page.locator('[data-feedback]')).toContainText('Đúng!');
    await page.locator('[data-next]').click();
  }
  await expect(page.locator('#practice-content')).toContainText('8/8');
  await page.locator('#grammar-import-file').setInputFiles({
    name: 'grammar.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify([{
      topic: 'Bài tự thêm', theory: 'Dùng does để hỏi với he.', question: '___ he swim?',
      options: ['Do', 'Does'], correctIndex: 1
    }])),
  });
  await page.getByText('Bài tự thêm', { exact: true }).click();
  await expect(page.getByText('Dùng does để hỏi với he.')).toBeVisible();
  await expect(page.locator('[data-grammar-quiz]')).toContainText('Câu 1/9');
  for (const lang of ['ko', 'ja']) {
    await page.locator(`#lang-btn-${lang}`).click();
    await expect(page.locator(`#practice-content h3[lang="${lang}"]`)).toBeVisible();
  }
  await page.locator('#lang-btn-zh').click();
  await expect(entry).toHaveText('Luyện viết Hán tự');
  await page.locator('#hanzi-character').selectOption('3');
  await page.locator('#hanzi-stroke').click();
  await expect(page.locator('#hanzi-stroke-count')).toHaveText('1/2 nét');
  const board = page.locator('#hanzi-board');
  const bounds = await board.boundingBox();
  const pixelAlpha = () => board.evaluate(element => element.getContext('2d').getImageData(75, 75, 1, 1).data[3]);
  await page.mouse.move(bounds.x + bounds.width / 4, bounds.y + bounds.height / 4);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 4);
  await page.mouse.up();
  await expect.poll(pixelAlpha).toBeGreaterThan(0);
  await page.locator('#hanzi-eraser').click();
  await page.mouse.click(bounds.x + bounds.width / 4, bounds.y + bounds.height / 4);
  expect(await pixelAlpha()).toBe(0);
  await page.locator('#hanzi-clear').click();
  expect(await pixelAlpha()).toBe(0);
  await page.locator('#hanzi-new').fill('山 水 火 山');
  await page.locator('#hanzi-add button').click();
  await expect(page.locator('#hanzi-add-status')).toHaveText('Đã lưu 3 chữ mới.');
  await expect(page.locator('#hanzi-stroke-count')).toHaveText('Mẫu mặt chữ');
  await page.reload();
  await entry.click();
  await expect(page.locator('#hanzi-character option')).toHaveCount(11);
});

test('Grammar Lab records an error, supports retry and persists XP and SRS locally', async ({ page }) => {
  await openApp(page);
  await page.locator('[aria-controls="view-listening"]').click();
  await page.locator('#open-grammar-lab').click();
  const lab = page.locator('#grammar-lab');
  await expect(lab.getByRole('heading', { name: 'Polygot Grammar Lab' })).toBeVisible();
  await lab.getByRole('button', { name: 'Kiến thức', exact: true }).click();
  await lab.locator('[data-action="lesson"][data-value="en-present"]').click();
  await lab.getByRole('button', { name: 'Đánh dấu đã học' }).click();
  await lab.getByRole('button', { name: 'Luyện bài này', exact: true }).click();
  await lab.getByRole('button', { name: 'go', exact: true }).click();
  await expect(lab.locator('.lab-feedback')).toContainText('Cần luyện thêm');
  await lab.locator('[data-action="tab"][data-value="review"]').click();
  await lab.getByRole('button', { name: 'Luyện các lỗi chưa sửa' }).click();
  await lab.getByRole('button', { name: 'goes', exact: true }).click();
  await expect(lab.locator('.lab-feedback')).toContainText('Đúng!');
  const progress = await page.evaluate(() => grammarLabRepository.read().profiles.en);
  expect(progress.answers.map(answer => answer.result)).toEqual(['wrong', 'correct']);
  expect(progress.reviews['en-present'].next).toBeGreaterThan(Date.now());
  expect(progress.awards['answer-en-present-1']).toBe(5);
  expect(progress.awards['repair-en-present-1']).toBe(8);
  await page.reload();
  await page.locator('[aria-controls="view-listening"]').click();
  await page.locator('#open-grammar-lab').click();
  await lab.locator('[data-action="tab"][data-value="review"]').click();
  await lab.locator('.lab-lapses summary').click();
  await expect(lab.locator('.lab-lapses')).toContainText('Đã khắc phục');
  await page.locator('#lang-btn-zh').click();
  await expect(lab).toHaveAttribute('data-lang', 'zh');
  await expect(lab.getByText('Tiếng Trung', { exact: false })).toBeVisible();
  await expect(lab.getByText('Chuỗi ngày', { exact: true }).locator('..')).toContainText('0');
});

test('Grammar Lab engine accepts sample answers in all ten exercise formats', async ({ page }) => {
  await openApp(page);
  const checks = await page.evaluate(() => {
    const results = {};
    for (const lang of ['en','ko','zh','ja']) {
      const bank = grammarLabEngine.catalog(lang);
      results[lang] = Object.fromEntries(bank.questions.slice(0,10).map(q => [
        q.type, grammarLabEngine.provider.assess(q, ' ' + q.answers[0] + ' ')
      ]));
    }
    return results;
  });
  for (const lang of ['en','ko','zh','ja']) {
    expect(Object.keys(checks[lang])).toHaveLength(10);
    expect(Object.values(checks[lang]).filter(result => result === 'correct')).toHaveLength(9);
    expect(checks[lang].writing).toBe('self');
  }
});

test('Grammar Lab backs up progress and restores it after a confirmed reset on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);
  await page.locator('[aria-controls="view-listening"]').click();
  await page.locator('#open-grammar-lab').click();
  const lab = page.locator('#grammar-lab');
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await page.evaluate(() => grammarLabRepository.update('en', profile => {
    profile.learned['en-present'] = Date.now();
    profile.awards['learn-en-present'] = 10;
  }));
  await lab.locator('[data-action="tab"][data-value="profile"]').click();
  const download = page.waitForEvent('download');
  await lab.locator('[data-action="export"]').click();
  const file = await (await download).path();
  page.once('dialog', dialog => dialog.accept());
  await lab.locator('[data-action="reset"]').click();
  expect(await page.evaluate(() => grammarLabRepository.read().profiles.en)).toBeUndefined();
  page.once('dialog', dialog => dialog.accept());
  await lab.locator('#lab-restore-file').setInputFiles(file);
  await expect(lab.locator('.lab-status')).toHaveText('Đã khôi phục dữ liệu.');
  expect(await page.evaluate(() => grammarLabRepository.read().profiles.en.awards['learn-en-present'])).toBe(10);
});

test('Grammar Lab can open and practice offline after its PWA is ready', async ({ page }) => {
  await openApp(page);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await page.context().setOffline(true);
  try {
    await page.reload({ waitUntil:'load' });
    await page.locator('[aria-controls="view-listening"]').click();
    await page.locator('#open-grammar-lab').click();
    await page.locator('#grammar-lab').getByRole('button', { name:'Luyện nhanh', exact:true }).click();
    await expect(page.locator('#grammar-lab .lab-page')).toContainText('Câu 1/');
  } finally {
    await page.context().setOffline(false);
  }
});

test('a flashcard result updates the learning engine, React statistics, and saved review schedule', async ({ page }) => {
  await openApp(page);
  // Disable effects through the existing control; this test needs no audio or TTS.
  await page.locator('#audio-toggle-btn').click();
  await page.locator('#react-dashboard-root').getByRole('button', { name: 'Bắt đầu ôn tập' }).click();
  await expect(page.locator('#flashcard-mode-select')).toHaveValue('due');
  await expect(page.locator('#card-front-word')).toHaveText('Hello');
  await page.locator('#flashcard-container').click();
  await expect(page.locator('#flashcard-inner')).toHaveClass(/rotate-y-180/);
  await expect(page.locator('#card-back-meaning')).toHaveText('Xin chào');
  await page.locator('#flashcard-controls').getByRole('button', { name: /Đã nhớ/ }).click();
  await expect(page.locator('#card-front-word')).toHaveText('Memory');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('polyglot_words')).find(word => word.id === 'en-new').srsLevel)).toBe(1);
  const nextReview = await page.evaluate(() => JSON.parse(localStorage.getItem('polyglot_words')).find(word => word.id === 'en-new').nextReviewTime);
  expect(nextReview).toBeGreaterThan(Date.now());
  await page.locator('#react-navigation-root button[aria-controls="view-vocab"]').click();
  await expectStats(page, { total: 4, unlearned: 0, learning: 3, mastered: 1, due: 1 });
  await page.reload();
  await expectStats(page, { total: 4, unlearned: 0, learning: 3, mastered: 1, due: 1 });
  await page.locator('#react-dashboard-root').getByRole('button', { name: 'Bắt đầu ôn tập' }).click();
  await expect(page.locator('#card-front-word')).toHaveText('Memory');
  await page.locator('#flashcard-controls').getByRole('button', { name: /Đã nhớ/ }).click();
  await expect(page.locator('#flashcard-end-title')).toHaveText('Hoàn thành lượt ôn!');
  await expect(page.locator('#flashcard-controls')).toBeHidden();
  await expect(page.locator('#flashcard-counter')).toHaveText('1 / 1');
  await page.locator('#lang-btn-zh').click();
  await expect(page.locator('#flashcard-end-title')).toHaveText('Chưa có thẻ để ôn');
  await page.getByRole('button', { name: 'Đổi chế độ ôn' }).click();
  await expect(page.locator('#flashcard-mode-select')).toBeFocused();
  await page.locator('#flashcard-mode-select').selectOption('all');
  await expect(page.locator('#flashcard-controls')).toBeVisible();
});

test('the existing music controls remain connected and close with Escape without playing audio', async ({ page }) => {
  await openApp(page);
  const trigger = page.locator('#music-btn');
  const panel = page.getByRole('dialog', { name: 'Nhạc nền', exact: true });
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click();
  await expect(panel).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(panel.getByRole('button', { name: 'Phát nhạc', exact: true })).toBeVisible();
  await expect(panel.getByRole('slider', { name: 'Âm lượng nhạc nền' })).toHaveValue('40');
  await expect(panel.getByRole('button', { name: 'Chiều muộn' })).toHaveAttribute('aria-pressed', 'true');
  await expect(panel.getByRole('button', { name: 'Mưa đêm' })).toBeVisible();
  await expect(panel.getByRole('button', { name: 'Hoàng hôn' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(await page.evaluate(() => localStorage.getItem('polyglot_music_on'))).toBe('false');
});

test('quick access filters Vietnamese labels, restores focus, and works from another tab', async ({ page }) => {
  await openApp(page);
  const trigger = page.getByRole('button', { name: /Truy cập nhanh/ });
  const dialog = page.getByRole('dialog', { name: 'Hôm nay bạn muốn học gì?' });
  await trigger.click();
  await expect(dialog).toBeVisible();
  const search = dialog.getByRole('textbox', { name: 'Tìm khu vực học tập' });
  await expect(search).toBeFocused();
  await search.fill('luyen ngu phap');
  await expect(dialog.getByRole('button', { name: /Luyện ngữ pháp/ })).toBeVisible();
  await expect(dialog.getByRole('button', { name: /Zombie Survival/ })).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Control+k');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: /Luyện ngữ pháp/ }).click();
  await expect(page.locator('#view-listening')).toBeVisible();
  const nav = page.locator('#react-navigation-root button[aria-controls="view-listening"]');
  await nav.focus();
  await page.keyboard.press('Control+k');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(nav).toBeFocused();
  await page.locator('#react-navigation-root button[aria-controls="view-vocab"]').click();
  await page.locator('#show-add-word-panel').click();
  await expect(page.locator('#input-word')).toBeFocused();
  await page.keyboard.press('Control+k');
  await expect(dialog).toHaveCount(0);
});

test('quick language switching and dark mode persist across reload', async ({ page }) => {
  await openApp(page);
  await page.getByRole('button', { name: /Truy cập nhanh/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Hôm nay bạn muốn học gì?' });
  await dialog.getByRole('button', { name: /Tiếng Hàn/ }).click();
  await expectStats(page, { total: 2, unlearned: 1, learning: 0, mastered: 1, due: 1 });
  await page.locator('button[onclick="toggleDarkMode()"]').click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect.poll(() => page.evaluate(() => window.polyglotUI.getSnapshot().dark)).toBe(true);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.locator('body')).toHaveClass(/theme-ko/);
  await expect(page.locator('.pg-dashboard-language')).toContainText('Tiếng Hàn');
});

for (const width of [390, 320]) {
  test(`the ${width}px mobile layout stays within the viewport while navigation scrolls`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    await openApp(page);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    const wordmark = await page.locator('.studio-brand h1').boundingBox();
    const controls = await page.locator('.studio-controls').boundingBox();
    expect(wordmark.x + wordmark.width).toBeLessThanOrEqual(controls.x);
    await page.screenshot({ path: testInfo.outputPath(`mobile-${width}.png`), fullPage: true });
    const musicTrigger = page.locator('#music-btn');
    const musicPanel = page.locator('#music-panel');
    await musicTrigger.click();
    await expect(musicPanel).toBeVisible();
    await expect.poll(() => musicPanel.evaluate(element => {
      const { left, right } = element.getBoundingClientRect();
      return Math.max(0, -left, right - innerWidth);
    })).toBeLessThanOrEqual(1);
    await page.keyboard.press('Escape');
    await expect(musicPanel).toBeHidden();
    await expect(musicTrigger).toBeFocused();
    const navigation = page.locator('.pg-navigation');
    expect(await navigation.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await expect(page.locator('.studio-header')).toBeInViewport();
    await page.locator('#react-navigation-root button[aria-controls="view-vip"]').click();
    await expect(page.locator('#view-vip')).toBeVisible();
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await page.locator('#react-navigation-root button[aria-controls="view-vocab"]').click();
    await page.getByRole('button', { name: /Truy cập nhanh/ }).click();
    await expect(page.getByRole('dialog', { name: 'Hôm nay bạn muốn học gì?' })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}

test('reduced motion keeps the dashboard and navigation usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openApp(page);
  // Change the preference while a view transition is still active. The visible
  // content must reach its final state even when the animation is cancelled.
  await page.locator('#react-navigation-root button[aria-controls="view-listening"]').click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#view-listening')).toBeVisible();
  await expect(page.locator('#view-listening')).toHaveCSS('opacity', '1');
  await expect(page.locator('#view-listening')).toHaveCSS('transform', 'none');
  await page.locator('#react-navigation-root button[aria-controls="view-vocab"]').click();
  await expect(page.locator('.pg-dashboard')).toHaveCSS('opacity', '1');
  await page.locator('#react-dashboard-root').getByRole('button', { name: 'Bắt đầu ôn tập' }).click();
  await expect(page.locator('#view-flashcards')).toBeVisible();
  await expect(page.locator('#flashcard-counter')).not.toHaveText('0 / 0');
  await page.locator('#react-navigation-root button[aria-controls="view-vocab"]').click();
  await expect(page.locator('.pg-dashboard')).toHaveCSS('opacity', '1');
});

test('the built site can open directly from index.html without a development server', async ({ page }) => {
  const indexPath = fileURLToPath(new URL('../index.html', import.meta.url));
  await openApp(page, pathToFileURL(indexPath).href);
  await expectStats(page, { total: 4, unlearned: 1, learning: 2, mastered: 1, due: 2 });
  await page.locator('#react-navigation-root button[aria-controls="view-listening"]').click();
  await expect(page.locator('#view-listening')).toBeVisible();
});

test('removes login and migrates saved account data to local storage', async ({ page }) => {
  const userId = 'c0ffee00-0000-4000-8000-000000000001';
  let supabaseRequests = 0;
  page.on('request', request => {
    if (new URL(request.url()).hostname.endsWith('.supabase.co')) supabaseRequests += 1;
  });
  await page.addInitScript(({ userId, words }) => {
    localStorage.clear();
    localStorage.setItem('pg_auth_config', JSON.stringify({ url: 'https://polyglot-test.supabase.co', anonKey: 'legacy-key' }));
    localStorage.setItem('pg_auth_session', JSON.stringify({ user: { id: userId } }));
    localStorage.setItem(`pg_user_${userId}_polyglot_words`, JSON.stringify(words));
  }, { userId, words: savedWords });

  await openApp(page);

  await expectStats(page, { total: 4, unlearned: 1, learning: 2, mastered: 1, due: 2 });
  await expect(page.locator('#auth-account-button, #auth-modal')).toHaveCount(0);
  expect(supabaseRequests).toBe(0);
  const words = await page.evaluate(() => JSON.parse(localStorage.getItem('polyglot_words')));
  expect(words.slice(0, savedWords.length)).toEqual(savedWords);
  expect(words.filter(word => word.id.startsWith('starter-v1-ko-'))).toHaveLength(100);
  expect(words.filter(word => word.id.startsWith('starter-v1-zh-'))).toHaveLength(99);
  expect(words.filter(word => word.id.startsWith('starter-v1-ja-'))).toHaveLength(100);
  expect(words.filter(word => word.lang === 'zh' && word.word === '学习')).toHaveLength(1);
  expect(await page.evaluate(() => localStorage.getItem('pg_auth_session'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('pg_auth_config'))).toBeNull();
});
