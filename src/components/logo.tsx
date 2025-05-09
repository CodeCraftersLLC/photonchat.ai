import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href='/' className='flex w-fit items-center gap-2'>
      <Image src='/photon-chat-logo.png' alt='Photon Chat Logo' width={40} height={40} />
      <span className='font-alt text-xl text-white'>Photon Chat</span>
    </Link>
  );
}
