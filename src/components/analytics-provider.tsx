'use client';

import { useEffect, type PropsWithChildren } from 'react';

import {
  captureFirstTouchAttribution,
  trackEvent,
  type AnalyticsMetadata,
  type FirstTouchAttribution,
} from '@/libs/analytics/analytics';

function getInteractiveElement(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null;

  const interactiveElement = target.closest('button, a[data-analytics-id], [role="button"]');
  return interactiveElement instanceof HTMLElement ? interactiveElement : null;
}

function getElementId(element: HTMLElement): string {
  const explicitId = element.dataset.analyticsId?.trim();
  if (explicitId) return explicitId;

  const ariaLabel = element.getAttribute('aria-label')?.trim();
  if (ariaLabel)
    return `auto_${ariaLabel
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .slice(0, 80)}`;

  return `auto_${element.tagName.toLowerCase()}_unnamed`;
}

function getElementType(element: HTMLElement): string {
  if (element.tagName.toLowerCase() === 'button') return 'button';
  if (element.dataset.analyticsId) return 'cta';
  return 'role_button';
}

function getSafeTarget(element: HTMLElement): string {
  const href = element.getAttribute('href');
  if (!href) return element.dataset.analyticsAction?.slice(0, 255) ?? 'button_action';

  try {
    const url = new URL(href, window.location.origin);
    if (url.origin === window.location.origin) return url.pathname;
    return `${url.hostname}${url.pathname}`.slice(0, 255);
  } catch {
    return 'invalid_target';
  }
}

function getClickMetadata(element: HTMLElement, attribution: FirstTouchAttribution): AnalyticsMetadata {
  return {
    ...attribution,
    element_id: getElementId(element),
    element_type: getElementType(element),
    route: window.location.pathname,
    target: getSafeTarget(element),
  };
}

export function AnalyticsProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const { attribution, isNew } = captureFirstTouchAttribution();

    if (isNew) trackEvent('landing_attribution', attribution);

    const handleClick = (event: MouseEvent) => {
      const element = getInteractiveElement(event.target);
      if (!element || element.dataset.analyticsSkip !== undefined) return;

      trackEvent('ui_click', getClickMetadata(element, attribution));
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return children;
}
