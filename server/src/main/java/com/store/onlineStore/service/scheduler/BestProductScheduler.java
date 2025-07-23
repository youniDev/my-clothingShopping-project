package com.store.onlineStore.service.scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.store.onlineStore.repository.BestProductRepository;
import com.store.onlineStore.service.ProductManagementService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BestProductScheduler {
	@Autowired
	ProductManagementService productService;

	//@Scheduled(fixedRate = 600000) // 10분마다 (600,000 milliseconds)
	@Scheduled(cron = "0 0 0 * * *")	// 예: 매일 자정에 갱신
	public void updateBestProducts() {
		log.info("update best products");
		productService.updateBestProducts();
	}
}
