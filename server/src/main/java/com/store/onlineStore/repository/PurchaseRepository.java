package com.store.onlineStore.repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.store.onlineStore.dto.CartRequestDto;
import com.store.onlineStore.dto.CartResponseDto;
import com.store.onlineStore.dto.OrderResponseDto;
import com.store.onlineStore.dto.PurchaseOrderResponseDto;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class PurchaseRepository {
	private final JdbcTemplate jdbcTemplate;
	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	private String sql;

	@Autowired
	public PurchaseRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * 제품 ID 목록에 따라 제품을 수량순으로 정렬하여 조회
	 *
	 * @param productIds 조회할 제품 ID 목록
	 * @return 제품을 수량순으로 정렬하여 조회한 결과를 담은 CartRequestDto 객체의 리스트
	 */
	public List<CartRequestDto> findProductOrderByQuantity(List<String> productIds) {
		sql = "SELECT COALESCE(s.product_id, p.id) as product_id\n"
				+ "FROM product p\n"
				+ "LEFT JOIN sales s ON s.product_id = p.id\n"
				+ "WHERE p.id IN (:productIds)\n"
				+ "ORDER BY COALESCE(s.purchaseQuantity, 0) DESC";

		MapSqlParameterSource parameters = new MapSqlParameterSource();
		parameters.addValue("productIds", productIds);

		return namedParameterJdbcTemplate.query(sql, parameters, new BeanPropertyRowMapper<>(CartRequestDto.class));
	}
}
