import React from 'react';

import { Navbar } from '@/components/navbar';

export default function PrivacyPage() {
  return (
    <div className='bg-white'>
      <Navbar />

      <main className='prose prose-indigo prose-a:text-indigo-600 mx-auto max-w-3xl px-6 py-10'>
        <h1 className='!mb-8 text-center text-3xl font-bold'>Privacy Policy for ProtonChat.ai</h1>
        <p className='!mt-0 text-sm text-gray-500'>Effective date: {new Date().toISOString().split('T')[0]}</p>

        <h2 className='mt-10 text-xl font-semibold'>Introduction</h2>
        <p>
          Code Crafters LLC (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates the ProtonChat.ai application
          (the &ldquo;Service&rdquo;). We are committed to protecting the privacy of our users (&ldquo;you&rdquo;). This
          Privacy Policy outlines our policies regarding the collection, use, and disclosure of personal information we
          receive from users of the Service.
        </p>
        <p>
          By using the Service, you agree to the collection and use of information in accordance with this Privacy
          Policy. This policy is incorporated into our Terms &amp; Conditions, which also apply when you use our
          Service.
        </p>

        <h2 className='mt-10 text-xl font-semibold'>Collection and Use of Personal Information</h2>
        <p>
          ProtonChat.ai is primarily a client application that stores all personal data directly on your device,
          ensuring your privacy. We do not collect any personal data that could be used to identify you unless it is
          specifically and knowingly provided by you.
        </p>
        <p>
          The only scenarios in which the Service may handle personal data are when you purchase a subscription. In such
          cases, we collect only the necessary details&mdash;such as email address, billing address, or payment
          information&mdash;through our payments partner, Stripe. These details are used exclusively for processing your
          purchase and for providing customer support.
        </p>
        <p>
          We may also collect non-personally identifiable information that your device provides in the normal course of
          interacting with the Service (e.g., device type, operating system, application configuration). Such
          &ldquo;Log&nbsp;Data&rdquo; can include your IP address and is used solely to diagnose issues, administer the
          Service, and analyze trends.
        </p>

        <h2 className='mt-10 text-xl font-semibold'>Use of Third-Party Services</h2>
        <p>
          Our Service may use third-party tools and services to assist with analytics, service optimization, or
          technical support. These may include:
        </p>
        <ul>
          <li>
            <a href='https://stripe.com/legal' target='_blank' rel='noopener noreferrer'>
              Stripe
            </a>
          </li>
        </ul>
        <p>Each third-party service maintains its own Privacy Policy, which we recommend you review.</p>

        <h2 className='mt-10 text-xl font-semibold'>Cookies and Tracking Technologies</h2>
        <p>
          ProtonChat.ai does not directly use cookies. However, some third-party services we utilize may employ cookies
          or similar tracking technologies to monitor interactions with our Service. You can accept or decline cookies
          through your browser settings.
        </p>

        <h2 className='mt-10 text-xl font-semibold'>Security</h2>
        <p>
          The security of your information is important to us. We strive to use commercially acceptable means to protect
          your information, but no method of transmission over the Internet or electronic storage is completely secure.
          While we cannot guarantee absolute security, we remain dedicated to safeguarding your data.
        </p>

        <h2 className='mt-10 text-xl font-semibold'>Links to Other Websites</h2>
        <p>
          The Service may contain links to external websites not operated by us. If you click a third-party link, you
          will be directed to that site. We strongly advise you to review the Privacy Policy of every site you visit; we
          have no control over, and assume no responsibility for, the content or privacy practices of any third-party
          sites.
        </p>

        <h2 className='mt-10 text-xl font-semibold'>Children&rsquo;s Privacy</h2>
        <p>
          Our Service is not directed at children under 13, and we do not knowingly collect personally identifiable
          information from children under 13. If we become aware that we have inadvertently collected such information,
          we will take steps to delete it promptly.
        </p>

        <h2 className='mt-10 text-xl font-semibold'>Privacy Policy Updates</h2>
        <p>
          We reserve the right to update or change our Privacy Policy at any time. Any changes become effective when
          they are posted on this page. We will notify users of material changes by updating the information on this
          page and through the Service.
        </p>

        <h2 className='mt-10 text-xl font-semibold'>Contact Information</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at
          <a href='mailto:support@protonchat.ai'> support@protonchat.ai</a>.
        </p>

        <p>By using ProtonChat.ai, you consent to this Privacy Policy.</p>
      </main>
    </div>
  );
}
