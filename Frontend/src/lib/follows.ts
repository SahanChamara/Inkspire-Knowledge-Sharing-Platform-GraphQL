import { apolloClient } from './apllo';
import { FOLLOW_WRITER, UNFOLLOW_WRITER } from './operations';
import { Follow, Profile } from './supabase';

export const followService = {
  async followWriter(followerId: string, targetId: string): Promise<boolean> {
    const result = await apolloClient.mutate<
      { followWriter: boolean },
      { targetId: string; followerId: string }
    >({
      mutation: FOLLOW_WRITER,
      variables: { targetId, followerId },
    });

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data?.followWriter ?? false;
  },

  async unfollowWriter(followerId: string, targetId: string): Promise<boolean> {
    const result = await apolloClient.mutate<
      { unfollowWriter: boolean },
      { targetId: string; followerId: string }
    >({
      mutation: UNFOLLOW_WRITER,
      variables: { targetId, followerId },
    });

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data?.unfollowWriter ?? false;
  },

  async isFollowing(_followerId: string, _followingId: string): Promise<boolean> {
    // Use GraphQL API to check follow status via Writer.isFollowedBy field
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
