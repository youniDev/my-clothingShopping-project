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

	/**
	 * 주문 정보 등록
	 *    purchase.userId: 주문하는 사용자의 ID
	 *    purchase.totalCost: 주문 총 비용
	 *    orderId: 주문 ID
	 */
	public void insertOrder(CartRequestDto purchase, String orderId) {
		sql = "INSERT INTO purchase_order (id, user_id, total_cost) " +
				"VALUES (?, ?, ?)";
		try {
			jdbcTemplate.update(
					sql,
					orderId,
					purchase.getUserId(),
					purchase.getTotalCost()
			);
		} catch (Exception e) {
			log.error(e.toString());
			throw new RuntimeException(e);
		}
	}

	/**
	 * 판매 정보 등록
	 *
	 * @param purchase 
	 * 	purchase.productId: 판매된 제품의 ID
	 * 	purchase.quantity: 판매된 제품의 수량
	 * @param orderId 주문 ID
	 */
	public void insertSales(CartRequestDto purchase, String orderId) {
		sql = "INSERT INTO sales (order_id, product_id, purchaseQuantity) " +
				"VALUES (?, ?, ?)";
		try {
			jdbcTemplate.update(
					sql,
					orderId,
					purchase.getProductId(),
					purchase.getQuantity()
			);
		} catch (Exception e) {
			log.error(e.toString());
			throw new RuntimeException(e);
		}
	}
	/**
	 * 사용자가 구매 진행 후, 장바구니에서 구매한 제품의 id만 삭제
	 * @param productId 제품 id
	 * @param userId	유저 id
	 */
	public void deleteCartBySales(List<String> productId, String userId) {
		sql = "DELETE FROM cart WHERE product_id = ? AND user_id = ?";

		// 여러 건을 삭제해야 하고, 반복적으로 쿼리를 실행하는 상황에 사용
		jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps, int i) throws SQLException {
				ps.setString(1, productId.get(i));
				ps.setString(2, userId);
			}

			@Override
			public int getBatchSize() {
				return productId.size();
			}
		});
	}

	/**
	 * 장바구니에 제품을 추가
	 *
	 * @param cart 장바구니에 추가할 제품 정보를 담은 객체
	 *              - productId: 추가할 제품의 ID
	 *              - quantity: 추가할 제품의 수량
	 *              - userId: 제품을 추가하는 사용자의 ID
	 */
	public void insertCart(CartRequestDto cart) {
		sql = "INSERT INTO cart (product_id, purchaseQuantity, user_id) " +
				"VALUES (?, ?, ?)";
		try {
			jdbcTemplate.update(
					sql,
					cart.getProductId(),
					cart.getQuantity(),
					cart.getUserId()
			);
		} catch (Exception e) {
			log.error(e.toString());
			throw new RuntimeException(e);
		}
	}

	/**
	 * 주어진 사용자와 제품에 대한 장바구니 항목이 존재하는지 여부를 확인
	 *
	 * @param cart 장바구니에 존재하는지 확인할 제품 정보를 담은 CartRequestDto 객체
	 *                - userId: 장바구니에 존재하는지 확인할 사용자의 ID
	 *                - productId: 장바구니에 존재하는지 확인할 제품의 ID
	 * @return 장바구니에 해당 제품 존재할 경우 true 반환
	 */
	public boolean cartExists(CartRequestDto cart) {
		sql = "SELECT COUNT(*) > 0 FROM cart WHERE user_id = ? AND product_id = ?";

		return jdbcTemplate.queryForObject(sql, Boolean.class, cart.getUserId(), cart.getProductId());
	}

	/**
	 * 장바구니에서 제품의 수량을 업데이트
	 *
	 * @param cart 업데이트할 제품의 정보를 담은 CartRequestDto 객체
	 *                - quantity: 업데이트할 제품의 수량
	 *                - userId: 제품을 업데이트하는 사용자의 ID
	 *                - productId: 업데이트할 제품의 ID
	 */
	public void updateCartQuantity(CartRequestDto cart) {
		sql = "UPDATE cart SET purchaseQuantity = purchaseQuantity + ? WHERE user_id = ? AND product_id = ?";
		try {
			jdbcTemplate.update(
					sql,
					cart.getQuantity(),
					cart.getUserId(),
					cart.getProductId()
			);
		} catch (Exception e) {
			log.error(e.toString());
			throw new RuntimeException(e);
		}
	}

}
