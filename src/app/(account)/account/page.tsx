import { PropsWithChildren, ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IoPersonCircle, IoSettingsSharp, IoShieldCheckmark, IoWallet } from 'react-icons/io5';

import { Button } from '@/components/ui/button';
import { getSession } from '@/features/account/controllers/get-session';
import { getSubscription } from '@/features/account/controllers/get-subscription';
import { PricingCard } from '@/features/pricing/components/price-card';
import { getProducts } from '@/features/pricing/controllers/get-products';
import { Price, ProductWithPrices } from '@/features/pricing/types';

export default async function AccountPage() {
  const [session, subscription, products] = await Promise.all([getSession(), getSubscription(), getProducts()]);

  if (!session) {
    redirect('/login');
  }

  let userProduct: ProductWithPrices | undefined;
  let userPrice: Price | undefined;

  if (subscription) {
    for (const product of products) {
      for (const price of product.prices) {
        if (price.id === subscription.price_id) {
          userProduct = product;
          userPrice = price;
        }
      }
    }
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='py-12'>
          {/* Header Section */}
          <div className='mb-12 text-center'>
            <h1 className='text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl'>
              Your Account
            </h1>
            <p className='mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl'>
              Manage your subscription and account settings
            </p>
          </div>

          {/* Main Content */}
          <div className='mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
            {/* Quick Links */}
            <Card
              icon={<IoPersonCircle className='h-6 w-6 text-indigo-600' />}
              title='Profile'
              description='View and update your profile information'
              href='/profile'
            />
            <Card
              icon={<IoWallet className='h-6 w-6 text-indigo-600' />}
              title='Billing'
              description='Manage your subscription and billing details'
              href='/manage-subscription'
            />
            <Card
              icon={<IoShieldCheckmark className='h-6 w-6 text-indigo-600' />}
              title='Security'
              description='Update your security preferences'
              href='/security'
            />
            <Card
              icon={<IoSettingsSharp className='h-6 w-6 text-indigo-600' />}
              title='Settings'
              description='Configure your account settings'
              href='/settings'
            />
          </div>

          {/* Subscription Section */}
          <div className='mt-16'>
            <h2 className='mb-8 text-2xl font-bold text-gray-900'>Your Subscription</h2>
            <div className='overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg'>
              <div className='p-6'>
                {userProduct && userPrice ? (
                  <div className='space-y-6'>
                    <PricingCard product={userProduct} price={userPrice} />
                    <div className='flex justify-end border-t border-gray-100 pt-4'>
                      <Button variant='secondary' asChild>
                        <Link href='/manage-subscription'>Manage Subscription</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className='py-8 text-center'>
                    <p className='mb-4 text-gray-500'>You don&apos;t have an active subscription</p>
                    <Button variant='default' asChild>
                      <Link href='/pricing'>View Plans</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({
  icon,
  title,
  description,
  href,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className='block rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-200 hover:border-indigo-100 hover:shadow-xl hover:ring-1 hover:ring-indigo-100'
    >
      <div className='flex items-center gap-4'>
        {icon}
        <div>
          <h3 className='font-semibold text-gray-900'>{title}</h3>
          <p className='mt-1 text-sm text-gray-500'>{description}</p>
        </div>
      </div>
    </Link>
  );
}
