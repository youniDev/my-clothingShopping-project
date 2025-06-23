package com.store.onlineStore.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.store.onlineStore.dto.CommentRequestDto;
import com.store.onlineStore.dto.CommentResponseDto;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class CommentsRepository {
	private final JdbcTemplate jdbcTemplate;
	private String sql;

	@Autowired
	public CommentsRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * 댓글 등록
	 *
	 * @param comment 등록할 정보를 담은 객체
	 */
	public void insertComment(CommentRequestDto comment) {
		sql = "INSERT INTO comments (post_id, comment_user, parent_comment_id, content, image) " +
				"VALUES (?, ?, ?, ?, ?)";

		try {
			jdbcTemplate.update(sql,
					comment.getPostId(),
					comment.getUserId(),
					comment.getParentCommentId(),
					comment.getComment().getContent(),
					comment.getComment().getImage()
			);
		} catch (Exception e) {
			log.info(e.toString());
			throw new RuntimeException("Failed to insert comment", e);
		}
	}
}
