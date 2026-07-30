# Code Map

> Photon Chat is a Next.js App Router marketing, authentication, pricing, and subscription-management application for an AI email-agent product.

## Current Scope

The repository contains the public Photon Chat site and its account/billing shell. It does not currently contain the email-ingestion, local-agent, RAG, or chat-runtime implementation; those capabilities are represented in the product copy and screenshots.

## Tech Stack

| Layer | Technology |
|---|---|
| Web app | Next.js 15 App Router, React 19, TypeScript |
| Styling | Tailwind CSS 3, Radix UI primitives, Font Awesome, React Icons |
| Auth and database | Supabase Auth, `@supabase/ssr`, PostgreSQL with RLS |
| Billing | Stripe Node SDK, Checkout, Billing Portal, signed webhooks |
| Email | Resend client and React Email template support |
| Deployment/analytics | Vercel-compatible Next.js deployment, Vercel Analytics, Simple Analytics script |
| Package/build tooling | Bun lockfile, npm-compatible scripts, ESLint, Prettier, Playwright |

## Architecture

```text
┌────────────────────────────────────────────────────────────────────┐
│                         Photon Chat web app                        │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Browser                                                            │
│    │                                                               │
│    ├── Public App Router pages                                     │
│    │     /  /pricing  /about  /privacy  /terms                    │
│    │                                                               │
│    ├── Auth pages and callback                                     │
│    │     /login  /signup  /auth/callback                          │
│    │                                                               │
│    └── Account pages and client UI                                 │
│          /account  /account/manage-subscription                    │
│                                                                    │
│    ┌───────────────────────┐       ┌────────────────────────────┐  │
│    │ Supabase SSR clients  │──────→│ Supabase Auth + PostgreSQL  │  │
│    │ browser/server/edge   │←──────│ users, products, prices,    │  │
│    └───────────────────────┘       │ customers, subscriptions    │  │
│                                    └────────────────────────────┘  │
│                                                                    │
│    ┌───────────────────────┐       ┌────────────────────────────┐  │
│    │ Server actions and    │──────→│ Stripe                      │  │
│    │ feature controllers   │←──────│ Checkout + Billing Portal   │  │
│    └───────────────────────┘       └──────────────┬─────────────┘  │
│                                                   │                │
│    ┌───────────────────────┐  signed POST         │                │
│    │ /api/webhooks         │←─────────────────────┘                │
│    │ product/price/sub sync│──────→ Supabase admin client          │
│    └───────────────────────┘                                      │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```text
repo/
├── src/app/                 # App Router pages, layouts, auth, and route handlers
│   ├── (auth)/              # Login/signup actions, UI, and Supabase callback
│   ├── (account)/           # Account layout/page and Stripe portal redirect
│   ├── api/webhooks/        # Stripe webhook endpoint
│   ├── page.tsx             # Client-rendered landing page
│   └── layout.tsx           # Root metadata, fonts, analytics, and global shell
├── src/components/          # Shared navigation, account UI, and Radix-based UI
├── src/features/
│   ├── account/             # Session, user, customer, and subscription controllers
│   ├── pricing/             # Product display, pricing actions, and Stripe sync
│   └── emails/              # React Email templates and email Tailwind config
├── src/libs/                # External-service clients (Supabase, Stripe, Resend)
├── src/utils/               # Environment, URL, date, and class-name helpers
├── supabase/                # Local config, schema migrations, and seed entrypoint
├── public/                  # Favicons, logos, and static product assets
├── out/                     # Existing generated Next build output; not source
└── package.json             # Development, build, email, Stripe, and Supabase scripts
```

## Entry Points and Routes

| Purpose | File/route | Description |
|---|---|---|
| Root shell | `src/app/layout.tsx` | Global fonts, metadata, analytics, styles, and root HTML shell |
| Landing page | `src/app/page.tsx` (`/`) | Client-side marketing page; fetches public pricing and checks browser auth |
| Pricing | `src/app/pricing/page.tsx` (`/pricing`) | Server-rendered pricing section backed by active Supabase products/prices |
| Auth UI | `src/app/(auth)/login/page.tsx`, `signup/page.tsx` | Passwordless/email and OAuth entry UI |
| Auth actions | `src/app/(auth)/auth-actions.ts` | Supabase OAuth, email OTP, and sign-out server actions |
| Auth callback | `src/app/(auth)/auth/callback/route.ts` (`/auth/callback`) | Verifies OTP or exchanges PKCE code, then redirects based on subscription state |
| Account | `src/app/(account)/account/page.tsx` (`/account`) | Server page; requires a session and displays subscription/account state |
| Stripe portal | `src/app/(account)/manage-subscription/route.ts` | Creates a Stripe Billing Portal session and redirects the user |
| Stripe webhook | `src/app/api/webhooks/route.ts` (`POST /api/webhooks`) | Verifies Stripe signatures and syncs products, prices, and subscriptions |
| Static/legal pages | `src/app/about`, `privacy`, `terms` | Public informational and legal pages |
| Middleware | `src/middleware.ts` | Refreshes Supabase auth cookies for non-static requests |

## Key Modules

### Presentation (`src/components/`, `src/app/`)

- `Navbar` is the active shared navigation used by public and account pages.
- `src/app/layout.tsx` owns document metadata, fonts, global CSS, analytics, and the legacy `Navigation`/footer shell.
- `src/app/page.tsx` is a client component with landing-page animations, browser auth lookup, pricing loading, and subscription-interest feedback.
- `src/components/ui/` contains reusable Radix/Tailwind primitives such as buttons, dialogs, sheets, tabs, toasts, and dropdowns.

### Authentication (`src/app/(auth)/`, `src/libs/supabase/`)

- Supabase Auth supports OAuth providers, email OTP/magic links, and sign-out.
- `supabase-server-client.ts` carries cookies through server actions/pages; `supabase-browser-client.ts` is used by client components.
- `supabase-middleware-client.ts` refreshes the auth session on matched requests.
- The middleware refreshes sessions but does not enforce route guards; `/account` performs its own redirect to `/login`.

### Pricing and billing (`src/features/pricing/`, `src/features/account/`)

- `get-products.ts` reads active products and active prices from Supabase, ordered by product metadata and price amount.
- `PricingSection` and `PricingCard` render product metadata validated by `product-metadata.ts`.
- `create-subscription-interest-action.ts` inserts a user/price pair into `subscription_interests` and handles duplicate-interest errors.
- `create-checkout-action.ts` contains the Stripe Checkout flow and customer creation path. The current pricing-card “Get Started” interaction invokes subscription-interest recording rather than checkout.
- `get-or-create-customer.ts` maps Supabase users to Stripe customer IDs in the private `customers` table.
- `manage-subscription/route.ts` creates a Stripe Billing Portal session for an existing mapped customer.

### Stripe synchronization (`src/app/api/webhooks/`, `src/features/*/controllers/`)

- Product and price create/update events upsert Stripe catalog data into Supabase.
- Checkout completion and subscription create/update/delete events retrieve the subscription and upsert its current state.
- Subscription synchronization resolves the application user through the `customers.stripe_customer_id` mapping and can copy billing details into `users`.

### Data layer (`supabase/`)

- `users` is created from Supabase Auth via a database trigger and is user-readable/user-updatable under RLS.
- `customers` is service-role-only mapping data.
- `products` and `prices` are publicly readable catalog tables synchronized from Stripe.
- `subscriptions` is user-readable subscription state; `subscription_interests` allows users to insert/view their own interest records and prevents updates/deletes.
- `src/libs/supabase/types.ts` is the generated TypeScript database contract consumed by controllers and feature types.

## Primary Runtime Flows

### Authentication

```text
Login/Signup → Supabase OAuth or email OTP → /auth/callback
             → verify code/token → establish cookies
             → active subscription? /account : /pricing
```

### Pricing and interest capture

```text
Pricing page/landing page → getProducts() → active Supabase products/prices
                         → user clicks Get Started
                         → unauthenticated: /signup
                         → authenticated: insert subscription_interests
```

### Stripe subscription synchronization

```text
Stripe Checkout/Subscription event
        → POST /api/webhooks
        → verify stripe-signature
        → upsert product/price/subscription
        → resolve user through customers table
        → persist billing/subscription state in Supabase
```

## Configuration and Integrations

| Integration | Main files | Environment/config |
|---|---|---|
| Supabase Auth/DB | `src/libs/supabase/*.ts` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| Stripe | `src/libs/stripe/stripe-admin.ts`, webhook/actions | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL` |
| Resend | `src/libs/resend/resend-client.ts`, `src/features/emails/` | `RESEND_API_KEY` |
| Frontend assets | `next.config.js`, `public/` | Remote image hosts include Google user content and GitHub avatars |
| Supabase CLI | `package.json`, `supabase/` | Project ref and local env via Supabase CLI scripts |

## Conventions

- `@/*` resolves to `src/*`.
- Server-only data access lives in server components, server actions, route handlers, or feature controllers.
- Supabase service-role access is isolated to admin controllers and must not be imported into browser components.
- Stripe-originated catalog and subscription state is persisted through webhook handlers rather than trusted from browser input.
- Styling is primarily Tailwind utility classes; shared primitives live under `src/components/ui/`.
- Runtime configuration is accessed through `getEnvVar`, which throws when a required variable is missing.
