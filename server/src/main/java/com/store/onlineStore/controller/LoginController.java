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
}
