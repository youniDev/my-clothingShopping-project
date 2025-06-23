package com.store.onlineStore.oauth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.format.FormatterRegistry;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import com.store.onlineStore.oauth.OauthServerTypeConverter;
import com.store.onlineStore.oauth.config.jwt.JwtAccessDeniedHandler;
import com.store.onlineStore.oauth.config.jwt.JwtAuthenticationEntryPoint;
import com.store.onlineStore.oauth.config.jwt.JwtSecurityConfig;
import com.store.onlineStore.oauth.config.jwt.TokenProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 스프링 시큐리티와 OAuth2 설정 클래스
 */
@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig implements WebMvcConfigurer {
	private final TokenProvider tokenProvider;
	private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
	private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
				.allowedOrigins("http://localhost:3000")
				.allowedMethods(
						HttpMethod.GET.name(),
						HttpMethod.POST.name(),
						HttpMethod.PUT.name(),
						HttpMethod.DELETE.name(),
						HttpMethod.PATCH.name()
				)
				.allowCredentials(true)
				.exposedHeaders("*");
	}

	@Override
	public void addFormatters(FormatterRegistry registry) {
		registry.addConverter(new OauthServerTypeConverter());
	}

	// PasswordEncoder는 BCryptPasswordEncoder를 사용
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity httpSecurity, HandlerMappingIntrospector introspector) throws Exception {
		httpSecurity
				.csrf(AbstractHttpConfigurer::disable)
				.exceptionHandling((exceptionHandling) -> //컨트롤러의 예외처리를 담당하는 exception handler와는 다름.
						exceptionHandling
								.accessDeniedHandler(jwtAccessDeniedHandler)
								.authenticationEntryPoint(jwtAuthenticationEntryPoint)
				)
				.sessionManagement((sessionManagement) ->
						sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)	//	jwt token 방식을 사용할 때 사용
				)
				.authorizeHttpRequests((authorizeRequests)->
						authorizeRequests
								.requestMatchers(new MvcRequestMatcher(introspector, "/api/**")).permitAll()
								.requestMatchers(new MvcRequestMatcher(introspector, "/oauth/**")).permitAll()	// 로그인 시 접근 허용
								.requestMatchers(new MvcRequestMatcher(introspector, "/images/**")).permitAll()	// 이미지 파일 접근 허용
								.anyRequest().authenticated() // 그 외 인증 없이 접근X
				)
				.exceptionHandling((exceptionHandling) -> exceptionHandling
						.accessDeniedHandler(jwtAccessDeniedHandler)
						.authenticationEntryPoint(jwtAuthenticationEntryPoint))
				.apply(new JwtSecurityConfig(tokenProvider)); // JwtFilter를 addFilterBefore로 등록했던 JwtSecurityConfig class 적용

		return httpSecurity.build();
	}

}
