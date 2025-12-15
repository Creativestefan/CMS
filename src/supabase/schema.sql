-- Create tables for the CMS

-- Profiles table (for general site info)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  name text,
  bio text,
  twitter text,
  linkedin text,
  github text,
  dribbble text,
  location text,
  lets_talk_url text,
  updated_at timestamp with time zone,
  constraint profiles_id_key unique (id)
);

-- Works table
create table if not exists public.works (
  id uuid default uuid_generate_v4() primary key,
  year text,
  client text,
  type text,
  subtype text,
  link text,
  "order" integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Playground Items table
create table if not exists public.playground_items (
  id uuid default uuid_generate_v4() primary key,
  media_url text,
  media_type text, -- 'image', 'video', 'gif'
  category text,
  external_link text,
  "order" integer,
  featured boolean default false,
  score integer default 5,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Work Experience table
create table if not exists public.work_experience (
  id uuid default uuid_generate_v4() primary key,
  start_year text,
  end_year text,
  position text,
  company text,
  company_logo text,
  company_link text,
  "order" integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- About Data table (stores profile image and bio paragraphs)
create table if not exists public.about_data (
  id uuid default uuid_generate_v4() primary key,
  profile_image text,
  bio text[], -- Array of strings for paragraphs
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.works enable row level security;
alter table public.playground_items enable row level security;
alter table public.work_experience enable row level security;
alter table public.about_data enable row level security;

-- Create policies (modify as needed for public access vs admin access)
-- Allow public read access
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Public works are viewable by everyone." on public.works for select using (true);
create policy "Public playground items are viewable by everyone." on public.playground_items for select using (true);
create policy "Public work experience are viewable by everyone." on public.work_experience for select using (true);
create policy "Public about data are viewable by everyone." on public.about_data for select using (true);

-- Allow authenticated users (admin) to insert/update/delete
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- For other tables, assuming single admin user or shared admin access:
create policy "Authenticated users can insert works." on public.works for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update works." on public.works for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete works." on public.works for delete using (auth.role() = 'authenticated');

create policy "Authenticated users can insert playground items." on public.playground_items for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update playground items." on public.playground_items for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete playground items." on public.playground_items for delete using (auth.role() = 'authenticated');

create policy "Authenticated users can insert work experience." on public.work_experience for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update work experience." on public.work_experience for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete work experience." on public.work_experience for delete using (auth.role() = 'authenticated');

create policy "Authenticated users can insert about data." on public.about_data for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update about data." on public.about_data for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete about data." on public.about_data for delete using (auth.role() = 'authenticated');
