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
  await expect(page.locator('#react-navigation-root .pg-nav-button')).toHaveCount(7);
  await expect(page.locator('.pg-hero')).toBeVisible();
}

async function expectStats(page, { total, unlearned, learning, mastered, due }) {
  await expect(page.locator('.pg-stat-blue .pg-stat-value')).toHaveText(String(total));
  await expect(page.locator('.pg-stat-amber .pg-stat-value')).toHaveText(String(unlearned));
  await expect(page.locator('.pg-stat-violet .pg-stat-value')).toHaveText(String(learning));
  await expect(page.locator('.pg-stat-emerald .pg-stat-value')).toHaveText(String(mastered));
  await expect(page.locator('.pg-hero-badge')).toContainText(`${due} TỪ`);
  const mastery = total ? Math.round(mastered / total * 100) : 0;
  await expect(page.getByRole('progressbar', { name: 'Tỷ lệ từ vựng đã thành thạo' })).toHaveAttribute('aria-valuenow', String(mastery));
}

test('preserves saved vocabulary without a reset marker and shows real statistics for four languages', async ({ page }, testInfo) => {
  await openApp(page);
  await expectStats(page, { total: 4, unlearned: 1, learning: 2, mastered: 1, due: 2 });
  await page.screenshot({ path: testInfo.outputPath('desktop.png'), fullPage: true });
  for (const [lang, stats] of [
    ['ko', { total: 2, unlearned: 1, learning: 0, mastered: 1, due: 1 }],
    ['zh', { total: 1, unlearned: 0, learning: 1, mastered: 0, due: 0 }],
    ['ja', { total: 3, unlearned: 1, learning: 1, mastered: 1, due: 2 }],
  ]) {
    await page.locator(`#lang-btn-${lang}`).click();
    await expectStats(page, stats);
    await expect(page.locator('body')).toHaveClass(new RegExp(`theme-${lang}`));
  }
  await page.reload();
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

test('all seven React navigation controls open the right view and load the game only on demand', async ({ page }) => {
  await openApp(page);
  const frame = page.locator('#zombie-game-frame');
  expect(await frame.getAttribute('src')).toBeNull();
  for (const tab of ['flashcards', 'listening', 'production', 'nemesis', 'vip', 'game', 'vocab']) {
    const button = page.locator(`#react-navigation-root button[aria-controls="view-${tab}"]`);
    await button.click();
    await expect(button).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('.tab-view:visible')).toHaveCount(1);
    await expect(page.locator(`#view-${tab}`)).toBeVisible();
    if (tab !== 'vocab') await expect(page.locator('.pg-hero')).toHaveCount(0);
  }
  await expect(frame).toHaveAttribute('src', './Game_zombie.html');
  await expect(frame).toHaveAttribute('data-loaded', 'true');
  await expect(page.locator('.pg-hero')).toBeVisible();
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
  await search.fill('luyen nghe');
  await expect(dialog.getByRole('button', { name: /Luyện nghe/ })).toBeVisible();
  await expect(dialog.getByRole('button', { name: /Zombie Survival/ })).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Control+k');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: /Luyện nghe/ }).click();
  await expect(page.locator('#view-listening')).toBeVisible();
  const nav = page.locator('#react-navigation-root button[aria-controls="view-listening"]');
  await nav.focus();
  await page.keyboard.press('Control+k');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(nav).toBeFocused();
  await page.locator('#react-navigation-root button[aria-controls="view-vocab"]').click();
  await page.locator('#input-word').focus();
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
  await expect(page.locator('.pg-wordcard-word')).toHaveText('안녕하세요');
});

for (const width of [390, 320]) {
  test(`the ${width}px mobile layout stays within the viewport while navigation scrolls`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    await openApp(page);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await page.screenshot({ path: testInfo.outputPath(`mobile-${width}.png`), fullPage: true });
    const navigation = page.locator('.pg-navigation');
    expect(await navigation.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
    await page.locator('#react-navigation-root button[aria-controls="view-vip"]').click();
    await expect(page.locator('#view-vip')).toBeVisible();
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
  await expect(page.locator('.pg-hero')).toHaveCSS('opacity', '1');
  await page.locator('#react-dashboard-root').getByRole('button', { name: 'Bắt đầu ôn tập' }).click();
  await expect(page.locator('#view-flashcards')).toBeVisible();
  await expect(page.locator('#flashcard-counter')).not.toHaveText('0 / 0');
  await page.locator('#react-navigation-root button[aria-controls="view-vocab"]').click();
  await expect(page.locator('.pg-hero')).toHaveCSS('opacity', '1');
});

test('the built site can open directly from index.html without a development server', async ({ page }) => {
  const indexPath = fileURLToPath(new URL('../index.html', import.meta.url));
  await openApp(page, pathToFileURL(indexPath).href);
  await expectStats(page, { total: 4, unlearned: 1, learning: 2, mastered: 1, due: 2 });
  await page.locator('#react-navigation-root button[aria-controls="view-listening"]').click();
  await expect(page.locator('#view-listening')).toBeVisible();
});

test('signing in migrates local learning data, syncs per-account data, and keeps API keys private', async ({ page }) => {
  const userId = 'c0ffee00-0000-4000-8000-000000000001';
  const cloudData = new Map();
  const handleSupabase = async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname === '/auth/v1/token') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'test-access-token',
          refresh_token: 'test-refresh-token',
          expires_in: 3600,
          user: { id: userId, email: 'alice@example.com' },
        }),
      });
    }
    if (url.pathname === '/rest/v1/user_app_data' && request.method() === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([...cloudData.values()]),
      });
    }
    if (url.pathname === '/rest/v1/user_app_data' && request.method() === 'POST') {
      for (const row of request.postDataJSON()) cloudData.set(row.key, row);
      return route.fulfill({ status: 204, body: '' });
    }
    if (url.pathname === '/auth/v1/logout') return route.fulfill({ status: 204, body: '' });
    return route.fulfill({ status: 404, body: 'Unexpected Supabase request' });
  };
  await page.route('https://polyglot-test.supabase.co/**', handleSupabase);

  await openApp(page);
  await page.locator('#auth-account-button').click();
  await page.locator('#auth-project-url').fill('https://polyglot-test.supabase.co');
  await page.locator('#auth-anon-key').fill('test-publishable-key');
  await page.locator('#auth-config-form button[type="submit"]').click();
  await page.locator('#auth-email').fill('alice@example.com');
  await page.locator('#auth-password').fill('correct-horse-battery');
  await page.locator('#auth-form button[type="submit"]').click();

  await expect(page.locator('#auth-account-label')).toHaveText('alice@example.com');
  await expect(page.locator('#react-navigation-root .pg-nav-button')).toHaveCount(7);
  await expectStats(page, { total: 4, unlearned: 1, learning: 2, mastered: 1, due: 2 });
  expect(cloudData.has('polyglot_words')).toBe(true);
  expect(cloudData.has('polyglot_gemini_key')).toBe(false);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('polyglot_words')))).toEqual(savedWords);

  const secondContext = await page.context().browser().newContext({ baseURL: 'http://127.0.0.1:4173' });
  await secondContext.addInitScript(({ config, session }) => {
    localStorage.setItem('pg_auth_config', JSON.stringify(config));
    localStorage.setItem('pg_auth_session', JSON.stringify(session));
  }, {
    config: { url: 'https://polyglot-test.supabase.co', anonKey: 'test-publishable-key' },
    session: {
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      user: { id: userId, email: 'alice@example.com' },
    },
  });
  await secondContext.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin === 'https://polyglot-test.supabase.co') return handleSupabase(route);
    if (['http:', 'https:'].includes(url.protocol) && !['127.0.0.1', 'localhost'].includes(url.hostname)) return route.abort();
    return route.continue();
  });
  const secondDevice = await secondContext.newPage();
  await openApp(secondDevice);
  await expectStats(secondDevice, { total: 4, unlearned: 1, learning: 2, mastered: 1, due: 2 });
  await expect(secondDevice.locator('#auth-account-label')).toHaveText('alice@example.com');
  await secondContext.close();

  await page.locator('#auth-account-button').click();
  await page.locator('#auth-signout-button').click();
  await expect(page.locator('#auth-account-label')).toHaveText('Đăng nhập');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('polyglot_words')))).toEqual(savedWords);
});
