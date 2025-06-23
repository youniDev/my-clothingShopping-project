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

	/**
	 * 글 수정
	 *
	 * @param post 수정할 글 정보를 담은 객체
	 */
	public void updateAll(PostDto post, String userId) {
		sql = "UPDATE write_post SET (title, content, category, image)\n"
				+ "VALUES (?, ?, ?, ?, ?)\n"
				+ "WHERE id = ? AND user_id = ?";

		jdbcTemplate.update(sql, post.getTitle(), post.getContent(), post.getCategory(), post.getImage(), post.getId(), userId);
	}

	/**
	 * 등록된 모든 글 조회
	 */
	public List<PostResponseDto> findAll() {
		sql = "SELECT \n"
				+ "wp.id AS postId, wp.user_id AS userId, wp.title, wp.content, wp.image,\n "
				+ "DATE_FORMAT(wp.create_at, '%Y/%m/%d') AS createDate,\n"
				+ "DATE_FORMAT(wp.update_at, '%Y/%m/%d') AS updateDate,\n"
				+ "bc.name AS category\n"
				+ "FROM write_post wp\n"
				+ "JOIN board_category bc ON bc.id = wp.category;";

		return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(PostResponseDto.class));
	}

	/**
	 * 글 삭제
	 *
	 * @param writeId 삭제할 글의 ID를 나타내는 문자열
	 */
	public void deleteWriteById(String writeId) {
		sql = "DELETE FROM write_post WHERE id = ?";

		jdbcTemplate.update(sql, writeId);
	}


	/**
	 * 특정 카테고리에 속한 글 조회
	 *
	 * @param category 조회할 글의 카테고리
	 */
	public List<PostResponseDto> findPostByCategory(String category) {
		sql = "SELECT \n"
				+ "wp.id AS postId, wp.user_id AS userId, wp.title, wp.content, wp.image,\n "
				+ "DATE_FORMAT(wp.create_at, '%Y/%m/%d') AS createDate,\n"
				+ "DATE_FORMAT(wp.update_at, '%Y/%m/%d') AS updateDate\n"
				+ "FROM write_post wp\n"
				+ "JOIN board_category bc ON bc.id = wp.category\n"
				+ "WHERE bc.name = ?";

		return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(PostResponseDto.class), category);
	}

	/**
	 * 탈퇴한 유저의 글을 삭제하지 않고, id를 unknown으로 대체
	 * @param unknown	탈퇴한 유저의 대체 id
	 * @param userId	탈퇴한 유저
	 */
	public void replaceUserWithUnknown(String unknown, String userId) {
		sql = "UPDATE write_post\n"
				+ "SET user_id = ?\n"
				+ "WHERE user_id = ?";

		jdbcTemplate.update(sql, unknown, userId);
	}
}
