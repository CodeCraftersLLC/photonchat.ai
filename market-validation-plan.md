# Market Validation Instrumentation Plan

## Target Branch

`feat/market-validation`

Create the branch from the current product baseline after preserving the existing branding commits. Keep the Supabase-removal plan separate; this branch is focused on measuring demand before further product investment.

## Objective

Instrument the public site so we can answer:

1. Which buttons and conversion links do visitors click?
2. Which page and CTA produced the click?
3. Which referrer, campaign, device, and landing page brought the visitor in?
4. Which organic search queries generate impressions and clicks?
5. Where do visitors stop before signup, Checkout, or a future download/license activation?

## Important Search-Term Constraint

Browser JavaScript cannot reliably recover Google organic search terms. Modern search engines commonly omit the query from the HTTPS referrer, so `document.referrer` may identify Google but not the phrase used.

Use two complementary sources:

- **Google Search Console:** authoritative aggregate data for queries, impressions, clicks, CTR, and average position. Verify the site property, submit the sitemap, and capture a baseline report before changing SEO or page copy.
- **On-site attribution:** capture the referrer host, landing path, UTM parameters, `gclid`/`msclkid` when present, and any explicit query parameter that a referrer actually exposes. Never assume an absent query means the visitor did not arrive from search.

Search Console is the source of truth for organic terms; browser analytics is the source of truth for what visitors do after landing.

## Scope

### Included

- Public landing page, navigation, pricing page, auth links, legal links, external community links, and all rendered `<button>` elements.
- CTA clicks, navigation clicks, external-link clicks, form submissions, and future Checkout/download/license actions.
- First-touch acquisition context and session-level attribution.
- Search Console setup/documentation and a repeatable monthly review.
- Automated tests proving event coverage and payload safety.

### Excluded

- Product feature implementation, email-agent runtime, or Pro entitlement implementation.
- Sending raw visitor emails, search queries, or page text to application logs.
- Building a custom analytics database or dashboard before the first validation readout.
- Treating page views as unique visitors or treating search traffic as paid demand without conversion evidence.

## Recommended Analytics Design

### 1. One analytics adapter

Create a small client-safe adapter such as `src/utils/analytics.ts` or `src/libs/analytics/track.ts`.

- Use the existing Simple Analytics script and its `sa_event(name, metadata)` API as the primary event transport; this avoids adding a dependency or requiring a Vercel Analytics plan upgrade for custom events.
- Keep `@vercel/analytics` optional for pageviews only if the deployment intentionally enables it; do not depend on Vercel custom events for the validation funnel.
- Make tracking fire-and-forget; analytics failures must never block navigation or button behavior.
- Keep provider-specific calls out of page and component code.

### 2. Global click capture with stable IDs

Use a client-side delegated listener mounted once from the root layout or a dedicated analytics provider.

- Capture every rendered `<button>` exactly once.
- Capture anchors that are conversion or navigation controls using `data-analytics-id`.
- Add stable IDs to important links and CTAs rather than relying only on visible copy, which changes frequently.
- Support dynamically rendered buttons and keyboard activation through the DOM event path.
- Ignore analytics-control clicks such as consent or tracking UI only if they are explicitly marked with `data-analytics-skip`.

Suggested event:

```text
ui_click {
  event: "ui_click",
  element_id: "home_hero_download",
  element_type: "button | cta | nav | external_link",
  route: "/",
  target: "#pricing | /pricing | https://...",
  label: "sanitized stable label",
  first_touch_source: "google | direct | bing | ...",
  landing_path: "/",
  utm_source: "optional",
  utm_medium: "optional",
  utm_campaign: "optional"
}
```

Do not include email addresses, auth IDs, free-form form values, message content, full URLs with tokens, or raw query strings in generic click events.

### 3. Explicit conversion events

Generic click tracking answers coverage; named events answer the funnel question. Add stable events for:

- `landing_cta_click`
- `features_anchor_click`
- `pricing_view`
- `pricing_plan_click` with plan/price ID, never payment details
- `signup_click`
- `email_capture_submit` with no email value
- `checkout_started`
- `checkout_completed` from the server/webhook when real Checkout is enabled
- `download_started`
- `license_activation_started` and `license_activated` when that flow exists

The event adapter should allow these events to share the same attribution context.

### 4. First-touch attribution

At the first page load in a browser session, normalize and retain only:

- landing route
- referrer host and classified source (`google`, `bing`, `duckduckgo`, `direct`, `other`)
- UTM values
- ad click IDs when present
- timestamp

Use a short-lived, first-party session cookie or `sessionStorage`; do not create a permanent user profile. Pass this context to later conversion events. If an organic query is explicitly available in the referrer, handle it under a documented privacy policy; otherwise leave the query blank and rely on Search Console.

## Search Console Workstream

1. Verify the production domain property in Google Search Console.
2. Confirm `robots.txt`, canonical metadata, and sitemap availability.
3. Submit the sitemap and record the current baseline for the last 28 days.
4. Export query/page/device/country data before the instrumentation changes.
5. Repeat the report weekly during validation, then monthly.
6. Join query data to on-site funnel data by landing page and time window—not by pretending Search Console exposes user-level identities.
7. Add Bing Webmaster Tools later if Bing traffic becomes material; do not block the first implementation on it.

## Implementation Phases

### Phase 0 — Branch and baseline

- [x] Create `feat/market-validation` from the current product baseline.
- [x] Record the current analytics provider configuration and existing event/pageview behavior.
- [ ] Verify Search Console ownership and capture a 28-day baseline.
- [x] Confirm the event naming and privacy rules in this plan.

### Phase 1 — Analytics foundation

- [x] Add/render the selected analytics provider initialization.
- [x] Implement the centralized event adapter and typed event payloads.
- [x] Implement first-touch source/referrer/UTM normalization.
- [x] Add a single root-level client listener/provider with no duplicate listeners.

### Phase 2 — Site instrumentation

- [x] Add stable analytics IDs to landing-page CTAs, nav links, pricing controls, auth links, legal links, and external community links.
- [x] Verify all `<button>` elements in `src/app`, `src/components`, and pricing/auth UI are covered.
- [x] Add explicit funnel events for pricing, signup, and future Checkout/download actions.
- [x] Add an event for page-level pricing visibility when the pricing section enters the viewport or `/pricing` is visited.

### Phase 3 — Search attribution and reporting

- [x] Add the Search Console setup/runbook to repository documentation.
- [x] Add a small local/debug view or structured console mode for verifying event payloads without exposing production data.
- [x] Document how to compare Search Console queries with analytics source/CTA conversion data.

### Phase 4 — Validation

- [x] Test each annotated homepage button and CTA emits exactly one event.
- [x] Test mouse, keyboard, and dynamically rendered interactions; modal controls use the same delegated listener path.
- [x] Test Google synthetic referrer attribution and preserve direct/other source handling in the adapter.
- [x] Test that event payloads contain no email, token, secret, or raw form values.
- [x] Run typecheck, lint, build, and Playwright coverage tests.
- [x] Preserve the supplied traffic snapshot as the initial baseline; post-deployment Search Console and funnel reporting remains an operator step.

## Acceptance Criteria

- Every rendered button click is observable exactly once with a stable ID and route.
- Important non-button CTAs and external links are observable with explicit IDs.
- Tracking does not change application behavior when the analytics provider is unavailable.
- Referrer source, landing page, UTM values, and available campaign IDs persist into conversion events.
- Organic search queries are reported from Search Console, with the browser-query limitation documented.
- The first report can distinguish discovery traffic from meaningful intent actions.
- No analytics payload contains credentials, auth identifiers, email addresses, payment data, or arbitrary user-entered text.

## Success Metrics for the First Readout

- CTA click-through rate from landing page.
- Pricing-section view rate.
- Signup/email-capture rate.
- Checkout-start and Checkout-completion rate once payment is enabled.
- Organic query groups by impressions, clicks, landing page, and downstream CTA rate.
- Returning visitor rate and source mix.

## Risks and Guardrails

| Risk | Guardrail |
|---|---|
| Google query terms are unavailable in the browser | Use Search Console as the query source of truth |
| Generic text-based IDs become unstable | Require explicit IDs for conversion CTAs |
| Global listeners double-count events | Mount one provider and test exact-once behavior |
| Analytics leaks sensitive data | Typed allow-list payloads; never send form values or full referrers |
| Small sample creates false confidence | Report unique visitors, time window, and denominators alongside rates |
| Tracking script blocks UX | Fire-and-forget adapter with no navigation dependency |

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| `git diff --cached --check` reported an extra blank line at EOF | 1 | Removed the trailing blank line before commit |
| Prettier reported formatting issues in new analytics files | 1 | Ran the repository Prettier formatter and rechecked successfully |
| ESLint defaulted to flat config and could not read `.eslintrc.json` | 1 | Re-ran the changed-file lint with `ESLINT_USE_FLAT_CONFIG=false` |
| A provider patch did not match after import sorting | 1 | Re-read the formatted header and applied a smaller exact patch |
| Prettier could not infer a parser for plain `public/robots.txt` | 1 | Formatted/checks applied to supported source and documentation files; left robots text unchanged except for its sitemap line |
| Playwright could not launch because Chromium was not installed | 1 | Installed the declared Chromium browser with `bunx playwright install chromium` |
| First browser interaction test clicked before the delegated listener was attached | 1 | Registered the listener before emitting `landing_attribution` and added a hydration wait |
| Real Simple Analytics replaced the in-memory browser test probe | 1 | Stubbed the analytics script URL in the Playwright fixture |
| Full ESLint found unsorted Playwright imports | 1 | Applied the repository import sorter, then reran Prettier and lint |
| Prettier found formatting after import sorting and in the baseline report | 1 | Re-ran Prettier after ESLint and verified all supported files |
