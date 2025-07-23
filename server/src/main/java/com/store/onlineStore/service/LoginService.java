package com.store.onlineStore.service;


import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.store.onlineStore.vo.NaverProfileVo;
import com.store.onlineStore.vo.NaverTokenVo;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class LoginService {

	public String extractUsernameFromEmail(String email) {
		int atIndex = email.indexOf('@');

		return email.substring(0, atIndex);
	}
	/*
	@Value("${spring.security.oauth2.client.registration.naver.client-id}")
	private String NAVER_CLIENT_ID;
	@Value("${spring.security.oauth2.client.registration.naver.client-secret}")
	private String NAVER_SECRET_CODE;
	@Value("${spring.security.oauth2.client.registration.naver.grant-type}")
	private String GRANT_TYPE;
	@Value("${spring.security.oauth2.client.provider.naver.token-url}")
	private String TOKEN_URI;

	/**
	 * Naver login service
	 * @param code
	 * @param state
	 * @throws UnsupportedEncodingException
	public void getNaverToken(String code, String state) throws
			UnsupportedEncodingException {
		RestTemplate rt = new RestTemplate();

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		// 파라미터들을 담아주기위한 맵 (파라미터용이기 때문에, 따로 앞에 ?나 &나 =같은 부호를 입력해주지 않아도 됨. 오히려 넣으면 인식못함)
		// 네이버 가이드에서 요청하는 파라미터들 (Developers 참고)
		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("code", code);
		params.add("state", URLEncoder.encode(state, StandardCharsets.UTF_8));
		params.add("grant_type", GRANT_TYPE);
		params.add("client_id", NAVER_CLIENT_ID);
		params.add("client_secret", NAVER_SECRET_CODE);

		// 헤더와 바디 합체
		HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity(params, headers);
		log.info("현재 httpEntity 상태:: " + tokenRequest);

		ResponseEntity<String> oauthTokenResponse = rt.exchange(
				TOKEN_URI,
				HttpMethod.POST,
				tokenRequest,
				String.class
		);
		// 토큰 수신
		//NaverTokenVo accessToken = rt.postForObject("https://nid.naver.com/oauth2.0/token", tokenRequest, NaverTokenVo.class);
		//log.info("accessToken :: " + accessToken);

		//NaverTokenVo accessToken = rt.postForObject("https://nid.naver.com/oauth2.0/token", tokenRequest, NaverTokenVo.class);
		log.info(String.valueOf(oauthTokenResponse));

		/*
		log.info("secrete:" + NAVER_SECRET_CODE);

		// 네이버 로그인 Token 발급 API 요청을 위한 header/parameters 설정 부분
		RestTemplate token_rt = new RestTemplate(); // REST API 요청용 Template

		HttpHeaders naverTokenRequestHeadres = new HttpHeaders();  // Http 요청을 위한 헤더 생성
		naverTokenRequestHeadres.add("Content-type", "application/x-www-form-urlencoded"); // application/json 했다가 grant_type missing 오류남 (출력포맷만 json이라는 거엿음)

		// 파라미터들을 담아주기위한 맵 (파라미터용이기 때문에, 따로 앞에 ?나 &나 =같은 부호를 입력해주지 않아도 됨. 오히려 넣으면 인식못함)
		// 네이버 가이드에서 요청하는 파라미터들 (Developers 참고)
		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type", "authorization_code");
		params.add("client_id", NAVER_CLIENT_ID);
		params.add("client_secret", NAVER_SECRET_CODE);
		params.add("code", code);
		params.add("state", URLEncoder.encode(state, StandardCharsets.UTF_8));

		String uri = "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code"
				+ "&client_id=" + NAVER_CLIENT_ID + "&client_secret=" + NAVER_SECRET_CODE
				+ "&code=" + code + "&state=" + state;

		log.info("[URI]" + uri);

		HttpEntity<MultiValueMap<String, String>> naverTokenRequest =
				new HttpEntity<>(params, naverTokenRequestHeadres);

		ResponseEntity<String> oauthTokenResponse = token_rt.exchange(
				uri,
				HttpMethod.POST,
				new HttpEntity<>(naverTokenRequestHeadres),
				String.class
		);

		log.info(String.valueOf(oauthTokenResponse));

		/*
		// 서비스 서버에서 네이버 인증 서버로 요청 전송(POST 또는 GET이라고 공식문서에 있음), 응답은 Json으로 제공됨
		ResponseEntity<String> oauthTokenResponse = token_rt.exchange(
				"https://nid.naver.com/oauth2.0/token",
				HttpMethod.POST,
				naverTokenRequest,
				String.class
		);

		// body로 access_token, refresh_token, token_type:bearer, expires_in:3600 온 상태
		log.info(String.valueOf(oauthTokenResponse));

		/*
		// oauthTokenResponse로 받은 토큰정보 객체화
		ObjectMapper token_om = new ObjectMapper();
		NaverTokenVo naverToken = null;
		try {
			naverToken = token_om.readValue(oauthTokenResponse.getBody(), NaverTokenVo.class);
			getUserInfo(naverToken, response);
		} catch (JsonMappingException je) {
			je.printStackTrace();
		}
	}

	public void getUserInfo(NaverTokenVo naverToken, HttpServletResponse response) {
		// 토큰을 이용해 정보를 받아올 API 요청을 보낼 로직 작성하기
		RestTemplate profile_rt = new RestTemplate();
		HttpHeaders userDetailReqHeaders = new HttpHeaders();
		userDetailReqHeaders.add("Authorization", "Bearer " + naverToken.getAccess_token());
		userDetailReqHeaders.add("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		HttpEntity<MultiValueMap<String, String>> naverProfileRequest = new HttpEntity<>(userDetailReqHeaders);

		// 서비스서버 - 네이버 인증서버 : 유저 정보 받아오는 API 요청
		ResponseEntity<String> userDetailResponse = profile_rt.exchange(
				"https://openapi.naver.com/v1/nid/me",
				HttpMethod.POST,
				naverProfileRequest,
				String.class
		);

		// 요청 응답 확인
		System.out.println(userDetailResponse);

		// 네이버로부터 받은 정보를 객체화
		// *이때, 공식문서에는 응답 파라미터에 mobile 밖에없지만, 국제전화 표기로 된 mobile_e164도 같이 옴. 따라서 NaverProfileVo에 mobile_e164 필드도 있어야 정상적으로 객체가 생성됨
		ObjectMapper profile_om = new ObjectMapper();
		NaverProfileVo naverProfile = null;
		try {
			naverProfile = profile_om.readValue(userDetailResponse.getBody(), NaverProfileVo.class);
		} catch (JsonProcessingException je) {
			je.printStackTrace();
		}

		// 이건 자유
		// 받아온 정보로 서비스 로직에 적용하기
		Member naverMember = memberService.createNaverMember(naverProfile, naverToken.getAccess_token());

		// 시큐리티 영역
		// Authentication 을 Security Context Holder 에 저장
		Authentication authentication = new UsernamePasswordAuthenticationToken(naverMember.getEmail(), naverMember.getPassword());
		SecurityContextHolder.getContext().setAuthentication(authentication);

		// 자체 JWT 생성 및 HttpServletResponse 의 Header 에 저장 (클라이언트 응답용)
		String accessToken = jwtTokenizer.delegateAccessToken(naverMember);
		String refreshToken = jwtTokenizer.delegateRefreshToken(naverMember);
		response.setHeader("Authorization", "Bearer " + accessToken);
		response.setHeader("RefreshToken", refreshToken);

		// RefreshToken을 Redis에 넣어주는 과정
		ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
		valueOperations.set("RTKey"+naverMember.getMemberId(), refreshToken);

		System.out.println(accessToken);
		*/
}
