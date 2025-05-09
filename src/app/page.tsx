'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Navbar } from '@/components/navbar';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import {
  faBrain,
  faCheck,
  faCommentAlt,
  faDownload,
  faEnvelope,
  faLock,
  faSignInAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '@fortawesome/fontawesome-svg-core/styles.css';

// Add icon libraries to the global library
library.add(fas, far, fab);

// Prevent automatic CSS insertion
config.autoAddCss = false;

import { FaBrain, FaCheck, FaCommentAlt, FaDownload, FaEnvelope, FaGithub, FaLock, FaSignInAlt } from 'react-icons/fa';

import { InfoModal } from '@/components/ui/info-modal';
import { fetchProducts } from '@/features/pricing/actions';
import { createSubscriptionInterestAction } from '@/features/pricing/actions/create-subscription-interest-action';
import { Price, ProductWithPrices } from '@/features/pricing/types';
import { createSupabaseBrowserClient } from '@/libs/supabase/supabase-browser-client';
import type { User } from '@supabase/supabase-js';

import appScreenShot from './app-screen-shot.jpg';

const formatPrice = (price: Price | undefined): string => {
  if (!price) return '';
  const amount = price.unit_amount || 0;
  const currency = price.currency || 'usd';
  const interval = price.interval || 'month';

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: (amount / 100) % 1 === 0 ? 0 : 2, // Show cents only if needed
    })
      .format(amount / 100) // Assuming amount is in cents
      .concat(`/${interval}`);
  } catch (error) {
    console.error('Error formatting price:', error);
    return `${amount / 100} ${currency}/${interval}`;
  }
};

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithPrices[]>([]);
  const monthPriceAmount = products[0]?.prices.find((p) => p.interval === 'month')?.unit_amount ?? 1000;
  const yearPriceAmount = products[0]?.prices.find((p) => p.interval === 'year')?.unit_amount ?? 8000;
  const monthlyPrice = products[0]?.prices.find((p) => p.interval === 'month');
  const yearlyPrice = products[0]?.prices.find((p) => p.interval === 'year');
  const [user, setUser] = useState<User | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
        if (href) {
          document.querySelector(href)?.scrollIntoView({
            behavior: 'smooth',
          });
        }
      });
    });

    // Animation for feature cards on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll('.feature-card, .pricing-card').forEach((card) => {
      observer.observe(card);
      (card as HTMLElement).style.opacity = '0';
      card.classList.add('transition-opacity', 'duration-500');
    });

    // Add animation class when in view
    const animateOnScroll = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll('.feature-card, .pricing-card').forEach((el) => {
      animateOnScroll.observe(el);
    });

    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };

    loadProducts();

    const fetchUser = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();

    return () => {
      observer.disconnect();
      animateOnScroll.disconnect();
    };
  }, []);

  const handleGetStartedClick = async (price: Price | undefined, planName: string) => {
    if (!price) {
      console.error('Price not found for', planName);
      setModalTitle('Error');
      setModalMessage('Pricing information is currently unavailable. Please try again later.');
      setIsInfoModalOpen(true);
      return;
    }

    if (!user) {
      router.push('/signup');
      return;
    }

    try {
      const result = await createSubscriptionInterestAction({ price: price });
      setModalTitle(`${planName} Plan Interest`);
      if (result.error) {
        setModalMessage(result.error);
      } else {
        setModalMessage('We will email you when the subscription is available. Thank you for your patience!');
      }
      setIsInfoModalOpen(true);
    } catch (error) {
      console.error('Error creating subscription interest:', error);
      setModalTitle('Error');
      setModalMessage('Something went wrong. Please try again later.');
      setIsInfoModalOpen(true);
    }
  };

  return (
    <>
      {/* Include the same Tailwind CSS CDN as in index.html */}
      <div className='font-sans text-gray-800 antialiased'>
        {/* Navigation */}
        <Navbar />

        {/* Notification Banner */}
        <div className='bg-gray-100 py-2 text-center'>
          <p className='text-sm text-gray-600'>Note: We are not affiliated with Proton AG or ProtonMail in any way</p>
        </div>

        {/* Hero Section */}
        <div className='bg-white'>
          <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
            <div className='text-center'>
              <h1 className='text-4xl font-extrabold tracking-tight text-black md:text-8xl'>The AI Email Agent</h1>
              <p className='mx-auto mt-6 max-w-2xl text-xl text-gray-600'>
                Privacy-First. Open-Source. Offline-Sandbox.
              </p>
              <div className='mt-10 flex justify-center space-x-4'>
                <a
                  href='#pricing'
                  className='inline-flex items-center rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'
                >
                  Download Now
                </a>
                <a
                  href='#features'
                  className='inline-flex items-center rounded-md border border-black bg-white px-6 py-3 text-base font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className='mt-16 flex justify-center'>
              <div className='hero-image max-w-4xl rounded-xl bg-white p-4 shadow-2xl'>
                <Image
                  src={appScreenShot}
                  alt='PhotonChat interface'
                  className='rounded-lg'
                  width={1200}
                  height={675}
                  priority
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id='features' className='bg-white py-16'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='lg:text-center'>
              <h2 className='text-base font-semibold uppercase tracking-wide text-indigo-600'>Features</h2>
              <p className='mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl'>
                Powerful AI for your email data
              </p>
              <p className='mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto'>
                Get intelligent answers from your emails while maintaining complete privacy.
              </p>
            </div>

            <div className='mt-20'>
              <div className='grid grid-cols-1 gap-12 md:grid-cols-3'>
                {/* Feature 1 */}
                <div className='feature-card rounded-lg bg-gray-50 p-8 transition-all duration-300 ease-in-out'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-md bg-black text-white'>
                    <FontAwesomeIcon icon={faEnvelope} className='text-xl' />
                  </div>
                  <div className='mt-5'>
                    <h3 className='text-lg font-medium text-gray-900'>On-Device Agentic RAG</h3>
                    <p className='mt-2 text-base text-gray-500'>
                      Chat with your email using local multi-modal AI agents. No data leaves your computer.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className='feature-card rounded-lg bg-gray-50 p-8 transition-all duration-300 ease-in-out'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-md bg-black text-white'>
                    <FontAwesomeIcon icon={faBrain} className='text-xl' />
                  </div>
                  <div className='mt-5'>
                    <h3 className='text-lg font-medium text-gray-900'>Advanced Deep Reasoning</h3>
                    <p className='mt-2 text-base text-gray-500'>
                      Ask complex questions like &ldquo;When Bob Smith sent me the invoice for the permit last year, did
                      it include all the taxes?&rdquo;
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className='feature-card rounded-lg bg-gray-50 p-8 transition-all duration-300 ease-in-out'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-md bg-black text-white'>
                    <FontAwesomeIcon icon={faLock} className='text-xl' />
                  </div>
                  <div className='mt-5'>
                    <h3 className='text-lg font-medium text-gray-900'>Secure Sandbox</h3>
                    <p className='mt-2 text-base text-gray-500'>
                      All processing happens in a secure sandbox on your device. Open source code means complete
                      transparency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div id='how-it-works' className='bg-gray-50 py-16'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='lg:text-center'>
              <h2 className='text-base font-semibold uppercase tracking-wide text-indigo-600'>How It Works</h2>
              <p className='mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl'>
                Privacy-first AI processing
              </p>
            </div>

            <div className='mt-16'>
              <div className='lg:grid lg:grid-cols-3 lg:gap-8'>
                <div className='relative'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-md bg-black text-white'>
                    <FontAwesomeIcon icon={faDownload} />
                  </div>
                  <h3 className='mt-6 text-lg font-medium text-gray-900'>1. Download & Install</h3>
                  <p className='mt-2 text-base text-gray-500'>
                    Get the PhotonChat application for your operating system. Available for Windows, macOS and Linux.
                  </p>
                </div>

                <div className='relative mt-10 lg:mt-0'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-md bg-black text-white'>
                    <FontAwesomeIcon icon={faSignInAlt} />
                  </div>
                  <h3 className='mt-6 text-lg font-medium text-gray-900'>2. Connect Email Servers</h3>
                  <p className='mt-2 text-base text-gray-500'>
                    Securely authenticate with any IMAP server ( Gmail, Outlook, ProtonMail Bridge, etc )
                  </p>
                </div>

                <div className='relative mt-10 lg:mt-0'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-md bg-black text-white'>
                    <FontAwesomeIcon icon={faCommentAlt} />
                  </div>
                  <h3 className='mt-6 text-lg font-medium text-gray-900'>3. Start Chatting</h3>
                  <p className='mt-2 text-base text-gray-500'>
                    Ask questions naturally and get intelligent answers, all processed locally on your device.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id='pricing' className='bg-white py-16'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='lg:text-center'>
              <h2 className='text-base font-semibold uppercase tracking-wide text-indigo-600'>Pricing</h2>
              <p className='mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl'>
                Simple, transparent pricing
              </p>
              <p className='mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto'>
                Get full access to all PhotonChat features at one low price. All plans start with a 14 day free trial.
              </p>
            </div>

            <div className='mt-16 space-y-12 lg:mx-auto lg:grid lg:max-w-4xl lg:grid-cols-2 lg:gap-x-8 lg:space-y-0'>
              {/* Monthly Plan */}
              <div className='pricing-card relative flex flex-col rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-sm transition-all duration-300 ease-in-out'>
                <div className='flex-1'>
                  <h3 className='text-xl font-semibold text-gray-900'>Monthly Plan</h3>
                  <p className='mt-4 flex items-baseline text-gray-900'>
                    <span className='text-5xl font-extrabold tracking-tight'>${monthPriceAmount / 100}</span>
                    <span className='ml-1 text-xl font-semibold'>/month</span>
                  </p>
                  <p className='mt-6 text-gray-500'>Perfect if you&apos;re not ready to commit long-term.</p>
                  <ul role='list' className='mt-6 space-y-4'>
                    <li className='flex'>
                      <FontAwesomeIcon icon={faCheck} className='mr-2 mt-1 text-black' />
                      <span className='text-gray-500'>Full access to all features and updates</span>
                    </li>
                    <li className='flex'>
                      <FontAwesomeIcon icon={faCheck} className='mr-2 mt-1 text-black' />
                      <span className='text-gray-500'>Cancel anytime</span>
                    </li>
                    <li className='flex'>
                      <FontAwesomeIcon icon={faCheck} className='mr-2 mt-1 text-black' />
                      <span className='text-gray-500'>Priority email support</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handleGetStartedClick(monthlyPrice, 'Monthly')}
                  disabled={!monthlyPrice} // Disable if price is not loaded
                  className='mt-8 block w-full rounded-md border border-transparent bg-black px-6 py-3 text-center font-medium text-white hover:bg-black/90 disabled:opacity-50'
                >
                  Get started
                </button>
              </div>

              {/* Annual Plan */}
              <div className='pricing-card relative flex flex-col rounded-2xl border border-transparent bg-gray-900 p-8 shadow-sm transition-all duration-300 ease-in-out'>
                <div className='absolute right-0 top-0 -mr-4 -mt-4 rounded-full bg-white px-3 py-1 text-sm font-semibold text-black'>
                  Save 33%
                </div>
                <div className='flex-1'>
                  <h3 className='text-xl font-semibold text-white'>Annual Plan</h3>
                  <p className='mt-4 flex items-baseline text-white'>
                    <span className='text-5xl font-extrabold tracking-tight'>${yearPriceAmount / 100}</span>
                    <span className='ml-1 text-xl font-semibold'>/year</span>
                  </p>
                  <p className='mt-6 text-gray-300'>Best value with two months free compared to monthly.</p>
                  <ul role='list' className='mt-6 space-y-4'>
                    <li className='flex'>
                      <FontAwesomeIcon icon={faCheck} className='mr-2 mt-1 text-white' />
                      <span className='text-gray-300'>Full access to all features and updates.</span>
                    </li>
                    <li className='flex'>
                      <FontAwesomeIcon icon={faCheck} className='mr-2 mt-1 text-white' />
                      <span className='text-gray-300'>Priority email support</span>
                    </li>
                    <li className='flex'>
                      <FontAwesomeIcon icon={faCheck} className='mr-2 mt-1 text-white' />
                      <span className='text-gray-300'>Save money by committing</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handleGetStartedClick(yearlyPrice, 'Annual')}
                  disabled={!yearlyPrice} // Disable if price is not loaded
                  className='mt-8 block w-full rounded-md border border-transparent bg-white px-6 py-3 text-center font-medium text-gray-900 hover:bg-gray-100 disabled:opacity-50'
                >
                  Get started
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id='faq' className='bg-gray-50 py-16'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='lg:text-center'>
              <p className='mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl'>
                Frequently asked questions
              </p>
            </div>

            <div className='mx-auto mt-12 max-w-3xl'>
              <div className='space-y-6'>
                {/* Question 1 */}
                <div className='overflow-hidden rounded-lg bg-white shadow'>
                  <div className='px-4 py-5 sm:p-6'>
                    <h3 className='text-lg font-medium text-gray-900'>Is my data really secure?</h3>
                    <div className='mt-2 text-gray-500'>
                      <p>
                        Absolutely. Photon Chat processes all your data locally on your device in a secure sandbox. We
                        never send your emails or any processed data to our servers. All code is open source and can be
                        audited by anyone.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Question 2 */}
                <div className='overflow-hidden rounded-lg bg-white shadow'>
                  <div className='px-4 py-5 sm:p-6'>
                    <h3 className='text-lg font-medium text-gray-900'>What operating systems are supported?</h3>
                    <div className='mt-2 text-gray-500'>
                      <p>
                        Photon Chat currently supports Windows 10+, macOS 10.15+, and most modern Linux distributions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Question 3 */}
                <div className='overflow-hidden rounded-lg bg-white shadow'>
                  <div className='px-4 py-5 sm:p-6'>
                    <h3 className='text-lg font-medium text-gray-900'>Can I try before I buy?</h3>
                    <div className='mt-2 text-gray-500'>
                      <p>
                        Yes! We offer a 14-day free trial with all features enabled. No credit card required to start
                        the trial. You can also build the source code yourself and run the app for free.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Question 4 */}
                <div className='overflow-hidden rounded-lg bg-white shadow'>
                  <div className='px-4 py-5 sm:p-6'>
                    <h3 className='text-lg font-medium text-gray-900'>How do I cancel my subscription?</h3>
                    <div className='mt-2 text-gray-500'>
                      <p>
                        You can cancel anytime from your account settings. If you cancel, you&apos;ll continue to have
                        access until the end of your billing period.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className='bg-black'>
          <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-16'>
            <h2 className='text-3xl font-extrabold tracking-tight text-white sm:text-4xl'>
              <span className='block'>Ready to unlock your email data?</span>
              <span className='block text-gray-300'>Start your free trial today.</span>
            </h2>
            <div className='mt-8 flex lg:mt-0 lg:flex-shrink-0'>
              <div className='inline-flex rounded-md shadow'>
                <a
                  href='#pricing'
                  className='inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-black hover:bg-gray-100'
                >
                  Get started
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className='bg-white'>
          <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
            <div className='xl:grid xl:grid-cols-3 xl:gap-8'>
              <div className='space-y-8 xl:col-span-1'>
                <div className='flex items-center'>
                  <span className='text-xl font-bold text-gray-900'>
                    PhotonChat<span className='text-black'>.ai</span>
                  </span>
                </div>
                <p className='text-base text-gray-500'>The AI Email Agent. Your data stays on your device, always.</p>
              </div>
              <div className='mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0'>
                <div className='md:grid md:grid-cols-2 md:gap-8'>
                  <div>
                    <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-400'>Product</h3>
                    <ul className='mt-4 space-y-4'>
                      <li>
                        <a href='#features' className='text-base text-gray-500 hover:text-gray-900'>
                          {' '}
                          Features{' '}
                        </a>
                      </li>
                      <li>
                        <a href='#pricing' className='text-base text-gray-500 hover:text-gray-900'>
                          {' '}
                          Pricing{' '}
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className='mt-12 md:mt-0'>
                    <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-400'>Company</h3>
                    <ul className='mt-4 space-y-4'>
                      <li>
                        <a href='/about' className='text-base text-gray-500 hover:text-gray-900'>
                          {' '}
                          About{' '}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className='md:grid md:grid-cols-2 md:gap-8'>
                  <div>
                    <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-400'>Legal</h3>
                    <ul className='mt-4 space-y-4'>
                      <li>
                        <a href='/privacy' className='text-base text-gray-500 hover:text-gray-900'>
                          Privacy
                        </a>
                      </li>
                      <li>
                        <a href='/terms' className='text-base text-gray-500 hover:text-gray-900'>
                          Terms
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className='mt-12 md:mt-0'>
                    <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-400'>Support</h3>
                    <ul className='mt-4 space-y-4'>
                      <li>
                        <a href='#faq' className='text-base text-gray-500 hover:text-gray-900'>
                          {' '}
                          FAQ{' '}
                        </a>
                      </li>
                      <li>
                        <a href='/about' className='text-base text-gray-500 hover:text-gray-900'>
                          {' '}
                          Contact{' '}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-12 border-t border-gray-200 pt-8'>
              <p className='text-center text-base text-gray-400'>&copy; 2025 CodeCrafters.llc. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
      {/* Info Modal */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title={modalTitle}
        description={modalMessage || 'This is a preview mode. Purchase functionality is currently disabled.'}
      />
    </>
  );
}
