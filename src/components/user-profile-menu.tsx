'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';

import { createSupabaseBrowserClient } from '@/libs/supabase/supabase-browser-client';

type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
};

export function UserProfileMenu() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setIsLoading(false);
    };
    
    fetchUser();
  }, []);
  
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsOpen(false);
    router.refresh();
  };
  
  if (isLoading) {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>;
  }
  
  if (!user) {
    return null;
  }
  
  const initials = user.user_metadata?.full_name 
    ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email?.substring(0, 2).toUpperCase() || 'U';
  
  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-expanded={isOpen}
      >
        {user.user_metadata?.avatar_url ? (
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <Image 
              src={user.user_metadata.avatar_url} 
              alt={user.user_metadata?.full_name || user.email || 'User'}
              className="object-cover"
              fill
              sizes="40px"
            />
          </div>
        ) : (
          <span className="text-sm font-medium">{initials}</span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="border-b border-gray-100 px-4 py-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.user_metadata?.full_name || user.email}
            </p>
            {user.email && <p className="text-xs text-gray-500 truncate">{user.email}</p>}
          </div>
          
          <Link 
            href="/account" 
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <FaCog className="mr-2 h-4 w-4" />
            Account Settings
          </Link>
          
          <button 
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FaSignOutAlt className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
