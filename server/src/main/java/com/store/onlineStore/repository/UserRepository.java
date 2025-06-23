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
}
