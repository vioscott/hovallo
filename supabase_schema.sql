-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users if using Supabase Auth, or standalone)
-- For this MVP, we assume we are linking to Supabase Auth via 'id' or just using this as the main user table if using custom auth.
-- If using Supabase Auth, 'id' should reference auth.users(id).
create table public.users (
  id uuid references auth.users not null primary key,
  email text unique not null,
  role text check (role in ('tenant', 'landlord', 'agent', 'admin')) default 'tenant',
  name text,
  phone text,
  avatar_url text,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Listings table
create table public.listings (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.users(id) not null,
  title text not null,
  description text,
  price numeric not null,
  currency text default 'USD',
  address_line text,
  city text not null,
  state_province text,
  postal_code text,
  country text,
  property_type text check (property_type in ('apartment', 'house', 'office', 'land', 'other')),
  bedrooms int,
  bathrooms int,
  sqft int,
  status text check (status in ('published', 'draft', 'archived')) default 'draft',
  main_image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Listing Images table
create table public.listing_images (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references public.listings(id) on delete cascade not null,
  url text not null,
  position int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Inquiries table
create table public.inquiries (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references public.listings(id) on delete cascade not null,
  sender_name text not null,
  sender_email text not null,
  sender_phone text,
  message text not null,
  responded boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes
create index users_email_idx on public.users (email);
create index listings_owner_id_idx on public.listings (owner_id);
create index listings_city_idx on public.listings (city);
create index listings_price_idx on public.listings (price);
create index listings_status_idx on public.listings (status);
create index listing_images_listing_id_idx on public.listing_images (listing_id);
create index inquiries_listing_id_idx on public.inquiries (listing_id);

-- RLS Policies (Row Level Security) - Basic setup
alter table public.users enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.inquiries enable row level security;

-- Public read access for listings and images
create policy "Public listings are viewable by everyone" on public.listings
  for select using (status = 'published');

create policy "Images are viewable by everyone" on public.listing_images
  for select using (true);

-- Landlords can insert/update/delete their own listings
create policy "Users can insert their own listings" on public.listings
  for insert with check (auth.uid() = owner_id);

create policy "Users can update their own listings" on public.listings
  for update using (auth.uid() = owner_id);

create policy "Users can delete their own listings" on public.listings
  for delete using (auth.uid() = owner_id);

-- Users can view their own profile
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

-- Public can insert inquiries
create policy "Anyone can create inquiries" on public.inquiries
  for insert with check (true);

-- Landlords can view inquiries for their listings
create policy "Landlords can view inquiries for their listings" on public.inquiries
  for select using (
    exists (
      select 1 from public.listings
      where listings.id = inquiries.listing_id
      and listings.owner_id = auth.uid()
    )
  );
