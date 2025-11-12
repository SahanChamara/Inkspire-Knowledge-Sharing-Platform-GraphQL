import { supabase, Follow, Profile } from './supabase';

export const followService = {
  async followWriter(followerId: string, followingId: string): Promise<Follow> {
    const { data, error } = await supabase
      .from('follows')
      .insert([{ follower_id: followerId, following_id: followingId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async unfollowWriter(followerId: string, followingId: string): Promise<void> {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) throw error;
  },

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  async getFollowers(writerId: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('follows')
      .select(`
        follower_id,
        profiles!follows_follower_id_fkey (*)
      `)
      .eq('following_id', writerId);

    if (error) throw error;
    return (data || []).map((item: any) => item.profiles);
  },

  async getFollowing(writerId: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('follows')
      .select(`
        following_id,
        profiles!follows_following_id_fkey (*)
      `)
      .eq('follower_id', writerId);

    if (error) throw error;
    return (data || []).map((item: any) => item.profiles);
  },

  async getFollowerIds(writerId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('following_id', writerId);

    if (error) throw error;
    return (data || []).map(item => item.follower_id);
  },
};
