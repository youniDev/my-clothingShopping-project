package com.store.onlineStore.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.store.onlineStore.dto.registerDTO.RegistrationRequestDto;
import com.store.onlineStore.oauth.config.jwt.JwtFilter;

import com.store.onlineStore.oauth.config.jwt.TokenProvider;
import com.store.onlineStore.dto.AuthResponseDto;
import com.store.onlineStore.dto.registerDTO.RegistrationDto;
import com.store.onlineStore.repository.UserRepository;
import com.store.onlineStore.service.LoginService;
import com.store.onlineStore.service.UserService;

import com.store.onlineStore.entity.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class LoginController {
	@Autowired
	UserService userService;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	LoginService loginService;

	private final TokenProvider tokenProvider;
	private final AuthenticationManagerBuilder authenticationManagerBuilder;


	// 회원가입
	@PostMapping("/send/user-data")
	public boolean receiveUserInfo(@RequestBody RegistrationDto registration) {
		try {
			userRepository.insertUser(registration);

			return true;
		} catch (RuntimeException e) {

			return false;
		}
	}


	// 이메일 중복 검사
	@PostMapping("/check/dup-email")
	public Boolean receiveEmail(@RequestBody String data) {
		String email = data.replaceAll("\"", "");

		// 중복된 id가 있을 경우 true 반환
		for (String id : userRepository.selectEmailByUser()) {
			if (email.equals(id)) {
				return true;
			}
		}

		return false;
	}

	// 본인인증 - 이메일
	@PostMapping("/send/verification-email")
	public ResponseEntity<?> receiveEmailForVerification(@RequestBody String email) {
		return userService.sendVerificationCodeByEmail(email);
	}

	// 본인인증 - 휴대폰
	@PostMapping("/send/verification-phone")
	public ResponseEntity<?> receivePhoneForVerification(@RequestBody String phone) {
		return userService.sendVerificationCodeByPhone(phone);
	}

	/**
	 * 로그인
	 * @param loginRequest	로그인을 위한 정보
	 * return	jwt 토큰 반환
	 */
	@PostMapping("/signin")
	public ResponseEntity<?> signin(@RequestBody Map<String, String> loginRequest) {
		String email = loginRequest.get("email");
		String pw = loginRequest.get("password");

		try {
			UsernamePasswordAuthenticationToken authenticationToken =
					new UsernamePasswordAuthenticationToken(email, pw);	// 로그인 폼에서 제출되는 id, pw를 통한 인증을 처리하는 filter

			// authenticate 메소드가 실행이 될 때 CustomUserDetailsService class의 loadUserByUsername 메소드가 실행
			Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

			SecurityContextHolder.getContext().setAuthentication(authentication);	// 해당 객체를 SecurityContextHolder에 저장하고
			String jwt = tokenProvider.createToken(authentication);		// authentication 객체를 createToken 메소드를 통해서 JWT Token을 생성

			HttpHeaders httpHeaders = new HttpHeaders();
			httpHeaders.add(JwtFilter.AUTHORIZATION_HEADER, "Bearer " + jwt);		// response header에 jwt token에 넣어줌

			return new ResponseEntity<>(new AuthResponseDto(jwt), httpHeaders, HttpStatus.OK);		// tokenDto를 이용해 response body에 추가해 리턴
		} catch (InternalAuthenticationServiceException e) {
			
			return ResponseEntity.status(401).body("LOGIN_ERROR NOT_USER");
		} catch (BadCredentialsException e) {

			return ResponseEntity.status(401).body("LOGIN_ERROR BAD_CREDENTIALS");
		}
	}

	/**
	 * 사용자 이메일 조회 기능
	 * 	- access token이 유효한지 확인
	 * @param accessToken
	 * @return	사용자 이메일
	 */
	@GetMapping("/user/id")
	@PreAuthorize("hasAnyRole('USER','ADMIN')")
	public ResponseEntity<?> findUserId(@RequestHeader("Authorization") String accessToken) {
		try {
			String email = this.tokenProvider.getUserIdFromToken(accessToken.substring(7));

			// ADMIN 권한인 경우
			if (SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
					.anyMatch(r -> r.getAuthority().equals(Role.ROLE_ADMIN.getValue()))) {

				return ResponseEntity.status(HttpStatus.OK).body(Role.ROLE_ADMIN.getValue());
			}

			// USER 권한인 경우
			String foundUserId = userRepository.findUserNameByEmail(email);

			return ResponseEntity.status(HttpStatus.OK).body(foundUserId);
		} catch (Exception e) {
			e.printStackTrace();

			return ResponseEntity.badRequest().body(e.toString());
		}
	}

}
