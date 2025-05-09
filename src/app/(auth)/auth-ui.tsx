'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoLogoGithub, IoLogoGoogle } from 'react-icons/io5';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { ActionResponse } from '@/types/action-response';

const titleMap = {
  login: 'Welcome Back',
  signup: 'Create Your Account',
} as const;

const subtitleMap = {
  login: 'Log in to access your secure chat interface',
  signup: 'Start your journey with PhotonChat.ai',
} as const;

export function AuthUI({
  mode,
  signInWithOAuth,
  signInWithEmail,
}: {
  mode: 'login' | 'signup';
  signInWithOAuth: (provider: 'github' | 'google') => Promise<ActionResponse>;
  signInWithEmail: (email: string) => Promise<ActionResponse>;
}) {
  const [pending, setPending] = useState(false);
  const [emailFormOpen, setEmailFormOpen] = useState(false);

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = event.target as HTMLFormElement;
    const email = form['email'].value;
    const response = await signInWithEmail(email);

    if (response?.error) {
      toast({
        variant: 'destructive',
        description: 'An error occurred while authenticating. Please try again.',
      });
    } else {
      toast({
        description: `To continue, click the link in the email sent to: ${email}`,
      });
    }

    form.reset();
    setPending(false);
  }

  async function handleOAuthClick(provider: 'google' | 'github') {
    setPending(true);
    const response = await signInWithOAuth(provider);

    if (response?.error) {
      toast({
        variant: 'destructive',
        description: 'An error occurred while authenticating. Please try again.',
      });
      setPending(false);
    }
  }

  return (
    <div className='w-full space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl'>
      <div className='space-y-2 text-center'>
        <h2 className='text-2xl font-bold tracking-tight text-gray-900'>{titleMap[mode]}</h2>
      </div>

      <div className='space-y-4'>
        <button
          className='flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-200 hover:bg-gray-50 disabled:opacity-70'
          onClick={() => handleOAuthClick('google')}
          disabled={pending}
        >
          <IoLogoGoogle size={20} className='text-gray-600' />
          Continue with Google
        </button>

        <button
          className='flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-200 hover:bg-gray-50 disabled:opacity-70'
          onClick={() => handleOAuthClick('github')}
          disabled={pending}
        >
          <IoLogoGithub size={20} className='text-gray-600' />
          Continue with GitHub
        </button>

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-200'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='bg-white px-2 text-gray-500'>Or continue with</span>
          </div>
        </div>

        <Collapsible open={emailFormOpen} onOpenChange={setEmailFormOpen}>
          <CollapsibleTrigger asChild>
            <button
              className='flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-500 disabled:opacity-70'
              disabled={pending}
            >
              Email
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='mt-3 rounded-lg bg-gray-50 p-4'>
              <form onSubmit={handleEmailSubmit} className='space-y-4'>
                <Input
                  type='email'
                  name='email'
                  placeholder='Enter your email'
                  aria-label='Enter your email'
                  autoFocus
                  className='border-gray-300 bg-white text-gray-900 placeholder:text-gray-400'
                />
                <div className='flex justify-end gap-2'>
                  <Button
                    type='button'
                    onClick={() => setEmailFormOpen(false)}
                    className='bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                  >
                    Cancel
                  </Button>
                  <Button type='submit' className='bg-indigo-600 text-white hover:bg-indigo-500'>
                    Continue
                  </Button>
                </div>
              </form>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {mode === 'signup' ? (
        <p className='text-center text-sm text-gray-500'>
          By continuing, you agree to our{' '}
          <Link href='/terms' className='text-indigo-600 hover:text-indigo-500'>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href='/privacy' className='text-indigo-600 hover:text-indigo-500'>
            Privacy Policy
          </Link>
          .
        </p>
      ) : (
        <p className='text-center text-sm text-gray-500'>
          Don&apos;t have an account?{' '}
          <Link href='/signup' className='text-indigo-600 hover:text-indigo-500'>
            Sign up
          </Link>
        </p>
      )}
    </div>
  );
}
