-- Create a new table for subscription interests
create table subscription_interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  price_id text references prices not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Add a unique constraint to prevent duplicate interests
  unique(user_id, price_id)
);

-- Enable RLS on subscription_interests table
alter table subscription_interests enable row level security;

-- Add policy to allow users to insert their own subscription interests
create policy "Users can create their own subscription interests."
  on subscription_interests for insert
  with check (auth.uid() = user_id);

-- Add policy to allow users to view their own subscription interests
create policy "Users can view their own subscription interests."
  on subscription_interests for select
  using (auth.uid() = user_id);

-- Explicitly deny update and delete operations for users
create policy "Users cannot update their subscription interests."
  on subscription_interests for update
  using (false);

create policy "Users cannot delete their subscription interests."
  on subscription_interests for delete
  using (false); 