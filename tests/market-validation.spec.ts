import { expect, type Page, test } from '@playwright/test';

type CapturedEvent = {
  name: string;
  metadata: Record<string, unknown>;
};

async function installAnalyticsProbe(page: Page) {
  await page.route('https://scripts.simpleanalyticscdn.com/**', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: '',
    }),
  );

  await page.addInitScript(() => {
    const events: CapturedEvent[] = [];
    (window as Window & { __analyticsEvents?: CapturedEvent[] }).__analyticsEvents = events;
    window.sa_event = (name, metadata) => {
      events.push({ name, metadata: metadata ?? {} });
    };
  });
}

async function readEvents(page: Page): Promise<CapturedEvent[]> {
  return page.evaluate(() => (window as Window & { __analyticsEvents?: CapturedEvent[] }).__analyticsEvents ?? []);
}

test('captures first-touch source without storing the raw search term', async ({ page }) => {
  await page.setExtraHTTPHeaders({ referer: 'https://www.google.com/search?q=private+email+ai' });
  await installAnalyticsProbe(page);
  await page.goto('/?analytics_debug=1');

  await expect(page.locator('[data-analytics-id="home_hero_pricing"]')).toBeVisible();

  const attribution = await page.evaluate(() => {
    const raw = window.sessionStorage.getItem('photonchat.first-touch.v1');
    return raw ? JSON.parse(raw) : null;
  });
  expect(attribution).toMatchObject({
    first_touch_source: 'google',
    first_touch_search_query_available: true,
  });
  expect(JSON.stringify(attribution)).not.toContain('private');

  const events = await readEvents(page);
  expect(events.filter((event) => event.name === 'landing_attribution')).toHaveLength(1);
});

test('captures CTA and native button interactions exactly once', async ({ page }) => {
  await installAnalyticsProbe(page);
  await page.goto('/?analytics_debug=1');

  await expect
    .poll(async () => {
      const events = await readEvents(page);
      return events.filter((event) => event.name === 'landing_attribution').length;
    })
    .toBe(1);

  const annotatedControls = page.locator('[data-analytics-id]');
  const controlIds = await annotatedControls.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute('data-analytics-id')),
  );

  for (const control of await annotatedControls.all()) {
    await control.evaluate((element) => {
      element.addEventListener('click', (event) => event.preventDefault(), { once: true });
      element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });
  }

  await expect
    .poll(async () => {
      const events = await readEvents(page);
      return events.filter((event) => event.name !== 'landing_attribution').length;
    })
    .toBe(controlIds.length);

  const events = (await readEvents(page)).filter((event) => event.name !== 'landing_attribution');
  expect(new Set(events.map((event) => event.metadata.element_id))).toEqual(new Set(controlIds));
  expect(events.filter((event) => event.name === 'features_anchor_click')).toHaveLength(1);
  expect(events.filter((event) => event.name === 'pricing_plan_click')).toHaveLength(2);

  for (const event of events) {
    expect(JSON.stringify(event)).not.toMatch(/private\+email|@|token|secret/i);
  }
});

test('captures keyboard activation for dynamically added buttons', async ({ page }) => {
  await installAnalyticsProbe(page);
  await page.goto('/?analytics_debug=1');

  await expect
    .poll(async () => {
      const events = await readEvents(page);
      return events.filter((event) => event.name === 'landing_attribution').length;
    })
    .toBe(1);

  await page.evaluate(() => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.analyticsId = 'dynamic_test_button';
    button.dataset.analyticsEvent = 'dynamic_button_click';
    button.textContent = 'Dynamic test button';
    document.body.append(button);
  });

  const dynamicButton = page.locator('[data-analytics-id="dynamic_test_button"]');
  await dynamicButton.focus();
  await page.keyboard.press('Enter');

  await expect
    .poll(async () => {
      const events = await readEvents(page);
      return events.filter((event) => event.name === 'dynamic_button_click').length;
    })
    .toBe(1);
});

test('gives unannotated buttons distinct privacy-safe fallback IDs', async ({ page }) => {
  await installAnalyticsProbe(page);
  await page.goto('/?analytics_debug=1');

  await expect
    .poll(async () => {
      const events = await readEvents(page);
      return events.filter((event) => event.name === 'landing_attribution').length;
    })
    .toBe(1);

  await page.evaluate(() => {
    for (const label of ['First test button', 'Second test button']) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      document.body.append(button);
      button.click();
    }
  });

  await expect
    .poll(async () => {
      const events = await readEvents(page);
      return events.filter((event) => event.name === 'ui_click').length;
    })
    .toBe(2);

  const clickEvents = (await readEvents(page)).filter((event) => event.name === 'ui_click');
  expect(new Set(clickEvents.map((event) => event.metadata.element_id)).size).toBe(2);
  expect(JSON.stringify(clickEvents)).not.toContain('First test button');
  expect(JSON.stringify(clickEvents)).not.toContain('Second test button');
});
