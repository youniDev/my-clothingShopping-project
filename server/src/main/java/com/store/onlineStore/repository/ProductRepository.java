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

	/**
	 * 제품 삭제
	 * @param productId	제품 id
	 */
	public void deleteProductById(String productId) {
		sql = "DELETE FROM product WHERE id = ?";

		jdbcTemplate.update(sql, productId);
	}

	/**
	 * 제품 세부 정보 조회
	 */
	public ProductResponseDto findAllById(String id) {
		sql = "SELECT * FROM product WHERE id = ?";

		List<ProductResponseDto> resultList = jdbcTemplate.query(
				sql, new BeanPropertyRowMapper<>(ProductResponseDto.class), id);

		return resultList.isEmpty() ? null : resultList.get(0);
	}

	/**
	 * 등록된 모든 제품 정보 조회
	 * @return	제품 정보
	 */
	public List<ProductResponseDto> selectAll() {
		sql = "SELECT p.id, p.name, p.description, p.cost, p.price, p.quantity, p.category, p.delivery_availability, \n"
				+ "  DATE_FORMAT(p.created_at, '%Y%m%d') AS createDate, \n"
				+ "  COALESCE(s.total_purchase_quantity, 0) AS purchaseQuantity\n"
				+ "FROM product p\n"
				+ "LEFT JOIN product_sales_summary s ON s.product_id = p.id";
		return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class));
	}

	/**
	 * 신제품 목록 조회
	 * @return	제품 목록
	 */
	public List<ProductResponseDto> findNewestProducts() {
		sql = "SELECT * FROM product "
				+ "ORDER BY created_at, cost "
				+ "LIMIT " + MAIN_PRODUCT_COUNT;

		return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class));
	}

	/**
	 * 해당 카테고리에 대한 제품 목록 조회
	 * @param category	카테고리명
	 * @return	제품 목록
	 */
	public List<ProductResponseDto> findProductByCategory(String category) {
		sql = "SELECT p.id, p.name, p.description, p.cost, p.price, p.quantity, p.thumbnail, p.category, p.delivery_availability, DATE_FORMAT(p.created_at, '%Y%m%d') AS createDate \n" +
				"FROM product p \n" +
				"LEFT JOIN product_category c ON p.category = c.category_name \n" +
				"WHERE (c.category_name = ? OR COALESCE(c.main_category_name, c.category_name) = ?) AND p.image NOT LIKE 'Nothing%'";

		return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class), category, category);
	}

	/**
	 * 커서 기반 페이지네이션 (카테고리 클릭 시, 기본으로 보여지는 제품 목록 조회)
	 * @param category	 카테고리명
	 * @param cursor	 현재 커서
	 * @param totalPage 현재 페이지
	 * @return	 현재 페이지에 해당하는 제품 목록
	 */
	public PaginationResponseDto findProductByCategory(String category, String cursor, Long totalPage) {
		String sql = "SELECT p.id, p.name, p.description, p.cost, p.price, p.quantity, p.thumbnail, p.category, p.delivery_availability, " +
					"DATE_FORMAT(p.created_at, '%Y%m%d') AS createDate " +
					"FROM product p " +
					"LEFT JOIN product_category c ON p.category = c.category_name " +
					"WHERE (c.category_name = ? OR COALESCE(c.main_category_name, c.category_name) = ?) " +
					"AND p.image NOT LIKE 'Nothing%' " +
					"AND (? IS NULL OR p.id > ?) " +  // 커서 조건
					"ORDER BY p.id ASC " +
					"LIMIT " + PRODUCT_PAGE;  // 페이지당 데이터 수
		Object[] params = new Object[] { category, category, cursor, cursor };

		List<ProductResponseDto> products = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class), params);

		String nextCursor = products.isEmpty() ? null : products.get(products.size() - 1).getId();

		return new PaginationResponseDto(products, nextCursor, totalPage);
	}

	/**
	 * 신상품 순으로 정렬 후 반환
	 */
	public PaginationResponseDto findNewestProductByCategory(String category, String cursor, Long totalPage) {
		sql = "SELECT p.id, p.name, p.description, p.cost, p.price, p.quantity, p.thumbnail, p.category, p.delivery_availability, " +
				"DATE_FORMAT(p.created_at, '%Y%m%d%H%i%s') AS createDate " +
				"FROM product p " +
				"LEFT JOIN product_category c ON p.category = c.category_name " +
				"WHERE (c.category_name = ? OR COALESCE(c.main_category_name, c.category_name) = ?) " +
				"AND p.image NOT LIKE 'Nothing%' " +
				"AND (? IS NULL OR p.created_at < ?) " +  // 신상품 순으로
				"ORDER BY p.created_at DESC " +
				"LIMIT " + PRODUCT_PAGE;
		Object[] params = new Object[] { category, category, cursor, cursor };

		List<ProductResponseDto> products = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class), params);
		String nextCursor = products.isEmpty() ? null : products.get(products.size() - 1).getCreateDate();

		return new PaginationResponseDto(products, nextCursor, totalPage);
	}

	/**
	 * 사전 순으로 정렬
	 */
	public PaginationResponseDto findDictionaryProductByCategory(String category, String cursor, Long totalPage) {
		sql = "SELECT p.id, p.name, p.description, p.cost, p.price, p.quantity, p.thumbnail, p.category, p.delivery_availability, " +
				"DATE_FORMAT(p.created_at, '%Y%m%d') AS createDate " +
				"FROM product p " +
				"LEFT JOIN product_category c ON p.category = c.category_name " +
				"WHERE (c.category_name = ? OR COALESCE(c.main_category_name, c.category_name) = ?) " +
				"AND p.image NOT LIKE 'Nothing%' " +
				"AND (? IS NULL OR p.name > ?) " +  // 사전 순
				"ORDER BY p.name ASC " +
				"LIMIT " + PRODUCT_PAGE;

		Object[] params = new Object[] { category, category, cursor, cursor };

		List<ProductResponseDto> products = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class), params);
		String nextCursor = products.isEmpty() ? null : products.get(products.size() - 1).getName();

		return new PaginationResponseDto(products, nextCursor, totalPage);
	}

	/**
	 * 낮은 가격순으로 정렬
	 */
	public PaginationResponseDto findCheaperProductByCategory(String category, String cursor, Long totalPage) {
		sql = "SELECT p.id, p.name, p.description, p.cost, p.price, p.quantity, p.thumbnail, p.category, p.delivery_availability, " +
				"DATE_FORMAT(p.created_at, '%Y%m%d') AS createDate " +
				"FROM product p " +
				"LEFT JOIN product_category c ON p.category = c.category_name " +
				"WHERE (c.category_name = ? OR COALESCE(c.main_category_name, c.category_name) = ?) " +
				"AND p.image NOT LIKE 'Nothing%' " +
				"AND (? IS NULL OR p.price > ?) " +
				"ORDER BY p.price ASC, p.name ASC " +  // 가격 싼 순으로 정렬, 같을 경우 이름 순으로
				"LIMIT " + PRODUCT_PAGE;

		Object[] params = new Object[] { category, category, cursor, cursor };

		List<ProductResponseDto> products = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class), params);
		String nextCursor = String.valueOf(products.isEmpty() ? null : products.get(products.size() - 1).getPrice());

		return new PaginationResponseDto(products, nextCursor, totalPage);
	}

	/**
	 * 높은 가격순으로 정렬
	 */
	public PaginationResponseDto findExpensiveProductByCategory(String category, String cursor, Long totalPage) {
		sql = "SELECT p.id, p.name, p.description, p.cost, p.price, p.quantity, p.thumbnail, p.category, p.delivery_availability, " +
				"DATE_FORMAT(p.created_at, '%Y%m%d') AS createDate " +
				"FROM product p " +
				"LEFT JOIN product_category c ON p.category = c.category_name " +
				"WHERE (c.category_name = ? OR COALESCE(c.main_category_name, c.category_name) = ?) " +
				"AND p.image NOT LIKE 'Nothing%' " +
				"AND (? IS NULL OR p.price < ?) " +
				"ORDER BY p.price DESC, p.name ASC " +  // 가격 비싼 순으로 정렬, 같을 경우 이름 순으로
				"LIMIT " + PRODUCT_PAGE;

		Object[] params = new Object[] { category, category, cursor, cursor };

		List<ProductResponseDto> products = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class), params);
		String nextCursor = String.valueOf(products.isEmpty() ? null : products.get(products.size() - 1).getPrice());

		return new PaginationResponseDto(products, nextCursor, totalPage);
	}

	/**
	 * 인기순으로 정렬
	 */
	public PaginationResponseDto findBestProductByCategory(String category, String cursor, Long totalPage) {
		sql = "SELECT p.id, p.name, p.description, p.cost, p.price, p.quantity, p.thumbnail, p.category, p.delivery_availability, "
				+ "DATE_FORMAT(p.created_at, '%Y%m%d%H%i%s') AS createDate, "
				+ "COALESCE(SUM(s.purchaseQuantity), 0) AS total_sales "
				+ "FROM product p "
				+ "LEFT JOIN product_category c ON p.category = c.category_name "
				+ "LEFT JOIN sales s ON p.id = s.product_id "
				+ "WHERE (c.category_name = ? OR COALESCE(c.main_category_name, c.category_name) = ?) "
				+ "AND (? IS NULL OR p.created_at > ?) "
				+ "GROUP BY p.id "
				+ "ORDER BY total_sales DESC, p.created_at ASC "
				+ "LIMIT " + PRODUCT_PAGE;

		Object[] params = new Object[] { category, category, cursor, cursor };

		List<ProductResponseDto> products = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class), params);
		String nextCursor = products.isEmpty() ? null : products.get(products.size() - 1).getCreateDate();

		return new PaginationResponseDto(products, nextCursor, totalPage);
	}

	/**
	 * 해당 카테고리에 있는 제품 수 조회
	 * @param category	카테고리명
	 * @return	제품 수
	 */
	public long countProductsByCategory(String category) {
		String sql = "SELECT COUNT(*) FROM product p " +
				"LEFT JOIN product_category c ON p.category = c.category_name " +
				"WHERE (c.category_name = ? OR COALESCE(c.main_category_name, c.category_name) = ?) " +
				"AND p.image NOT LIKE 'Nothing%'";

		return jdbcTemplate.queryForObject(sql, Long.class, category, category);
	}


	/**
	 * 오늘 배송 상품으로 등록 여부
	 * @param productId 제품 id
	 * @param status	오눌 배송 상품 등록 여부
	 */
	public void updateDeliveryAvailabilityById(String productId, char status) {
		sql = "UPDATE product SET delivery_availability = " + status + " WHERE id = ?";

		jdbcTemplate.update(sql, productId);
	}

	// 제품 별 이미지 불러오기
	public ProductResponseDto findImagesByProductId(String productId) {
		sql = "SELECT image FROM product WHERE id = ?";

		return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class), productId);
	}

	/**
	 *
	 * best item db 추가 후 주기적 갱신을 위한 카테고리 불러오기
	 * @return
	 */
	// 추가 저장된 카테고리 불러오기
	public List<String> findCategory() {
		sql = "SELECT category_name FROM product_category";

		return jdbcTemplate.queryForList(sql, String.class);
	}

	/**
	 *
	 * best item db 추가 후 주기적 갱신을 위한 카테고리별 제품 순위 블러우기
	 * @param category
	 * @return
	 */
	public List<ProductResponseDto> findBestProductByCategory(String category) {
		sql = "SELECT p.*, COALESCE(s.purchaseQuantity, 0) AS purchaseQuantity \n"
				+ "FROM product p \n"
				+ "LEFT JOIN sales s ON s.product_id = p.id \n"
				+ "WHERE p.category = ? \n"
				+ "ORDER BY purchaseQuantity DESC, p.created_at DESC \n"
				+ "LIMIT 8";

		return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class), category);
	}


	/**
	 * 카테고리에서의 베스트 상품 조회
	 * @param category	카테고리명
	 * @return	제품 정보
	 */
	public List<ProductResponseDto> findBestItemByCategory(String category) {
		sql = "SELECT DISTINCT p.id, p.name, p.description, p.category, p.thumbnail, p.delivery_availability, p.createDate AS , p.cost, p.price, p.quantity, " +
				"COALESCE(SUM(s.purchaseQuantity), 0) AS totalQuantity " +
				"FROM product p " +
				"LEFT JOIN sales s ON p.id = s.product_id " +
				"WHERE p.category = ? " +
				"GROUP BY p.id, p.name, p.description, p.category, p.image, p.delivery_availability, p.createDate, p.cost, p.price, p.quantity " +
				"ORDER BY COALESCE(SUM(s.purchaseQuantity), 0) DESC";

		return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class), category);
	}
}
