import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { Inter, Montserrat, Montserrat_Alternates } from 'next/font/google';
import Link from 'next/link';
import Script from 'next/script';
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from 'react-icons/io5';

import { Logo } from '@/components/logo';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/utils/cn';
import { Analytics } from '@vercel/analytics/react';

import { Navigation } from './navigation';

import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });
const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

const montserratAlternates = Montserrat_Alternates({
  variable: '--font-montserrat-alternates',
  weight: ['500', '600', '700'],
  subsets: ['latin'],
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ProtonChat.ai',
  description: 'Secure Chat with Proton Data',
  keywords: [
    'ProtonChat.ai',
  ],
  category: 'ProtonChat.ai',

  openGraph: {
    title: 'ProtonChat.ai',
    description: 'Secure Chat with Proton Data',
    url: 'https://www.protonchat.ai',
    siteName: 'ProtonChat.ai',
    // images: [
    //   {
    //     url: 'https://www.protonchat.ai/opengraph-image.jpg',
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
    locale: 'en_US',
    type: 'website',
  },

  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'ProtonChat.ai',
  //   description: 'ProtonChat.ai',
  //   creator: '@ProtonChat',
  //   siteId: 'TODO',
  //   creatorId: 'TODO',
  //   images: ['https://www.protonchat.ai/opengraph-image.jpg'],
  // },

  icons: {
    icon: [
      {
        rel: 'icon',
        type: 'image/ico',
        url: '/favicon/favicon.ico',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon/favicon-16x16.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/favicon/android-chrome-192x192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/favicon/android-chrome-512x512.png',
      },
    ],
  },

  manifest: '/favicon/site.webmanifest',

  metadataBase: new URL('https://protonchat.ai'),
  // other: {
  //   'facebook-domain-verification': 'TODO',
  // },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en'>
      <Script async src="https://scripts.simpleanalyticscdn.com/latest.js" />
      <body className={cn('font-sans antialiased', montserrat.variable, montserratAlternates.variable)}>
        {children}
      </body>
    </html>
  );
}

async function AppBar() {
  return (
    <header className='flex items-center justify-between py-8'>
      <Logo />
      <Navigation />
    </header>
  );
}

function Footer() {
  return (
    <footer className='mt-8 flex flex-col gap-8 text-neutral-400 lg:mt-32'>
      <div className='flex flex-col justify-between gap-8 lg:flex-row'>
        <div>
          <Logo />
        </div>
        <div className='grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-4 lg:gap-16'>
          <div className='flex flex-col gap-2 lg:gap-6'>
            <div className='font-semibold text-neutral-100'>Product</div>
            <nav className='flex flex-col gap-2 lg:gap-6'>
              <Link href='/pricing'>Pricing</Link>
            </nav>
          </div>
          <div className='flex flex-col gap-2 lg:gap-6'>
            <div className='font-semibold text-neutral-100'>Company</div>
            <nav className='flex flex-col gap-2 lg:gap-6'>
              <Link href='/about-us'>About Us</Link>
              <Link href='/privacy'>Privacy</Link>
            </nav>
          </div>
          <div className='flex flex-col gap-2 lg:gap-6'>
            <div className='font-semibold text-neutral-100'>Support</div>
            <nav className='flex flex-col gap-2 lg:gap-6'>
              <Link href='/support'>Get Support</Link>
            </nav>
          </div>
          <div className='flex flex-col gap-2 lg:gap-6'>
            <div className='font-semibold text-neutral-100'>Follow us</div>
            <nav className='flex flex-col gap-2 lg:gap-6'>
              <Link href='#'>
                <span className='flex items-center gap-2'>
                  <IoLogoTwitter size={22} /> <span>Twitter</span>
                </span>
              </Link>
              <Link href='#'>
                <span className='flex items-center gap-2'>
                  <IoLogoFacebook size={22} /> <span>Facebook</span>
                </span>
              </Link>
              <Link href='#'>
                <span className='flex items-center gap-2'>
                  <IoLogoInstagram size={22} /> <span>Instagram</span>
                </span>
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className='border-t border-zinc-800 py-6 text-center'>
        <span className='text-neutral4 text-xs'>Copyright {new Date().getFullYear()} Code Crafters LLC</span>
      </div>
    </footer>
  );
}
