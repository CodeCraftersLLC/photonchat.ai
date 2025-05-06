'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import type { Database } from '@/libs/supabase/types';

type Price = Database['public']['Tables']['prices']['Row'];

const supabaseDB = supabaseAdminClient as unknown as typeof supabaseAdminClient & {
  from: (table: 'subscription_interests') => any;
};

export async function createSubscriptionInterestAction({ price }: { price: Price }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
      console.error('Authentication error:', authError);
      return { error: 'User must be authenticated to express interest.' };
  }

  try {
    const { data, error } = await supabaseDB
      .from('subscription_interests')
      .insert([
        {
          price_id: price.id,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation
        return { error: 'You have already expressed interest in this plan. We will email you when it is available.' };
      }
      console.error('Error creating subscription interest:', error);
      throw error;
    }

    return { data: data as Database['public']['Tables']['subscription_interests']['Row'] };
  } catch (error) {
    console.error('Error creating subscription interest:', error);
    throw error;
  }
}
