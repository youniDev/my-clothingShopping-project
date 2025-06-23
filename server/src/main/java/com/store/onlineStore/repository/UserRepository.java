package com.store.onlineStore.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.store.onlineStore.dto.AuthRequestDto;
import com.store.onlineStore.dto.registerDTO.RegistrationDto;
import com.store.onlineStore.dto.registerDTO.RegistrationRequestDto;
import com.store.onlineStore.dto.registerDTO.SocialRegistrationDto;
import com.store.onlineStore.dto.registerDTO.UserResponseDto;
import com.store.onlineStore.entity.Role;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class UserRepository {
	private final JdbcTemplate jdbcTemplate;
	private String sql;

	@Autowired
	public UserRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * 회원 정보 등록
	 * @param user	회원 정보
	 */
	public void insertUser(RegistrationDto user) {
		sql = "INSERT INTO user (name, birth, address, user_id, password, role) " +
				"VALUES (?, ?, ?, ?, ?, ?)";

		jdbcTemplate.update(
				sql,
				user.getName(),
				user.getBirth(),
				user.getAddress(),
				user.getId(),
				user.getPassword(),
				Role.ROLE_USER.getValue()
		);
	}
	
	/**
	 * 모든 유저의 email 조회
	 * @return	유저 email 목록
	 */
	public List<String> selectEmailByUser() {
		String sql = "select user_id from user";

		return jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("user_id"));
	}

	/**
	 * 소셜 로그인으로 로그인한 유저 조회
	 * @param email	user id
	 */
	public RegistrationRequestDto findUserByEmail(String email) {
		sql = "SELECT user_id, password, name, birth, address, point FROM user WHERE user_id = ? AND password IN ('NAVER', 'GOOGLE', 'KAKAO')";

		return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(RegistrationRequestDto.class), email);
	}

	/**
	 * 회원 정보 수정
	 * @param user	회원 정보
	 */
	public void updateUser(RegistrationDto user) {
		sql = "UPDATE user SET name=?, address=?, birth=? WHERE user_id = ?";

		jdbcTemplate.update(
				sql,
				user.getName(),
				user.getAddress(),
				user.getBirth(),
				user.getId()
		);
	}

	/**
	 * 유저 정보 삭제
	 * @param userId	user id
	 */
	public void deleteUser(String userId) {
		sql = "DELETE FROM user WHERE user_id = ?";

		jdbcTemplate.update(sql, userId);
	}
}
}
