package com.store.onlineStore.service;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.store.onlineStore.dto.AuthRequestDto;
import com.store.onlineStore.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {
	private final PasswordEncoder passwordEncoder;
	@Autowired
	private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		// 데이터베이스에서 사용자 정보 조회
		AuthRequestDto user = userRepository.findUserByUserId(email);

		// user가 없을 경우
		if (user == null) throw new UsernameNotFoundException(email + " NOT FOUND ");

		 UserDetails userDetail = User.builder()
				.username(user.getEmail())
				.password(passwordEncoder.encode(user.getPassword()))
				.authorities(Collections.singleton(new SimpleGrantedAuthority(user.getRole())))
				.build();

		 return userDetail;
	}
}
