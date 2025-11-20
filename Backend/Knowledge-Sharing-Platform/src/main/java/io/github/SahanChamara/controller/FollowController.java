package io.github.SahanChamara.controller;

import io.github.SahanChamara.dto.Writer;
import io.github.SahanChamara.service.FollowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
public class FollowController {
    private final FollowService followService;
    private static final Logger logger = LoggerFactory.getLogger(FollowController.class);

    @MutationMapping
    public Boolean followWriter(@Argument Long targetId, @Argument Long followerId){
        return followService.follow(followerId, targetId);
    }

    @MutationMapping
    public Boolean unfollowWriter(@Argument Long targetId, @Argument Long followerId){
        return followService.unfollow(followerId,targetId);
    }

    @QueryMapping
    public List<Writer> followers(@Argument Long writerId){
        return followService.getFollowers(writerId);
    }

    @QueryMapping
    public List<Writer> following(@Argument Long followerId){
        return followService.getFollowing(followerId);
    }
}
