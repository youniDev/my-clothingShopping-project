package com.store.onlineStore.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.store.onlineStore.dto.ProductResponseDto;
import com.store.onlineStore.dto.WishListRequestDto;
import com.store.onlineStore.oauth.config.jwt.TokenProvider;
import com.store.onlineStore.repository.UserRepository;
import com.store.onlineStore.repository.WishListRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class UserController {
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private WishListRepository wishListRepository;
	@Autowired
	private ProductManagementController productController;
	@Autowired
	private BoardController boardController;
	@Autowired
	private PurchaseController purchaseController;

	private final TokenProvider tokenProvider;

	/**
	 * 사용자의 위시리스트에 제품 추가
	 *
	 * @param wishList 위시리스트에 추가할 제품 정보를 담은 WishListRequestDto 객체
	 */
	@PostMapping("/add/wishList")
	public ResponseEntity<?> addWishListByUserId(@RequestBody WishListRequestDto wishList, @RequestHeader("Authorization") String accessToken) {
		try {
			String userId = this.tokenProvider.getUserIdFromToken(accessToken.substring(7));
			wishList.setUserId(userId);

			wishListRepository.insertWishList(wishList);
			return ResponseEntity.status(HttpStatus.OK).body(true);
		} catch (DuplicateKeyException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("duplicate entry");	// 중복일 경우
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
		}
	}

	/**
	 * 사용자의 위시리스트 조회
	 *
	 */
	@GetMapping("/fetch/wishList/userId")
	public ResponseEntity<?> fetchWishListByUserId(@RequestHeader("Authorization") String accessToken) {
		try {
			String userId = this.tokenProvider.getUserIdFromToken(accessToken.substring(7));

			List<ProductResponseDto> products = wishListRepository.findWishListByUserId(userId);

			productController.changedProductThumbnails(products);	// 썸네일 경로 수정

			return ResponseEntity.status(HttpStatus.OK).body(products);
		} catch (RuntimeException | IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
		}
	}



	/**
	 * 회원 탈퇴 시, 장바구니 삭제
	 */
	private void deletePostByUserId(String userId) {
		try {
			wishListRepository.deleteWishListByUserId(userId);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 회원 id 삭제
	 */
	private void deleteUserByUserId(String userId) {
		try {
			userRepository.deleteUser(userId);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@GetMapping("/delete/user")
	public ResponseEntity<?> deleteUser(@RequestHeader("Authorization") String accessToken) {
		try {
			String unknown = "unknown";
			String userId = this.tokenProvider.getUserIdFromToken(accessToken.substring(7));

			// 1. unknown 으로 대체
			boardController.replacePostWithUnknown(unknown, userId);	// write_post

			boardController.replaceCommentWithUnknown(unknown, userId);		// comment_user
			purchaseController.replacePurchaseOrderWithUnknown(unknown, userId);	// purchase_order	-purchase Repository

			// 2. 해당 email 관련 데이터 모두 삭제
			deletePostByUserId(userId);		// user_wish_list
			purchaseController.deleteCart(userId);	// cart
			deleteUserByUserId((userId));	// user

			return ResponseEntity.ok("");
		}catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(401).body("DELETE ERROR");
		}
	}
}
