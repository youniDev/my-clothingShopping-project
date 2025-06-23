package com.store.onlineStore.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.store.onlineStore.dto.AuthRequestDto;
import com.store.onlineStore.dto.registerDTO.SocialRegistrationDto;
import com.store.onlineStore.oauth.domain.OauthServerType;
import com.store.onlineStore.oauth.domain.authcode.AuthCodeRequestUrlProviderComposite;
import com.store.onlineStore.oauth.domain.client.OauthMemberClientComposite;
import com.store.onlineStore.repository.UserRepository;

/**
 * 소셜 로그인 관련 서비스
 *  ex) kakao, naver, google
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OauthService {

	private final AuthCodeRequestUrlProviderComposite authCodeRequestUrlProviderComposite;
	private final OauthMemberClientComposite oauthMemberClientComposite;

	@Autowired
	private UserRepository userRepository;

	// 인가 코드 발급 받기 위한 url 설정
	public String getAuthCodeRequestUrl(OauthServerType oauthServerType) {
		return authCodeRequestUrlProviderComposite.provide(oauthServerType);
	}

	// access token 발급 받기 위한 설정
	public AuthRequestDto login(OauthServerType oauthServerType, String authCode) {
		SocialRegistrationDto oauthMember = oauthMemberClientComposite.fetch(oauthServerType, authCode); // OauthServerType에 해당하는 회원을 AuthCode를 통해 조회

		AuthRequestDto user = userRepository.findUserByUserId(oauthMember.getId());

		if(user == null) {
			userRepository.insertUserBySocial(oauthMember);
			user = userRepository.findUserByUserId(oauthMember.getId());
		}

		return user;
	}
}
