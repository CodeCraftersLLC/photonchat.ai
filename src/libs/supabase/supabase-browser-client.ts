// Client-side Supabase client for browser components
'use client';

import { getEnvVar } from '@/utils/get-env-var';
import { createBrowserClient } from '@supabase/ssr';

let supabaseClient: ReturnType<typeof createBrowserClient>;

export function createSupabaseBrowserClient() {
  if (supabaseClient) return supabaseClient;

  supabaseClient = createBrowserClient(
    getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
    getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')
  );

  return supabaseClient;
}
