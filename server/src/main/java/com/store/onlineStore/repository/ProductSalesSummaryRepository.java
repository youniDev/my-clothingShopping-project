package com.store.onlineStore.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ProductSalesSummaryRepository {
	private final JdbcTemplate jdbcTemplate;

	private String sql;

	@Autowired
	public ProductSalesSummaryRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	// 제품 판매량 업데이트
	public void updateProductSalesSummary() {
		sql = "INSERT INTO product_sales_summary (product_id, total_purchase_quantity, last_updated) " +
				"SELECT p.id, COALESCE(SUM(s.purchaseQuantity), 0), NOW() " +
				"FROM product p " +
				"LEFT JOIN sales s ON s.product_id = p.id " +
				"GROUP BY p.id " +
				"ON DUPLICATE KEY UPDATE " +
				"total_purchase_quantity = VALUES(total_purchase_quantity), " +
				"last_updated = VALUES(last_updated)";

		jdbcTemplate.update(sql);
	}
}
