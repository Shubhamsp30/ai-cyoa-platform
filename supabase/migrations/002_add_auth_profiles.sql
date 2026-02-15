-- Create a table for public profiles
create table if not exists public.profiles (
  id uuid not null references auth.users(id) on delete cascade,
  username text,
  email text,
  current_story_id uuid references public.stories(id),
  current_scene_id uuid references public.scenes(id),
  character_role text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id),
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, username)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'username'
  );
  return new;
end;
$$;

-- Trigger to call the function on new user creation
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
