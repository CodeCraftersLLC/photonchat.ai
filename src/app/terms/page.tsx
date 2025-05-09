import React from 'react';

import { Navbar } from '@/components/navbar';

export default function TermsPage() {
  return (
    <div className='bg-white'>
      <Navbar />

      <main className='prose prose-indigo prose-a:text-indigo-600 mx-auto max-w-3xl px-6 py-10'>
        <h1 className='!mb-8 text-center text-3xl font-bold'>Terms &amp; Conditions for PhotonChat.ai</h1>
        <p className='!mt-0 text-sm text-gray-500'>Effective date: {new Date().toISOString().split('T')[0]}</p>

        <h2 className='mt-10 text-xl font-semibold'>Introduction</h2>
        <p>
          By downloading, installing, or using PhotonChat.ai (the &ldquo;App&rdquo;), these Terms &amp; Conditions (the
          &ldquo;Terms&rdquo;) will automatically apply to you. Please read them carefully before using the App.
        </p>

        <p>
          PhotonChat.ai is committed to ensuring that the App is as useful and efficient as possible. Therefore, we
          reserve the right to make changes to the App or to charge for its services at any time and for any reason. We
          will never charge you for the App or its services without making it very clear to you exactly what you are
          paying for.
        </p>

        <p>
          The App stores and processes personal data that you have provided to us in order to deliver our Service. It is
          your responsibility to keep your devices—and access to the App—secure. We therefore recommend that you do not
          jailbreak or root your device, which is the process of removing software restrictions and limitations imposed
          by the official operating system. Doing so may make your device vulnerable to malware, compromise security
          features, and result in PhotonChat.ai malfunctioning or not working at all.
        </p>

        <h2 className='mt-10 text-xl font-semibold'>Third-Party Services</h2>
        <p>The App uses third-party services that have their own Terms &amp; Conditions.</p>
        <p>Links to Terms &amp; Conditions of third-party service providers used by the App:</p>
        <ul>
          <li>
            <a href='https://stripe.com/legal' target='_blank' rel='noopener noreferrer'>
              Stripe
            </a>
          </li>
        </ul>

        <h2 className='mt-10 text-xl font-semibold'>Device Responsibilities</h2>
        <p>
          PhotonChat.ai cannot always take responsibility for how you use the App. For example, it is your
          responsibility to ensure that your device remains charged. If your device runs out of battery and you cannot
          turn it on to use the Service, PhotonChat.ai cannot accept responsibility.
        </p>

        <h2 className='mt-10 text-xl font-semibold'>Accuracy of Information</h2>
        <p>
          While we endeavor to keep the App updated and correct at all times, we rely on third parties to provide
          information to us. PhotonChat.ai accepts no liability for any loss—direct or indirect—that you experience as a
          result of relying wholly on the functionality of the App.
        </p>

        <h2 className='mt-10 text-xl font-semibold'>Updates &amp; Termination</h2>
        <p>
          At some point we may wish to update the App. The App is currently available for Windows, macOS, and Linux. The
          requirements for these systems (and for any additional systems we decide to extend availability to) may
          change, and you will need to download the updates if you want to keep using the App. PhotonChat.ai does not
          promise that it will always update the App so that it is relevant to you and/or works with your installed
          operating-system version. However, you agree to always accept updates to the App when offered. We may also
          wish to stop providing the App and may terminate use of it at any time without notice. Unless we tell you
          otherwise, upon any termination: (a) the rights and licenses granted to you in these Terms will end; and (b)
          you must stop using the App and delete it from your device.
        </p>

        <h2 className='mt-10 text-xl font-semibold'>Changes to These Terms &amp; Conditions</h2>
        <p>
          We may update our Terms &amp; Conditions from time to time. Therefore, you are advised to review this page
          periodically for any changes. We will notify you of changes by posting the new Terms &amp; Conditions on this
          page.
        </p>

        <h2 className='mt-10 text-xl font-semibold'>Contact Information</h2>
        <p>
          If you have any questions or suggestions about our Terms &amp; Conditions, do not hesitate to contact us at
          <a href='mailto:support@photonchat.ai'> support@photonchat.ai</a>.
        </p>

        <p>These Terms &amp; Conditions are effective as of the date shown above.</p>
      </main>
    </div>
  );
}
