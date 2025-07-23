package com.store.onlineStore.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.store.onlineStore.dto.CartRequestDto;
import com.store.onlineStore.dto.CartResponseDto;

import com.store.onlineStore.dto.OrderResponseDto;
import com.store.onlineStore.dto.PurchaseOrderResponseDto;
import com.store.onlineStore.dto.registerDTO.UserResponseDto;
import com.store.onlineStore.oauth.config.jwt.TokenProvider;
import com.store.onlineStore.repository.PurchaseRepository;
import com.store.onlineStore.repository.ReviewRepository;
import com.store.onlineStore.repository.UserRepository;
import com.store.onlineStore.service.ProductManagementService;
import com.store.onlineStore.service.PurchaseService;
import com.store.onlineStore.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PurchaseController {
	@Autowired
	private PurchaseRepository purchaseRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private ProductManagementService productManagementService;
	@Autowired
	private UserService userService;
	@Autowired
	private PurchaseService purchaseService;
	private final TokenProvider tokenProvider;

	/**
	 * 제품 구매 정보 등록
	 * @param purchases 구매한 제품 정보를 담은 리스트
	 */
	@PostMapping("/purchase/product")
	public ResponseEntity<?> addSellProduct(@RequestBody List<CartRequestDto> purchases, @RequestHeader("Authorization") String accessToken) {
		try {
			String userId = this.tokenProvider.getUserIdFromToken(accessToken.substring(7));
			purchases.get(0).setUserId(userId);	// user id 수정

			String orderId = productManagementService.updatePurchaseOrder(purchases.get(0));	// 주문 정보 저장
			productManagementService.updateSalesByOrderId(purchases, orderId);	// 각 제품의 구매 정보 저장

			return ResponseEntity.status(HttpStatus.OK).body(true);
		} catch (Exception e) {
			e.printStackTrace();

			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
		}
	}

	/**
	 * 장바구니에 제품을 추가
	 *
	 * @param cart 장바구니에 추가할 제품 정보를 담은 CartRequestDto 객체
	 * @return 제품 추가가 성공하면 true를 반환
	 */
	@PostMapping("/cart/product")
	public ResponseEntity<?> addCartProduct(@RequestBody CartRequestDto cart, @RequestHeader("Authorization") String accessToken) {
		String userId = this.tokenProvider.getUserIdFromToken(accessToken.substring(7));
		cart.setUserId(userId);

		purchaseService.updateCart(cart);	// 장바구니에 제품 정보 업데이트

		return ResponseEntity.status(HttpStatus.OK).body(cart.getUserId());
	}

	/**
	 * 장바구니 목록 조회
	 * 사용자 ID에 해당하는 제품 목록 조회
	 *
	 * @param accessToken 사용자 정보를 담은 토큰
	 */
	@GetMapping("/fetch/product")
	public ResponseEntity<?> fetchProductByUserId(@RequestHeader("Authorization") String accessToken) {
		try {
			String userId = this.tokenProvider.getUserIdFromToken(accessToken.substring(7));
			List<CartResponseDto> products= purchaseRepository.findProductByUserId(userId);

			return ResponseEntity.status(HttpStatus.OK).body(products);
		} catch (Exception e) {
			if (accessToken.isEmpty()) {
				return ResponseEntity.status(HttpStatus.OK).body("UNAUTHORIZED");	// 토큰이 없는 경우
			}

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("fail");
		}
	}

	/**
	 * 선택한 제품을 장바구니에서 삭제
	 *
	 * @param products 삭제할 제품 정보를 담은 리스트
	 */
	@PostMapping("/cart/delete/product")
	public ResponseEntity<?> deleteSelectedProduct(@RequestBody List<CartRequestDto> products) {
		try {
			for(CartRequestDto product : products) {
				purchaseRepository.deleteCartBySales(product, product.getUserId());
			}

			return ResponseEntity.status(HttpStatus.OK).body(true);
		} catch (Exception e) {

			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
		}
	}

	/**
	 * 사용자의 배송 정보 조회
	 *
	 * @param email 사용자 이메일
	 */
	@PostMapping("/fetch/purchaseOrder/shippingStatus")
	public ResponseEntity<?> fetchShippingStatusByUserid(@RequestBody String email) {
		email = email.replaceAll("\"", "");
		List<PurchaseOrderResponseDto> shippingStatus = purchaseRepository.findShippingStatusByUserId(email);

		return ResponseEntity.status(HttpStatus.OK).body(shippingStatus);
	}

	/**
	 * 구매 목록 조회
	 *
	 * @param orderIds 주문 ID를 담은 문자열 리스트

	 */
	@PostMapping("/fetch/sales/purchaseProduct")
	public ResponseEntity<?> fetchPurchaseProductByOrderId(@RequestBody List<String> orderIds) {
		List<List<OrderResponseDto>> purchaseProduct = new ArrayList<>();

		for (String orderId : orderIds) {
			purchaseProduct.add(purchaseRepository.findProductByOrderId(orderId));
		}

		return ResponseEntity.status(HttpStatus.OK).body(purchaseProduct);
	}

	/**
	 * 구매 전, 회원의 주소를 조회
	 *
	 * @param accessToken 사용자 이메일을 당아놓은 token
	 * @return 사용자의 주소 정보를 담은 ResponseEntity
	 */
	@GetMapping("/fetch/purchase/user")
	public ResponseEntity<?> fetchPurchaseUserByUserid(@RequestHeader("Authorization") String accessToken) {
		String email = this.tokenProvider.getUserIdFromToken(accessToken.substring(7));

		UserResponseDto user = userRepository.findAddressByUserId(email);
		userService.compareAddress(user);	// 주소 수정

		return ResponseEntity.status(HttpStatus.OK).body(user);
	}

	/**
	 * 탈퇴한 회원의 장바구니 삭제
	 * @param userId	탈퇴한 회원의 id
	 */
	public void deleteCart(String userId) {
		try {
			purchaseRepository.deleteCartByUserId(userId);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void replacePurchaseOrderWithUnknown(String unknown, String userId) {
		try {
			purchaseRepository.replaceUserWithUnknown(unknown, userId);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private boolean isNot(boolean result) {
		return !result;
	}
}
