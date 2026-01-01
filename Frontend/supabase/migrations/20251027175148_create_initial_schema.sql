/*
  # Initial Schema Setup for Writer Platform

  ## Overview
  Creates the foundational database structure for a writer platform with authentication,
  article management, follow relationships, and notifications.

  ## New Tables

  ### 1. profiles
  Stores writer profile information linked to Supabase auth users
  - `id` (uuid, primary key) - Unique profile identifier
  - `user_id` (uuid, references auth.users) - Links to Supabase auth user
  - `name` (text) - Writer's display name
  - `bio` (text) - Writer's biography
  - `avatar_url` (text, nullable) - Profile picture URL
  - `follower_count` (integer) - Cached count of followers
  - `article_count` (integer) - Cached count of published articles
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last profile update timestamp

  ### 2. articles
  Stores all articles written by users (drafts and published)
  - `id` (uuid, primary key) - Unique article identifier
  - `writer_id` (uuid, references profiles) - Article author
  - `title` (text) - Article title
  - `content` (text) - Full article content (HTML)
  - `excerpt` (text, nullable) - Short description/preview
  - `cover_image` (text, nullable) - Cover image URL
  - `status` (text) - Article status: 'DRAFT' or 'PUBLISHED'
  - `tags` (text[], array) - Article tags for categorization
  - `read_time` (integer) - Estimated reading time in minutes
  - `created_at` (timestamptz) - Article creation timestamp
  - `updated_at` (timestamptz) - Last article update timestamp
  - `published_at` (timestamptz, nullable) - Publication timestamp

  ### 3. follows
  Tracks follow relationships between writers
  - `id` (uuid, primary key) - Unique follow relationship identifier
  - `follower_id` (uuid, references profiles) - Writer who is following
  - `following_id` (uuid, references profiles) - Writer being followed
  - `created_at` (timestamptz) - Follow relationship creation timestamp
  - Unique constraint on (follower_id, following_id) to prevent duplicate follows

  ### 4. notifications
  Stores notifications for writers about new articles and other events
  - `id` (uuid, primary key) - Unique notification identifier
  - `recipient_id` (uuid, references profiles) - Notification recipient
  - `sender_id` (uuid, references profiles, nullable) - Notification sender
  - `article_id` (uuid, references articles, nullable) - Related article if applicable
  - `type` (text) - Notification type: 'new_article', 'new_follower', etc.
  - `message` (text) - Notification message text
  - `read` (boolean) - Whether notification has been read
  - `created_at` (timestamptz) - Notification creation timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Profiles: Users can read all profiles, update only their own
  - Articles: Users can read published articles and their own drafts, manage only their own articles
  - Follows: Users can read all follows, create/delete only their own follows
  - Notifications: Users can only read and update their own notifications

  ## Indexes
  - Create indexes on foreign keys and frequently queried columns for performance
  - Index on article status and published_at for efficient feed queries
  - Index on notification recipient_id and read status for notification queries
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name text NOT NULL,
  bio text DEFAULT '',
  avatar_url text,
  follower_count integer DEFAULT 0,
  article_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  writer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text DEFAULT '',
  excerpt text,
  cover_image text,
  status text DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED')),
  tags text[] DEFAULT '{}',
  read_time integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

-- Create follows table
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  type text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_articles_writer_id ON articles(writer_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(recipient_id, read);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for articles table
CREATE POLICY "Published articles are viewable by everyone"
  ON articles FOR SELECT
  TO authenticated
  USING (status = 'PUBLISHED' OR writer_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (writer_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own articles"
  ON articles FOR UPDATE
  TO authenticated
  USING (writer_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ))
  WITH CHECK (writer_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own articles"
  ON articles FOR DELETE
  TO authenticated
  USING (writer_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

-- RLS Policies for follows table
CREATE POLICY "Follows are viewable by everyone"
  ON follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can follow others"
  ON follows FOR INSERT
  TO authenticated
  WITH CHECK (follower_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can unfollow others"
  ON follows FOR DELETE
  TO authenticated
  USING (follower_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

-- RLS Policies for notifications table
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (recipient_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (recipient_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ))
  WITH CHECK (recipient_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to update follower count
CREATE OR REPLACE FUNCTION update_follower_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles
    SET follower_count = follower_count + 1
    WHERE id = NEW.following_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles
    SET follower_count = follower_count - 1
    WHERE id = OLD.following_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update follower count
DROP TRIGGER IF EXISTS update_follower_count_trigger ON follows;
CREATE TRIGGER update_follower_count_trigger
  AFTER INSERT OR DELETE ON follows
  FOR EACH ROW
  EXECUTE FUNCTION update_follower_count();

-- Create function to update article count
CREATE OR REPLACE FUNCTION update_article_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'PUBLISHED' THEN
    UPDATE profiles
    SET article_count = article_count + 1
    WHERE id = NEW.writer_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'DRAFT' AND NEW.status = 'PUBLISHED' THEN
    UPDATE profiles
    SET article_count = article_count + 1
    WHERE id = NEW.writer_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'PUBLISHED' AND NEW.status = 'DRAFT' THEN
    UPDATE profiles
    SET article_count = article_count - 1
    WHERE id = NEW.writer_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'PUBLISHED' THEN
    UPDATE profiles
    SET article_count = article_count - 1
    WHERE id = OLD.writer_id;
    RETURN OLD;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update article count
DROP TRIGGER IF EXISTS update_article_count_trigger ON articles;
CREATE TRIGGER update_article_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_article_count();