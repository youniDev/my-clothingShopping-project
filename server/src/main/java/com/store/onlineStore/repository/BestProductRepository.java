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

	// 카테고리 별 베스트 아이템 조회
	public List<ProductResponseDto> findBestProductByCategory(String category) {
		sql = "SELECT bsp.id, bsp.name, bsp.description, bsp.cost, bsp.price, bsp.quantity, bsp.category, bsp.thumbnail\n"
				+ "FROM best_selling_products bsp\n"
				+ "LEFT JOIN product_category c ON bsp.category = c.category_name\n"
				+ "WHERE (c.category_name = ? OR COALESCE(c.main_category_name, c.category_name) = ?)";

		return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class), category, category);
	}


	public void deleteAll() {
		sql = "DELETE FROM best_selling_products";

		jdbcTemplate.update(sql);
	}

	/**
	 * 인기 상품 db 업데이트
	 * @param best	인기 상품 목록
	 */
	public void updateAll(List<ProductResponseDto> best) {
		String sql = "INSERT INTO best_selling_products (id, name, description, cost, price, quantity, image, category, purchaseQuantity, thumbnail) "
				+ "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n"
				+ "ON DUPLICATE KEY UPDATE "	// 데이터가 이미 있을 경우, 새로 업데이트
				+ "name = VALUES(name), "
				+	"description = VALUES(description), "
				+	"cost = VALUES(cost), "
				+	"price = VALUES(price), "
				+	"quantity = VALUES(quantity), "
				+	"image = VALUES(image), "
				+	"category = VALUES(category), "
				+	"purchaseQuantity = VALUES(purchaseQuantity), "
				+	"thumbnail = VALUES(thumbnail)";

		// 배치 작업을 위한 배열 생성
		List<Object[]> batchArgs = new ArrayList<>();
		for (ProductResponseDto product : best) {
			batchArgs.add(new Object[]{
					product.getId(),
					product.getName(),
					product.getDescription(),
					product.getCost(),
					product.getPrice(),
					product.getQuantity(),
					product.getImage(),
					product.getCategory(),
					product.getPurchaseQuantity(),
					product.getThumbnail()
			});
		}

		jdbcTemplate.batchUpdate(sql, batchArgs);
	}
}
