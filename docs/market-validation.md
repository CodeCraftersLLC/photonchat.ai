# Market Validation Measurement

This repository measures on-site behavior with Simple Analytics custom events and uses Google Search Console for organic search-query data.

## Search Console setup

1. Open [Google Search Console](https://search.google.com/search-console) and add the production domain property for `photonchat.ai`.
2. Verify ownership using the DNS method preferred by the domain owner.
3. Confirm that `https://photonchat.ai/robots.txt` is reachable and contains `https://photonchat.ai/sitemap.xml`.
4. Submit `https://photonchat.ai/sitemap.xml` in the Sitemaps panel.
5. Capture a 28-day baseline for Search results → Queries, Pages, Countries, and Devices before changing SEO copy.
6. Review the same report weekly during validation, recording impressions, clicks, CTR, average position, and the landing page for each query group.

Search Console reports aggregate query data. It does not provide a user-level join from a search term to a specific click event, and browser referrers often omit Google’s query string. Join Search Console and Simple Analytics by time window, landing page, source, and funnel stage.

## Event transport

The root `AnalyticsProvider` sends custom events through the existing Simple Analytics `sa_event` function. Tracking is fire-and-forget and must not block navigation or form behavior.

The following event names are used by the current site:

| Event                   | Meaning                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| `landing_attribution`   | First-touch source, landing path, campaign IDs, and whether a search query was exposed by the referrer |
| `ui_click`              | Any unannotated native button or role-button interaction                                               |
| `landing_cta_click`     | Hero or final landing-page CTA                                                                         |
| `features_anchor_click` | Hero link to the features section                                                                      |
| `pricing_view`          | Pricing section became visible or `/pricing` was visited                                               |
| `pricing_plan_click`    | Monthly/annual or pricing-card plan action                                                             |
| `signup_click`          | Link that sends a visitor to signup                                                                    |
| `auth_provider_click`   | Google/GitHub auth action                                                                              |
| `auth_email_submit`     | Passwordless email auth submission; email value is never included                                      |
| `nav_click`             | Internal navigation link                                                                               |
| `external_link_click`   | GitHub, Discord, or another external destination                                                       |

All payload values are allow-listed primitive metadata. Query strings, email addresses, auth IDs, tokens, payment data, and arbitrary form values are excluded.

## Local verification

Run the app locally, open a page with `?analytics_debug=1`, and use the browser console to inspect sanitized events such as:

```text
[analytics] landing_attribution { first_touch_source: "direct", ... }
[analytics] landing_cta_click { element_id: "home_hero_pricing", route: "/", ... }
```

To test synthetic attribution, use a browser test or devtools override with referrers from Google, Bing, DuckDuckGo, and a direct navigation. The application records the referrer host and query-availability flag; it does not claim to recover a query that the search engine did not send.

## First validation report

Report these denominators together, rather than relying on raw counts:

- unique visitors and landing-page views by source;
- pricing-section views divided by landing-page views;
- signup/email actions divided by landing-page views;
- Checkout starts and completions once real Checkout is enabled;
- Search Console impressions, clicks, CTR, and position by query group and landing page;
- returning visitors and downstream CTA rate by source.
