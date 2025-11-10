package io.github.SahanChamara.service.impl;

import io.github.SahanChamara.dto.Writer;
import io.github.SahanChamara.entity.FollowEntity;
import io.github.SahanChamara.repository.FollowRepository;
import io.github.SahanChamara.repository.WriterRepository;
import io.github.SahanChamara.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {

    private final FollowRepository followRepository;
    private final WriterRepository writerRepository;
    private final ModelMapper mapper;

    @Override
    @Transactional
    public Boolean follow(Long followerId, Long followingId) {
        if(Objects.equals(followerId, followingId)) return Boolean.FALSE;
        if(followRepository.existByFollowerIdAndFollowingId(followerId, followingId)) return Boolean.FALSE;

        followRepository.save(new FollowEntity(null, followerId, followingId, LocalDateTime.now()));
        return Boolean.TRUE;
    }

    @Override
    @Transactional
    public Boolean unfollow(Long followerId, Long followingId) {
        if(!followRepository.existByFollowerIdAndFollowingId(followerId,followingId)) return Boolean.FALSE;
        followRepository.deleteByFollowerIdAndFollowingId(followerId,followingId);;
        return Boolean.TRUE;
    }

    @Override
    @Transactional(readOnly = true)
    public Boolean isFollowing(Long followerId, Long followingId) {
        return followRepository.existByFollowerIdAndFollowingId(followerId, followingId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Long> getFollowerIds(Long writerId) {
        return followRepository.findFollowerIdByFollowingId(writerId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Writer> getFollowers(Long writerId) {
        List<FollowEntity> byFollowingId = followRepository.findByFollowingId(writerId);
        List<Long> idList = byFollowingId.stream()
                .map(FollowEntity::getFollowerId)
                .toList();
        return writerRepository.findAllById(idList)
                .stream()
                .map(writerEntity -> mapper.map(writerEntity, Writer.class))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Writer> getFollowing(Long followerId) {
        List<FollowEntity> byFollowerId = followRepository.findByFollowingId(followerId);
        List<Long> idList = byFollowerId.stream()
                .map(FollowEntity::getFollowingId)
                .toList();
        return writerRepository.findAllById(idList)
                .stream()
                .map(writerEntity -> mapper.map(writerEntity, Writer.class))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<Long, Long> getFollowersCountFor(Collection<Long> writerIds) {
        HashMap<Long, Long> result = new HashMap<>();
        for (Long id : writerIds){
            result.put(id, (long) followRepository.findByFollowingId(id).size());
        }
        return result;
    }
}
