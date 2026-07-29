export type AnalyticsValue = string | number | boolean | null;
export type AnalyticsMetadata = Record<string, AnalyticsValue>;

export type FirstTouchAttribution = {
  first_touch_source: 'google' | 'bing' | 'duckduckgo' | 'yahoo' | 'other' | 'direct';
  first_touch_referrer_host: string;
  first_touch_landing_path: string;
  first_touch_utm_source: string;
  first_touch_utm_medium: string;
  first_touch_utm_campaign: string;
  first_touch_has_gclid: boolean;
  first_touch_has_msclkid: boolean;
  first_touch_search_query_available: boolean;
};

type SimpleAnalyticsEvent = {
  (eventName: string, metadata?: AnalyticsMetadata): void;
  q?: unknown[][];
};

declare global {
  interface Window {
    sa_event?: SimpleAnalyticsEvent;
  }
}

const FIRST_TOUCH_STORAGE_KEY = 'photonchat.first-touch.v1';
const MAX_VALUE_LENGTH = 255;

function getDirectAttribution(landingPath = '/'): FirstTouchAttribution {
  return {
    first_touch_source: 'direct',
    first_touch_referrer_host: '',
    first_touch_landing_path: landingPath,
    first_touch_utm_source: '',
    first_touch_utm_medium: '',
    first_touch_utm_campaign: '',
    first_touch_has_gclid: false,
    first_touch_has_msclkid: false,
    first_touch_search_query_available: false,
  };
}

function normalizeEventName(eventName: string): string {
  const normalized = eventName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_');
  return normalized.slice(0, 200) || 'unnamed_event';
}

function normalizeMetadata(metadata: AnalyticsMetadata): AnalyticsMetadata {
  return Object.fromEntries(
    Object.entries(metadata)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [
        key.replace(/[^a-zA-Z0-9_]+/g, '_').slice(0, MAX_VALUE_LENGTH),
        typeof value === 'string' ? value.slice(0, MAX_VALUE_LENGTH) : value,
      ]),
  );
}

export function trackEvent(eventName: string, metadata: AnalyticsMetadata = {}): void {
  if (typeof window === 'undefined') return;

  try {
    const normalizedEventName = normalizeEventName(eventName);
    const normalizedMetadata = normalizeMetadata(metadata);

    if (process.env.NODE_ENV === 'development' || new URLSearchParams(window.location.search).has('analytics_debug')) {
      console.debug('[analytics]', normalizedEventName, normalizedMetadata);
    }

    window.sa_event?.(normalizedEventName, normalizedMetadata);
  } catch {
    // Analytics must never block navigation or the underlying user action.
  }
}

function classifyReferrer(hostname: string): FirstTouchAttribution['first_touch_source'] {
  const host = hostname.toLowerCase();

  if (!host) return 'direct';
  if (host.includes('google.')) return 'google';
  if (host.includes('bing.com')) return 'bing';
  if (host.includes('duckduckgo.com')) return 'duckduckgo';
  if (host.includes('yahoo.')) return 'yahoo';
  return 'other';
}

function readSearchQueryAvailability(referrer: URL | null, source: FirstTouchAttribution['first_touch_source']) {
  if (!referrer || source === 'direct' || source === 'other') return false;

  return ['q', 'query', 'p', 'text'].some((key) => referrer.searchParams.has(key));
}

function parseUrl(value: string): URL | null {
  if (!value) return null;

  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function getAttributionFromWindow(): FirstTouchAttribution {
  const currentUrl = new URL(window.location.href);
  const referrerUrl = parseUrl(document.referrer);
  const source = classifyReferrer(referrerUrl?.hostname ?? '');

  return {
    first_touch_source: source,
    first_touch_referrer_host: referrerUrl?.hostname ?? '',
    first_touch_landing_path: currentUrl.pathname,
    first_touch_utm_source: currentUrl.searchParams.get('utm_source')?.slice(0, MAX_VALUE_LENGTH) ?? '',
    first_touch_utm_medium: currentUrl.searchParams.get('utm_medium')?.slice(0, MAX_VALUE_LENGTH) ?? '',
    first_touch_utm_campaign: currentUrl.searchParams.get('utm_campaign')?.slice(0, MAX_VALUE_LENGTH) ?? '',
    first_touch_has_gclid: currentUrl.searchParams.has('gclid'),
    first_touch_has_msclkid: currentUrl.searchParams.has('msclkid'),
    first_touch_search_query_available: readSearchQueryAvailability(referrerUrl, source),
  };
}

function getAttributionSafely(): FirstTouchAttribution {
  try {
    return getAttributionFromWindow();
  } catch {
    return getDirectAttribution(window.location.pathname || '/');
  }
}

function isFirstTouchAttribution(value: unknown): value is FirstTouchAttribution {
  if (!value || typeof value !== 'object') return false;

  const attribution = value as Partial<FirstTouchAttribution>;
  return (
    ['google', 'bing', 'duckduckgo', 'yahoo', 'other', 'direct'].includes(attribution.first_touch_source ?? '') &&
    typeof attribution.first_touch_referrer_host === 'string' &&
    typeof attribution.first_touch_landing_path === 'string' &&
    typeof attribution.first_touch_utm_source === 'string' &&
    typeof attribution.first_touch_utm_medium === 'string' &&
    typeof attribution.first_touch_utm_campaign === 'string' &&
    typeof attribution.first_touch_has_gclid === 'boolean' &&
    typeof attribution.first_touch_has_msclkid === 'boolean' &&
    typeof attribution.first_touch_search_query_available === 'boolean'
  );
}

export function captureFirstTouchAttribution(): { attribution: FirstTouchAttribution; isNew: boolean } {
  if (typeof window === 'undefined') {
    return { attribution: getDirectAttribution(), isNew: false };
  }

  try {
    const existing = window.sessionStorage.getItem(FIRST_TOUCH_STORAGE_KEY);
    if (existing) {
      const parsed = JSON.parse(existing) as unknown;
      if (isFirstTouchAttribution(parsed)) {
        return { attribution: parsed, isNew: false };
      }
    }

    const attribution = getAttributionFromWindow();
    window.sessionStorage.setItem(FIRST_TOUCH_STORAGE_KEY, JSON.stringify(attribution));
    return { attribution, isNew: true };
  } catch {
    return { attribution: getAttributionSafely(), isNew: true };
  }
}
