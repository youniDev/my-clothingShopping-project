package com.store.onlineStore.oauth.config;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class SecurityUtil {
	private static final Logger logger = LoggerFactory.getLogger(SecurityUtil.class);

	private SecurityUtil() {}

	// getCurrentUsername 메소드의 역할은 Security Cont
	public static Optional<String> getCurrentUsername() {

		// authentication객체가 저장되는 시점은 JwtFilter의 doFilter 메소드에서
		// Request가 들어올 때 SecurityContext에 Authentication 객체를 저장해서 사용
		final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null) {
			logger.debug("Security Context에 인증 정보가 없습니다.");
			return Optional.empty();
		}

		String username = null;
		if (authentication.getPrincipal() instanceof UserDetails springSecurityUser) {
			username = springSecurityUser.getUsername();
		} else if (authentication.getPrincipal() instanceof String) {
			username = (String) authentication.getPrincipal();
		}

		return Optional.ofNullable(username);
	}
}
