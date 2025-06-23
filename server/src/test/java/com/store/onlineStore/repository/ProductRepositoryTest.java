package com.store.onlineStore.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.jdbc.DataJdbcTest;
import org.springframework.boot.test.context.SpringBootTest;

import com.store.onlineStore.dto.ProductResponseDto;

@SpringBootTest
class ProductRepositoryTest {
	@Autowired
	private ProductRepository productRepository;

	@Test
	void findProductIdByCategory() {
	}

	@Test
	void findProductByCategory() {
	}

	@Test
	@DisplayName("조회 잘 되는지")
	void selectAll() {
		List<ProductResponseDto> products = productRepository.selectAll();

		for (ProductResponseDto product : products) {
			System.out.println(product.toString());
		}
	}

	@Test
	void findAllById() {
	}

	@Test
	void findBestItem() {
	}

	@Test
	void findNewItem() {
	}

	@Test
	void findBestItemByCategory() {
	}
}
