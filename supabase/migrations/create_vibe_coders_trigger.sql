-- Create the vibe_coders table if it doesn't exist
create table if not exists public.vibe_coders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  email text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create the function to handle new user signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.vibe_coders (user_id, email, created_at)
  values (new.id, new.email, now());
  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger on auth.users table
create trigger insert_vibe_coder_after_signup
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Add RLS policies to the vibe_coders table
alter table public.vibe_coders enable row level security;

-- Create policy to allow users to read their own data
create policy "Users can view their own vibe_coder data"
  on public.vibe_coders
  for select
  using (auth.uid() = user_id);

-- Create policy to allow users to update their own data
create policy "Users can update their own vibe_coder data"
  on public.vibe_coders
  for update
  using (auth.uid() = user_id);
