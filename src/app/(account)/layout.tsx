'use client';

import { Navbar } from '@/components/navbar';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
