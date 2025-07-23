package com.store.onlineStore.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.store.onlineStore.dto.ProductResponseDto;

@Repository
public class BestProductRepository {
	private final JdbcTemplate jdbcTemplate;
	private final int MAIN_PRODUCT_COUNT = 4;
	private String sql;

	@Autowired
	public BestProductRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	

	// 메인에 보여줄 베스트 아이템 조회
	public List<ProductResponseDto> findMainBestProducts() {
		sql = "SELECT bsp.id, bsp.name, bsp.description, bsp.cost, bsp.price, bsp.quantity, bsp.category, bsp.thumbnail\n"
				+ "FROM best_selling_products bsp\n"
				+ "ORDER BY purchaseQuantity DESC\n"
				+ "LIMIT " + MAIN_PRODUCT_COUNT;

		return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class));
	}

}
