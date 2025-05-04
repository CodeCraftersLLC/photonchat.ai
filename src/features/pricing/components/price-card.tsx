'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoCheckmark } from 'react-icons/io5';

import { SexyBoarder } from '@/components/sexy-boarder';
import { Button } from '@/components/ui/button';
import { InfoModal } from '@/components/ui/info-modal';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { createSubscriptionInterestAction } from '../actions/create-subscription-interest-action';
import { PriceCardVariant, productMetadataSchema } from '../models/product-metadata';
import { BillingInterval, Price, ProductWithPrices } from '../types';

export function PricingCard({
  product,
  price,
  createCheckoutAction,
  userId,
}: {
  product: ProductWithPrices;
  price?: Price;
  createCheckoutAction?: ({ price }: { price: Price }) => void;
  userId?: string;
}) {
  const router = useRouter();
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Determine the price to render
  const currentPrice = useMemo(() => {
    if (price) return price;
    if (product.prices.length === 0) return null;
    return product.prices[0];
  }, [price, product.prices]);

  const priceAmount = currentPrice?.unit_amount || 0;
  const interval = currentPrice?.interval || 'month';

  // Add default metadata if missing
  const rawMetadata = (product.metadata as Record<string, string>) || {};
  const defaultMetadata = {
    price_card_variant: 'basic',
    image_editor: 'basic',
    support_level: 'email',
    ...rawMetadata,
  };
  const metadata = productMetadataSchema.parse(defaultMetadata);

  const buttonVariantMap = {
    basic: 'default',
    pro: 'sexy',
    enterprise: 'orange',
  } as const;

  return (
    <WithSexyBorder variant={metadata.priceCardVariant} className='w-full flex-1'>
      <div className='relative flex h-full w-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-200 hover:shadow-xl'>
        <div className='text-center'>
          <h3 className='font-alt text-xl font-bold text-gray-900'>{product.name}</h3>
          <div className='mt-2 flex justify-center gap-1 text-gray-600'>
            <span className='text-2xl font-bold'>{priceAmount ? `$${priceAmount / 100}` : 'Custom'}</span>
            <span className='mt-auto text-gray-500'>{priceAmount ? `/${interval}` : null}</span>
          </div>
        </div>

        <div className='mt-6 flex flex-1 flex-col gap-3'>
          {metadata.generatedImages === 'enterprise' && <CheckItem text={`Unlimited banner images`} />}
          {metadata.generatedImages !== 'enterprise' && (
            <CheckItem text={`Generate ${metadata.generatedImages} banner images`} />
          )}
          {<CheckItem text={`${metadata.imageEditor} image editing features`} />}
          {<CheckItem text={`${metadata.supportLevel} support`} />}
        </div>

        {createCheckoutAction && (
          <div className='mt-6'>
            {currentPrice && (
              <Button
                variant={buttonVariantMap[metadata.priceCardVariant]}
                className='w-full'
                onClick={async () => {
                  if (!userId) {
                    router.push('/signup');
                    return;
                  }
                  try {
                    const result = await createSubscriptionInterestAction({ price: currentPrice, userId });
                    if (result.error) {
                      setModalMessage(result.error);
                    } else {
                      setModalMessage(
                        'We will email you when the subscription is available. Thank you for your patience!'
                      );
                    }
                    setIsInfoModalOpen(true);
                  } catch (error) {
                    console.error('Error creating subscription interest:', error);
                    setModalMessage('Something went wrong. Please try again later.');
                    setIsInfoModalOpen(true);
                  }
                }}
              >
                Get Started
              </Button>
            )}
            {!currentPrice && (
              <Button variant={buttonVariantMap[metadata.priceCardVariant]} className='w-full' asChild>
                <Link href='/contact'>Contact Us</Link>
              </Button>
            )}
          </div>
        )}
      </div>
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title={`${product.name} Plan Details`}
        description={modalMessage || 'This is a preview mode. Purchase functionality is currently disabled.'}
      />
    </WithSexyBorder>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className='flex items-center gap-2'>
      <IoCheckmark className='my-auto flex-shrink-0 text-indigo-600' />
      <p className='text-sm font-medium text-gray-700 first-letter:capitalize'>{text}</p>
    </div>
  );
}

export function WithSexyBorder({
  variant,
  className,
  children,
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant: PriceCardVariant }) {
  if (variant === 'pro') {
    return (
      <SexyBoarder className={className} offset={100}>
        {children}
      </SexyBoarder>
    );
  } else {
    return <div className={className}>{children}</div>;
  }
}

function PricingSwitch({ onChange }: { onChange: (value: BillingInterval) => void }) {
  return (
    <Tabs
      defaultValue='month'
      className='flex items-center'
      onValueChange={(newBillingInterval) => onChange(newBillingInterval as BillingInterval)}
    >
      <TabsList className='m-auto'>
        <TabsTrigger value='month'>Monthly</TabsTrigger>
        <TabsTrigger value='year'>Yearly</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
