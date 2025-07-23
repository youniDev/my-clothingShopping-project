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

}
