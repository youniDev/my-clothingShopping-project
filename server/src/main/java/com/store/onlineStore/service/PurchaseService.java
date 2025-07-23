package com.store.onlineStore.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.store.onlineStore.dto.CartRequestDto;
import com.store.onlineStore.repository.PurchaseRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PurchaseService {
	@Autowired
	PurchaseRepository purchaseRepository;

	/**
	 * 장바구니에 제품 추가
	 */
	public void updateCart(CartRequestDto cart) {
		boolean exists = purchaseRepository.cartExists(cart);

		if (exists) {
			purchaseRepository.updateCartQuantity(cart);	// 기존에 장바구니가 있는 경우
		}
		if (isNot(exists)) {
			purchaseRepository.insertCart(cart);	// 없는 경우 새로 추가
		}
	}

	private boolean isNot(boolean result) {
		return !result;
	}
}
