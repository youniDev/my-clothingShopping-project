package com.store.onlineStore.repository;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.store.onlineStore.dto.PaginationResponseDto;
import com.store.onlineStore.dto.ProductRequestDto;
import com.store.onlineStore.dto.ProductResponseDto;
import com.store.onlineStore.dto.registerDTO.UserResponseDto;

import lombok.extern.slf4j.Slf4j;

/**
 * 주문 접수(Order Received): 고객이 주문을 완료하고 판매자가 주문을 접수한 단계
 *
 * 결제 완료(Payment Confirmed): 결제가 성공적으로 처리되어 돈이 판매자에게 이체된 상태
 *
 * 배송 준비중(Preparing for Shipment): 주문이 접수되고 결제가 완료된 후, 제품이 포장되고 배송 준비 단계
 *
 * 배송 중(Shipped): 상품이 배송되어 고객에게 향하고 있는 상태
 *
 * 배송 완료(Delivered): 상품이 고객에게 성공적으로 전달되었고, 주문이 완료된 상태
 *
 * 주문 취소(Canceled): 주문이 취소되어 주문이 완전히 취소된 상태
 */

@Slf4j
@Repository
public class ProductRepository {
	private final JdbcTemplate jdbcTemplate;
	private String sql;
	private final int PRODUCT_PAGE = 8;	// 페이지 당 보여지는 제품 수
	private final int MAIN_PRODUCT_COUNT = 4;

	@Autowired
	public ProductRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * 제품 등록
	 */
	public void insertProduct(ProductRequestDto product, String images) {
		sql = "INSERT INTO product (id, name, description, category, image, thumbnail, cost, price, quantity) " +
				"VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

		jdbcTemplate.update(
					sql,
					product.getId(),
					product.getName(),
					product.getDescription(),
					product.getSubCategory(),
					images,
					product.getThumbnail(),
					product.getCost(),
					product.getPrice(),
					product.getQuantity()
		);
	}

	/**
	 * 제품 정보 수정
	 */
	public void updateAll(ProductRequestDto product, String images) {
		sql = "UPDATE product SET name=?, description=?, category=?, image=?, thumbnail=?, cost=?, price=?, quantity=? WHERE id=?";

		try {
			jdbcTemplate.update(
					sql,
					product.getName(),
					product.getDescription(),
					product.getSubCategory(),
					images,
					product.getThumbnail(),
					product.getCost(),
					product.getPrice(),
					product.getQuantity(),
					product.getId()
			);
		} catch (Exception e) {
			throw new RuntimeException("Failed to update product.", e);
		}
	}
	
	/**
	 * main 카테고리와 sub 카테고리 id 불러오기
	 * @param category	카테고리명
	 * @return	카테고리 id
	 */
	public String findProductIdByCategory(String category) {
		sql = "SELECT category_id, sub_category_id FROM product_category WHERE category_name = ?";

		return jdbcTemplate.query(sql, (rs) -> {
			if (rs.next()) {
				return rs.getString("category_id") + rs.getString("sub_category_id");
			}
			return null;	//throw new 로 바꾸기
		}, category);
	}

	/**
	 * 해당 제품의 이미지 조회
	 * @param id	제품 id
	 * @return	이미지
	 */
	public String[] findProductImagesById(String id) {
		sql = "SELECT image FROM product WHERE id = ?";

		return jdbcTemplate.queryForObject(sql, String[].class, id);
	}


}
