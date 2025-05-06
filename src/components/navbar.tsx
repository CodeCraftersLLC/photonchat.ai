'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaDiscord,FaGithub } from 'react-icons/fa';

import { UserProfileMenu } from '@/components/user-profile-menu';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function Navbar() {
  const pathname = usePathname();
  
  // Consistent navbar styling across all pages
  const navBgColor = 'bg-white/90 backdrop-blur shadow-sm';
  const textColor = 'text-gray-900';
  const textHoverColor = 'hover:text-gray-700';
  const loginTextColor = 'text-gray-700';
  
  return (
    <nav className={`${navBgColor} relative z-10`}>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center'>
            <Link href='/' className='flex items-center'>
              <FontAwesomeIcon icon={faLock} className='mr-2 text-2xl text-indigo-600' />
              <span className={`text-xl font-bold ${textColor}`}>
                ProtonChat<span className='text-indigo-600'>.ai</span>
              </span>
            </Link>
          </div>
          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-4'>
              <Link 
                href='/#features' 
                className={`px-3 py-2 text-sm font-medium ${textColor} ${textHoverColor}`}
              >
                Features
              </Link>
              <Link 
                href='/pricing' 
                className={`px-3 py-2 text-sm font-medium ${textColor} ${textHoverColor} ${pathname === '/pricing' ? 'border-b-2 border-indigo-500' : ''}`}
              >
                Pricing
              </Link>
              <Link 
                href='/#faq' 
                className={`px-3 py-2 text-sm font-medium ${textColor} ${textHoverColor}`}
              >
                FAQ
              </Link>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <a
              href='https://github.com/CodeCraftersLLC/protonchat.ai'
              target='_blank'
              rel='noopener noreferrer'
              className={`inline-flex items-center px-4 py-2 ${textColor} ${textHoverColor}`}
            >
              <FaGithub className='text-xl' />
            </a>
            <a
              href='https://discord.gg/d3UxJEz9'
              target='_blank'
              rel='noopener noreferrer'
              className={`inline-flex items-center px-4 py-2 ${textColor} ${textHoverColor}`}
              aria-label='Join our Discord server'
            >
              <FaDiscord className='text-xl' />
            </a>
            <Link
              href='/signup'
              className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              Get Started
            </Link>
            <div className={loginTextColor}>
              <UserProfileMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
