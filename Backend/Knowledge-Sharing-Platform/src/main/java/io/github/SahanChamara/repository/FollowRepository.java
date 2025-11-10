package io.github.SahanChamara.repository;

import io.github.SahanChamara.entity.FollowEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface FollowRepository extends JpaRepository<FollowEntity, Long> {
    boolean existByFollowerIdAndFollowingId(Long followerId, Long followingId);
    void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId);
    List<FollowEntity> findByFollowerId(Long followerId);
    List<FollowEntity> findByFollowingId(Long followerId);

    @Query("select f.followerId from FollowEntity f where f.followingId = :writerId")
    List<Long> findFollowerIdByFollowingId(@Param("writerId") Long writerId);

    @Query("select f.followingId as id, count(f) as cnt from FollowEntity f where f.followingId in :writerIds group by f.followingId")
    List<Map<String, Object>> countFollowersByFollowingIds(@Param("writerIds") Collection<Long> writerIds);

}
