import Image from 'next/image';

import { getSession } from '@/features/account/controllers/get-session';
import { PricingCard } from '@/features/pricing/components/price-card';
import { getProducts } from '@/features/pricing/controllers/get-products';

import { createCheckoutAction } from '../actions/create-checkout-action';

export async function PricingSection({ isPricingPage }: { isPricingPage?: boolean }) {
  const [products, session] = await Promise.all([getProducts(), getSession()]);

  const HeadingLevel = isPricingPage ? 'h1' : 'h2';

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='py-16 sm:py-24'>
          {/* Header */}
          <div className='mx-auto max-w-4xl text-center'>
            <HeadingLevel
              className={`text-4xl font-extrabold tracking-tight ${
                isPricingPage ? 'text-white' : 'text-gray-900'
              } sm:text-5xl md:text-6xl`}
            >
              Simple, transparent pricing
              <span className={`block ${isPricingPage ? 'text-indigo-200' : 'text-indigo-600'}`}>
                for every use case
              </span>
            </HeadingLevel>
            <p className={`mx-auto mt-6 max-w-2xl text-lg ${isPricingPage ? 'text-gray-200' : 'text-gray-500'}`}>
              Find a plan that fits you. All plans include a 14-day free trial. Upgrade or downgrade at any time.
            </p>
          </div>

          {/* Feature List */}
          <div className='mt-12 text-center'>
            <h3 className={`text-lg font-medium ${isPricingPage ? 'text-white' : 'text-gray-900'}`}>
              All plans include:
            </h3>
            <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6'>
              <div className='rounded-lg bg-white/90 px-4 py-6 shadow-sm ring-1 ring-gray-900/5 backdrop-blur-sm'>
                <div className='text-base font-semibold text-gray-900'>Local Processing</div>
                <div className='mt-2 text-sm text-gray-500'>All data stays on your device</div>
              </div>
              <div className='rounded-lg bg-white/90 px-4 py-6 shadow-sm ring-1 ring-gray-900/5 backdrop-blur-sm'>
                <div className='text-base font-semibold text-gray-900'>Secure Sandbox</div>
                <div className='mt-2 text-sm text-gray-500'>Isolated environment for safety</div>
              </div>
              <div className='rounded-lg bg-white/90 px-4 py-6 shadow-sm ring-1 ring-gray-900/5 backdrop-blur-sm'>
                <div className='text-base font-semibold text-gray-900'>Priority Support</div>
                <div className='mt-2 text-sm text-gray-500'>Get help when you need it</div>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className='mx-auto mt-16'>
            <div className='mx-auto flex max-w-2xl flex-col items-center gap-8 md:flex-row md:justify-center md:space-x-8 md:gap-0'>
              {products.map((product) => (
                <div key={product.id} className='w-full max-w-xs'>
                  <PricingCard
                    product={product}
                    createCheckoutAction={createCheckoutAction}
                    userId={session?.user?.id}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className='mt-16'>
            <h3 className={`text-center text-2xl font-bold ${isPricingPage ? 'text-white' : 'text-gray-900'}`}>
              Frequently asked questions
            </h3>
            <dl className='mt-8 space-y-6 divide-y divide-gray-200/20'>
              <div className='pt-6'>
                <dt className={`text-lg font-medium ${isPricingPage ? 'text-white' : 'text-gray-900'}`}>
                  How does the free trial work?
                </dt>
                <dd className={`mt-2 text-base ${isPricingPage ? 'text-gray-200' : 'text-gray-500'}`}>
                  All plans come with a 14-day free trial. You can cancel at any time during the trial period and
                  won&apos;t be charged.
                </dd>
              </div>
              <div className='pt-6'>
                <dt className={`text-lg font-medium ${isPricingPage ? 'text-white' : 'text-gray-900'}`}>
                  Can I change plans later?
                </dt>
                <dd className={`mt-2 text-base ${isPricingPage ? 'text-gray-200' : 'text-gray-500'}`}>
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </dd>
              </div>
              <div className='pt-6'>
                <dt className={`text-lg font-medium ${isPricingPage ? 'text-white' : 'text-gray-900'}`}>
                  What payment methods do you accept?
                </dt>
                <dd className={`mt-2 text-base ${isPricingPage ? 'text-gray-200' : 'text-gray-500'}`}>
                  We accept all major credit cards and process payments securely through Stripe.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
