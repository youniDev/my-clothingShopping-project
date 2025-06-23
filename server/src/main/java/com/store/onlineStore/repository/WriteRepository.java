package com.store.onlineStore.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.store.onlineStore.dto.PostDto;
import com.store.onlineStore.dto.PostResponseDto;
import com.store.onlineStore.dto.WriteRequestDto;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class WriteRepository {
	private final JdbcTemplate jdbcTemplate;
	private String sql;

	@Autowired
	public WriteRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * 카테고리 이름을 기준으로 카테고리 ID 조회
	 *
	 * @param category 카테고리 이름
	 * @return 조회된 카테고리 ID
	 */
	public String findCategoryId(String category) {
		sql = "SELECT id FROM board_category WHERE name = ?";

		return jdbcTemplate.queryForObject(sql, String.class, category);
	}

	/**
	 * 글 등록
	 *
	 * @param post 작성할 글 정보를 담은 객체
	 */
	public void insertWrite(PostDto post, String userId) {
		sql = "INSERT INTO write_post (user_id, title, content, category, image)\n" +
				"VALUES (?, ?, ?, ?, ?)";

		jdbcTemplate.update(sql, userId, post.getTitle(), post.getContent(), post.getCategory(), post.getImage());
	}

}
