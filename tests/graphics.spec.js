import { test as base, expect } from '@playwright/test';

const test = base.extend({
  launchOptions: [async ({ launchOptions }, use) => {
    await use({
      ...launchOptions,
      args: [...(launchOptions.args ?? []), '--enable-unsafe-swiftshader'],
    });
  }, { scope: 'worker' }],
  page: async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error' && message.text().startsWith('THREE.')) errors.push(message.text());
    });
    await page.route('https://**', route => route.abort());
    await page.addInitScript(() => {
      localStorage.setItem('polyglot_starter_vocabulary_v1', 'true');
      localStorage.setItem('polyglot_lang', 'en');
      localStorage.setItem('polyglot_music_on', 'false');
      localStorage.setItem('polyglot_words', JSON.stringify([
        { id: 'graphics-test', lang: 'en', word: 'Hello', meaning: 'Xin chào', srsLevel: 0, nextReviewTime: 0 },
      ]));
    });
    await use(page);
    expect(errors).toEqual([]);
  },
});

test.use({
  reducedMotion: 'reduce',
  serviceWorkers: 'block',
  viewport: { width: 960, height: 740 },
});

async function startGame(page) {
  await page.locator('#react-navigation-root [aria-controls="view-game"]').click();
  const frame = page.locator('#zombie-game-frame');
  await expect(frame).toHaveAttribute('data-loaded', 'true', { timeout: 15_000 });
  const game = frame.contentFrame();
  await game.locator('#bStart').click();
  await expect(game.locator('#bStart')).toBeHidden();
  await expect(game.locator('#fire')).toBeVisible();
  return game;
}

async function expectDrawCalls(canvas) {
  await expect(canvas).toBeVisible();
  await expect.poll(() => canvas.evaluate(element => window.testWebglDraws.has(element))).toBe(true);
}

test('Three.js draws the study deck and Zombie arena while vocabulary answers work', async ({ page }) => {
  await page.addInitScript(() => {
    const drawnCanvases = new WeakSet();
    const prototype = WebGL2RenderingContext.prototype;
    for (const method of ['drawArrays', 'drawElements']) {
      const draw = prototype[method];
      prototype[method] = function (...args) {
        draw.apply(this, args);
        drawnCanvases.add(this.canvas);
      };
    }
    window.testWebglDraws = drawnCanvases;
  });
  await page.goto('/');
  await expectDrawCalls(page.locator('.pg-deck[data-renderer="webgl"] canvas'));

  const game = await startGame(page);
  const arena = game.locator('#arena-backdrop');
  await expectDrawCalls(arena.locator('canvas'));
  const canvas = game.locator('#cv');
  await canvas.evaluate(() => {
    // Keep the normal spawn and answer handlers without waiting on the countdown.
    window.game.spawn = 0;
  });
  await expect.poll(() => canvas.evaluate(() => window.game.z.length)).toBeGreaterThan(0);
  await canvas.click();
  await page.keyboard.type('hello');
  await expect(game.locator('#inp')).toHaveText('hello');
  await game.locator('#fire').click();
  await expect(game.locator('#stage-count')).toHaveText('1/10');
  await expect(game.locator('#sc')).toHaveText('35');

  await page.locator('#react-navigation-root [aria-controls="view-vocab"]').click();
  await expect(arena).toHaveAttribute('hidden', '');
  await expectDrawCalls(page.locator('.pg-deck[data-renderer="webgl"] canvas'));
});

test('study deck and Zombie arena use their fallbacks when WebGL 2 is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type === 'webgl2' ? null : getContext.call(this, type, ...args);
    };
  });
  await page.goto('/');
  await expect(page.locator('.pg-deck-fallback')).toBeVisible();
  await expect(page.locator('.pg-deck canvas')).toHaveCount(0);
  await page.locator('#lang-btn-ko').click();
  await expect(page.locator('.pg-deck-card-face[data-lang="ko"]')).toContainText('한');
  await page.locator('#lang-btn-en').click();

  const game = await startGame(page);
  await expect(game.locator('#arena-backdrop')).toHaveAttribute('hidden', '');
  await expect(game.locator('#arena-backdrop canvas')).toHaveCount(0);
  await expect.poll(() => game.locator('#cv').evaluate(canvas => {
    const context = canvas.getContext('2d');
    return context.getImageData(canvas.width >> 1, canvas.height >> 1, 1, 1).data[3];
  })).toBe(255);
});
