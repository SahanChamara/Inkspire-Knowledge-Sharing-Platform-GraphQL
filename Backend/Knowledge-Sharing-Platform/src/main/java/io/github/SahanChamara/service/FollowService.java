package io.github.SahanChamara.service;

import io.github.SahanChamara.dto.Writer;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface FollowService {
    Boolean follow(Long followerId, Long followingId);
    Boolean unfollow(Long followerId, Long followingId);
    Boolean isFollowing(Long followerId, Long followingId);
    List<Long> getFollowerIds(Long writerId);
    List<Writer> getFollowers(Long writerId);
    List<Writer> getFollowing(Long followerId);
    Map<Long, Long> getFollowersCountFor(Collection<Long> writerIds);

}
