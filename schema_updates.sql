-- Schema Updates for Feature Enhancements
-- Run this in Supabase SQL Editor after the main schema

-- ============================================
-- 1. FAVORITES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, listing_id)
);

-- Indexes for favorites
CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS favorites_listing_id_idx ON public.favorites(listing_id);
CREATE INDEX IF NOT EXISTS favorites_created_at_idx ON public.favorites(created_at DESC);

-- RLS for favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 2. BROWSING HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.browsing_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for browsing history
CREATE INDEX IF NOT EXISTS browsing_history_user_id_idx ON public.browsing_history(user_id);
CREATE INDEX IF NOT EXISTS browsing_history_listing_id_idx ON public.browsing_history(listing_id);
CREATE INDEX IF NOT EXISTS browsing_history_viewed_at_idx ON public.browsing_history(viewed_at DESC);

-- RLS for browsing history
ALTER TABLE public.browsing_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own browsing history" ON public.browsing_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own browsing history" ON public.browsing_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own browsing history" ON public.browsing_history
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 3. ADD NEW COLUMNS TO LISTINGS TABLE
-- ============================================

-- Add year_built column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'listings' 
    AND column_name = 'year_built'
  ) THEN
    ALTER TABLE public.listings ADD COLUMN year_built INT;
  END IF;
END $$;

-- Add lot_size column (in square feet)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'listings' 
    AND column_name = 'lot_size'
  ) THEN
    ALTER TABLE public.listings ADD COLUMN lot_size INT;
  END IF;
END $$;

-- Add latitude column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'listings' 
    AND column_name = 'latitude'
  ) THEN
    ALTER TABLE public.listings ADD COLUMN latitude DECIMAL(10, 8);
  END IF;
END $$;

-- Add longitude column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'listings' 
    AND column_name = 'longitude'
  ) THEN
    ALTER TABLE public.listings ADD COLUMN longitude DECIMAL(11, 8);
  END IF;
END $$;

-- Add hoa_fees column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'listings' 
    AND column_name = 'hoa_fees'
  ) THEN
    ALTER TABLE public.listings ADD COLUMN hoa_fees DECIMAL(10, 2) DEFAULT 0;
  END IF;
END $$;

-- Add video_tour_url column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'listings' 
    AND column_name = 'video_tour_url'
  ) THEN
    ALTER TABLE public.listings ADD COLUMN video_tour_url TEXT;
  END IF;
END $$;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS listings_year_built_idx ON public.listings(year_built);
CREATE INDEX IF NOT EXISTS listings_lot_size_idx ON public.listings(lot_size);
CREATE INDEX IF NOT EXISTS listings_location_idx ON public.listings(latitude, longitude);

-- ============================================
-- 4. HELPER FUNCTIONS
-- ============================================

-- Function to get user's favorite count
CREATE OR REPLACE FUNCTION get_user_favorites_count(user_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM public.favorites WHERE user_id = user_uuid;
$$ LANGUAGE SQL STABLE;

-- Function to check if a listing is favorited by a user
CREATE OR REPLACE FUNCTION is_listing_favorited(user_uuid UUID, listing_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.favorites 
    WHERE user_id = user_uuid AND listing_id = listing_uuid
  );
$$ LANGUAGE SQL STABLE;

-- ============================================
-- 5. UPDATE EXISTING SCHEMA (if needed)
-- ============================================

-- Ensure listings table has all required columns from original schema
-- This is safe to run even if columns exist

-- Update property table name if using 'properties' instead of 'listings'
-- Note: Based on storage.ts, it seems the table is called 'properties'
-- Let's create the same structure for 'properties' table

-- Create properties table if it doesn't exist (matching storage.ts expectations)
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('house', 'apartment', 'condo', 'studio', 'office', 'land', 'other')),
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'NGN',
  address TEXT,
  city TEXT NOT NULL,
  state TEXT,
  zip TEXT,
  bedrooms INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  sqft INT,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('published', 'draft', 'archived')) DEFAULT 'draft',
  year_built INT,
  lot_size INT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  hoa_fees DECIMAL(10, 2) DEFAULT 0,
  video_tour_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for properties table
CREATE INDEX IF NOT EXISTS properties_user_id_idx ON public.properties(user_id);
CREATE INDEX IF NOT EXISTS properties_city_idx ON public.properties(city);
CREATE INDEX IF NOT EXISTS properties_price_idx ON public.properties(price);
CREATE INDEX IF NOT EXISTS properties_status_idx ON public.properties(status);
CREATE INDEX IF NOT EXISTS properties_type_idx ON public.properties(type);
CREATE INDEX IF NOT EXISTS properties_bedrooms_idx ON public.properties(bedrooms);
CREATE INDEX IF NOT EXISTS properties_bathrooms_idx ON public.properties(bathrooms);
CREATE INDEX IF NOT EXISTS properties_year_built_idx ON public.properties(year_built);
CREATE INDEX IF NOT EXISTS properties_created_at_idx ON public.properties(created_at DESC);

-- RLS for properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Public can view published properties
CREATE POLICY "Published properties are viewable by everyone" ON public.properties
  FOR SELECT USING (status = 'published');

-- Users can view their own properties (any status)
CREATE POLICY "Users can view their own properties" ON public.properties
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own properties
CREATE POLICY "Users can insert their own properties" ON public.properties
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own properties
CREATE POLICY "Users can update their own properties" ON public.properties
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own properties
CREATE POLICY "Users can delete their own properties" ON public.properties
  FOR DELETE USING (auth.uid() = user_id);

-- Admins can view all properties
CREATE POLICY "Admins can view all properties" ON public.properties
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Admins can update any property
CREATE POLICY "Admins can update any property" ON public.properties
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Update favorites to reference properties instead of listings
ALTER TABLE public.favorites DROP CONSTRAINT IF EXISTS favorites_listing_id_fkey;
ALTER TABLE public.favorites ADD CONSTRAINT favorites_listing_id_fkey 
  FOREIGN KEY (listing_id) REFERENCES public.properties(id) ON DELETE CASCADE;

-- Update browsing_history to reference properties instead of listings
ALTER TABLE public.browsing_history DROP CONSTRAINT IF EXISTS browsing_history_listing_id_fkey;
ALTER TABLE public.browsing_history ADD CONSTRAINT browsing_history_listing_id_fkey 
  FOREIGN KEY (listing_id) REFERENCES public.properties(id) ON DELETE CASCADE;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these to verify the migration worked:
-- SELECT COUNT(*) FROM public.favorites;
-- SELECT COUNT(*) FROM public.browsing_history;
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'properties';
