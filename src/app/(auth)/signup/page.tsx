import { redirect } from 'next/navigation';

import { getSession } from '@/features/account/controllers/get-session';
import { getSubscription } from '@/features/account/controllers/get-subscription';

import { signInWithEmail, signInWithOAuth } from '../auth-actions';
import { AuthUI } from '../auth-ui';

export default async function SignUp() {
  const session = await getSession();
  const subscription = await getSubscription();

  if (session && subscription) {
    redirect('/account');
  }

  if (session && !subscription) {
    redirect('/pricing');
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8'>
          <div className='mb-8 text-center'>
            <h1 className='text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl'>
              Join <span className='text-indigo-600'>PhotonChat.ai</span>
            </h1>
            <p className='mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl'>
              Start chatting with your email data securely, privately, and intelligently.
            </p>
          </div>

          <div className='w-full max-w-md'>
            <AuthUI mode='signup' signInWithOAuth={signInWithOAuth} signInWithEmail={signInWithEmail} />
          </div>
        </div>
      </div>
    </div>
  );
}
