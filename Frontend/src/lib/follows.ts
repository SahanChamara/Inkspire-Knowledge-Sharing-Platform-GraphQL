import { Follow, Profile } from './supabase';

export const followService = {
  async followWriter(_followerId: string, _followingId: string): Promise<Follow> {
    // Use GraphQL API: followWriter mutation
    throw new Error('Use GraphQL API instead');
  },

  async unfollowWriter(_followerId: string, _followingId: string): Promise<void> {
    // Use GraphQL API: unfollowWriter mutation
  },

  async isFollowing(_followerId: string, _followingId: string): Promise<boolean> {
    // Use GraphQL API to check follow status
    return false;
  },

  async getFollowers(_writerId: string): Promise<Profile[]> {
    // Use GraphQL API: followers query
    return [];
  },

  async getFollowing(_writerId: string): Promise<Profile[]> {
    // Use GraphQL API: following query
    return [];
  },

  async getFollowerIds(_writerId: string): Promise<string[]> {
    // Use GraphQL API: followers query
    return [];
  },
};
