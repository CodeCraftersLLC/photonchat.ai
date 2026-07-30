'use client';

import { type PropsWithChildren, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import {
  type AnalyticsMetadata,
  captureFirstTouchAttribution,
  type FirstTouchAttribution,
  trackEvent,
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

  const path: string[] = [];
  let current: HTMLElement | null = element;

  while (current && path.length < 4) {
    const siblingIndex = current.parentElement ? Array.from(current.parentElement.children).indexOf(current) : 0;
    path.unshift(`${current.tagName.toLowerCase()}_${siblingIndex}`);
    current = current.parentElement;
  }

  return `auto_${path.join('_')}`;
}

function getElementType(element: HTMLElement): string {
  if (element.tagName.toLowerCase() === 'button') return 'button';
  if (element.dataset.analyticsId) return 'cta';
  return 'role_button';
}

function getEventName(element: HTMLElement): string {
  return element.dataset.analyticsEvent?.trim() || 'ui_click';
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
    plan: element.dataset.analyticsPlan ?? null,
    location: element.dataset.analyticsLocation ?? null,
  };
}

export function AnalyticsProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/pricing') {
      trackEvent('pricing_view', { location: 'pricing_page', route: pathname });
    }
  }, [pathname]);

  useEffect(() => {
    const { attribution, isNew } = captureFirstTouchAttribution();

    const handleClick = (event: MouseEvent) => {
      const element = getInteractiveElement(event.target);
      if (!element || element.dataset.analyticsSkip !== undefined) return;

      trackEvent(getEventName(element), getClickMetadata(element, attribution));
    };

    document.addEventListener('click', handleClick, true);
    if (isNew) trackEvent('landing_attribution', attribution);

    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return children;
}
