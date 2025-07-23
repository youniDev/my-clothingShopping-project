package com.store.onlineStore.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.store.onlineStore.dto.CartRequestDto;
import com.store.onlineStore.dto.ProductResponseDto;
import com.store.onlineStore.repository.BestProductRepository;
import com.store.onlineStore.repository.ProductRepository;
import com.store.onlineStore.repository.ProductSalesSummaryRepository;
import com.store.onlineStore.repository.PurchaseRepository;
import com.store.onlineStore.util.RandomNum;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ProductManagementService {
	@Autowired
	private ProductRepository productRepository;
	@Autowired
	private BestProductRepository bestProductRepository;
	@Autowired
	private PurchaseRepository purchaseRepository;
	@Autowired
	private ProductSalesSummaryRepository productSalesSummaryRepository;
	@Autowired
	private  ImageService imageService;
	int IDENTIFICATION_NUMBER = 5;

	public ProductManagementService(BestProductRepository bestProductRepository) {
		this.bestProductRepository = bestProductRepository;
	}

	/**
	 * 카테고리 ID를 기반으로 제품 ID를 생성합니다.
	 *
	 * @param categoryId 제품을 생성할 카테고리의 ID
	 * @return 생성된 제품의 ID
	 */
	public String generateProductId(String categoryId) {
		categoryId += new RandomNum(IDENTIFICATION_NUMBER).getNum();

		return categoryId;
	}

	/**
	 * 주기마다 best product db 업데이트
	 */
	@Transactional
	public void updateBestProducts() {
		try {
			bestProductRepository.deleteAll();

			List<ProductResponseDto> best = new ArrayList<>();
			List<String> category = productRepository.findCategory();

			category.forEach(c -> {
				List<ProductResponseDto> products = productRepository.findBestProductByCategory(c);

				if (products.isEmpty())
					return;

				best.addAll(products);
			});

			bestProductRepository.updateAll(best);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}

	}

	// 주문 정보 저장
	public String updatePurchaseOrder(CartRequestDto order) {
		String orderId = generateProductId(order.getProductId());	// 주문번호 생성

		purchaseRepository.insertOrder(order, orderId);		// 주문 정보와 주문 번호 저장

		return orderId;
	}

	// 구매 정보 저장
	public void updateSalesByOrderId(List<CartRequestDto> purchases, String orderId) {
		List<String> purchaseId = new ArrayList<>();
		for (CartRequestDto purchase : purchases) {
			purchaseRepository.insertSales(purchase, orderId);	// 제품 id, 구매 수량 저장
			purchaseId.add(purchase.getProductId());	// 장바구니에 있었던 제품 id 저장
		}

		purchaseRepository.deleteCartBySales(purchaseId, purchases.get(0).getUserId());	// 장바구니에 있는 구매한 제품 정보 제거
	}

	// 제품 판매량 업데이트
	@Transactional
	public void updateProductSalesSummary() {
		productSalesSummaryRepository.updateProductSalesSummary();
	}
}
