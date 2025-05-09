import React from 'react';

import { Navbar } from '@/components/navbar';

export default function AboutPage() {
  return (
    <div className='bg-white'>
      <Navbar />

      <main className='prose prose-indigo prose-a:text-indigo-600 mx-auto max-w-3xl px-6 py-10'>
        <h1 className='!mb-8 text-center text-3xl font-bold'>About Us</h1>

        <div className='mb-12 text-center'>
          <h2 className='text-xl font-semibold'>Code Crafters LLC</h2>
          <p className='text-lg'>
            We are a small team of indie hackers that love building open source software for privacy enthusiasts.
          </p>
        </div>

        <div className='mt-10'>
          <h2 className='mb-4 text-xl font-semibold'>Our Mission</h2>
          <p>
            At Code Crafters, we believe privacy should be accessible to everyone. We're dedicated to creating tools
            that respect user data and give people control over their digital lives.
          </p>
          <p>
            PhotonChat.ai is built with this philosophy in mind - a powerful AI tool that works entirely on your device,
            keeping your data private and secure.
          </p>
        </div>

        <div className='mt-10'>
          <h2 className='mb-4 text-xl font-semibold'>Open Source Commitment</h2>
          <p>
            We're passionate about open source software. By making our code publicly available, we ensure transparency,
            enable community contributions, and make privacy-respecting technology accessible to all.
          </p>
          <p>
            Our projects are built in the open, allowing anyone to inspect the code, verify our privacy claims, and
            contribute to making better software for everyone.
          </p>
        </div>

        <div className='mt-10'>
          <h2 className='mb-4 text-xl font-semibold'>Get In Touch</h2>
          <p>
            We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, you can reach
            us at <a href='mailto:support@photonchat.ai'>support@codecrafters.llc</a>
          </p>
        </div>
      </main>
    </div>
  );
}
