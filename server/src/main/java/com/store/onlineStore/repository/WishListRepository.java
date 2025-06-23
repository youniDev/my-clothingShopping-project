package com.store.onlineStore.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.store.onlineStore.dto.ProductResponseDto;
import com.store.onlineStore.dto.WishListRequestDto;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class WishListRepository {
	private final JdbcTemplate jdbcTemplate;
	private String sql;

	@Autowired
	public WishListRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * 위시리스트에 제품 추가
	 *
	 * @param wishlist 위시리스트에 추가할 제품 정보를 담은 객체
	 */
	public void insertWishList(WishListRequestDto wishlist) {
		sql = "INSERT INTO user_wish_list (product_id, user_id) " +
				"VALUES (?, ?)";

		jdbcTemplate.update(sql, wishlist.getProductId(), wishlist.getUserId());
	}

	
	/**
	 * 회원 탈퇴 시, 위시 리스트에 있는 모든 목록 제거
	 */
	public void deleteWishListByUserId(String userId) {
		sql = "DELETE FROM user_wish_list WHERE user_id = ?";

		jdbcTemplate.update(sql, userId);
	}

	/**
	 * 위시리스트에서 제품 목록 조회
	 *
	 * @param userId 사용자 ID를 나타내는 문자열
	 */
	public List<ProductResponseDto> findWishListByUserId(String userId) {
		sql = "SELECT p.*\n"
				+ "FROM product p\n"
				+ "JOIN user_wish_list w ON p.id = w.product_id\n"
				+ "WHERE w.user_id = ?";

		return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class), userId);
	}
}
