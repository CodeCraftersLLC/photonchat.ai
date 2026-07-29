# Initial Market Validation Baseline

Source: analytics snapshot supplied during the `feat/market-validation` planning session. The exact reporting date and unique-visitor denominator were not included, so these values are directional counts rather than conversion rates.

## Referrals

| Source              |   Count |
| ------------------- | ------: |
| Google              |     138 |
| Direct              |      15 |
| accounts.google.com |       4 |
| Bing                |       4 |
| DuckDuckGo          |       1 |
| search.nort…        |       1 |
| Yahoo Japan         |       1 |
| **Listed total**    | **164** |

Google represents approximately 84% of the listed referrals.

## Page paths

| Path             |   Count |
| ---------------- | ------: |
| `/`              |     171 |
| `/signup`        |       6 |
| `/about`         |       3 |
| `/pricing`       |       2 |
| **Listed total** | **182** |

The path rows are not assumed to equal unique visitors or total site traffic.

## Other dimensions

The supplied report showed a dominant device segment at 85%, a dominant browser segment at 84%, and a country distribution led by segments at 66% and 22%. The pasted data did not preserve the dimension labels, so those segments must not be interpreted as a specific device, browser, or country without a fresh export.

## Interpretation

This is a promising organic-discovery signal, not yet proof of paid demand. The snapshot does not contain search queries, unique visitors, CTA clicks, email captures, Checkout starts, Checkout completions, or repeat-visitor cohorts.

## Next report

After deployment of the market-validation instrumentation:

- export Search Console queries, impressions, clicks, CTR, position, and landing pages;
- export Simple Analytics events for `landing_attribution`, `pricing_view`, CTA events, signup, and Checkout;
- join the reports by landing page and time window;
- include unique-visitor denominators and conversion rates;
- compare against this baseline without treating raw referral counts as demand proof.
