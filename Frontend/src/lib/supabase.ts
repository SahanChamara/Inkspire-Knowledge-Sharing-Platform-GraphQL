// Supabase client removed - Using GraphQL API instead
// All authentication and data management is handled through the GraphQL backend

export type Profile = {
  id: string;
  user_id: string;
  name: string;
  bio: string;
  avatar_url: string | null;
  follower_count: number;
  article_count: number;
  created_at: string;
  updated_at: string;
};

export type Article = {
  id: string;
  writer_id: string;
  title: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  tags: string[];
  read_time: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type ArticleWithWriter = Article & {
  profiles: Profile;
};

export type Follow = {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
};

export type Notification = {
  id: string;
  recipient_id: string;
  sender_id: string | null;
  article_id: string | null;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
};

export type NotificationWithRelations = Notification & {
  sender?: Profile | null;
  article?: Article | null;
};
