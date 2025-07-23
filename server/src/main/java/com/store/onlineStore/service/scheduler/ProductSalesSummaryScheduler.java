package com.store.onlineStore.service.scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.store.onlineStore.service.ProductManagementService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class ProductSalesSummaryScheduler {
	@Autowired
	ProductManagementService productService;

	// 매시간 0분에 실행 (cron 표현식)
	@Scheduled(cron = "0 0 * * * *")
	//@Scheduled(fixedRate = 600000) // 10분마다 (600,000 milliseconds)
	public void updateBestProducts() {
		log.info("update Product Sales Summary");
		productService.updateProductSalesSummary();
	}
}
