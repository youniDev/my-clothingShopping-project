package com.store.onlineStore.oauth.domain;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OauthMemberRepository extends JpaRepository<OauthMember, Long> {

	Optional<OauthMember> findByOauthId(OauthId oauthId);
}
