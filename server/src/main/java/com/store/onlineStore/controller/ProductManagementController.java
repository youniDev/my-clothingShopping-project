package com.store.onlineStore.controller;


import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.store.onlineStore.dto.CartRequestDto;
import com.store.onlineStore.dto.PaginationResponseDto;
import com.store.onlineStore.dto.ProductRequestDto;
import com.store.onlineStore.dto.ProductResponseDto;
import com.store.onlineStore.oauth.domain.image.Image;
import com.store.onlineStore.repository.BestProductRepository;
import com.store.onlineStore.repository.ProductRepository;
import com.store.onlineStore.repository.PurchaseRepository;
import com.store.onlineStore.service.FileService;
import com.store.onlineStore.service.ImageService;
import com.store.onlineStore.service.ProductManagementService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductManagementController {
	@Autowired
	ProductRepository productRepository;
	@Autowired
	ProductManagementService productManagementService;
	@Autowired
	BestProductRepository bestProductRepository;

	@Autowired
	ImageService imageService;
	@Autowired
	FileService fileService;
	@Autowired
	PurchaseRepository purchaseRepository;
	private final int PRODUCT_PAGE = 8;

	/**
	 * 제품 등록 및 수정
	 *
	 * @param product 등록할 제품 정보를 담은 ProductRequestDto 객체
	 */
	@PostMapping("/addProduct")
	public ResponseEntity<?> addProductInfo(@RequestBody ProductRequestDto product) {
		try {
			// 새로 등록하는 제품
			if (product.getId() == null) {
				String category = productRepository.findProductIdByCategory(product.getSubCategory()); // category id 찾기
				product.setId(productManagementService.generateProductId(category)); // category id + 랜덤식별숫자를 합쳐 product id 생성

				productRepository.insertProduct(product, imageService.getPathAsJson(product.getImages()));

				return ResponseEntity.status(HttpStatus.OK).body(product.getId());
			}
			// 제품 정보를 수정하는 경우

			// 이미지를 등록하지 않았을 경우
			if (product.getImages() == null) {
				productRepository.updateAll(product, null);

				return ResponseEntity.status(HttpStatus.OK).body(true);
			}

			// 이미지를 새로 추가하지 않고, 삭제만 했을 경우, 기존에 db에 저장되어 있는 이미지 목록과 비교해 로컬에 있는 이미지 삭제
			String[] existing = productRepository.findProductImagesById(product.getId());	// 변경 전 이미지
			String[] delete = imageService.getImagesName(existing, product.getImages());
			fileService.deleteImages(delete);

			String[] names = imageService.getImagesNamesForExisting(product.getImages());

			productRepository.updateAll(product, imageService.getPathAsJson(names));

			return ResponseEntity.status(HttpStatus.OK).body(true);
		}catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
		}

	}

	// 이미지 로컬 파일에 저장 후 이름 반환
	// files or names가 null일 경우 null로 받기 위해 required = false 추가
	@PostMapping("/addImages/ProductId")
	public ResponseEntity<?> uploadFile(@RequestParam(value = "files", required = false) MultipartFile[] files,  @RequestParam(value = "imageNames", required = false) String[] imageNames) {
		try {
			Image[] images = imageService.getImagesName(files, imageNames);
			String[] names = imageService.getImagesName(images);
			fileService.saveImages(files, imageService.getImagesPath(images));

			return ResponseEntity.status(HttpStatus.OK).body(names);
		}  catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
		}
	}

	/**
	 * 제품 삭제
	 *
	 * @param productId 삭제할 제품의 ID를 담은 문자열 리스트
	 * @return 제품 삭제가 성공하면 true를 반환
	 */
	@PostMapping("/deleteProduct")
	public ResponseEntity<?> deleteProduct(@RequestBody List<String> productId) {
		try {
			for (String id : productId) {
				String[] names = productRepository.findProductImagesById(id);
				fileService.deleteImages(names);	// 파일에서 이미지 제거
				productRepository.deleteProductById(id);		// db에서 해당 product 정보 제거
			}

			return ResponseEntity.status(HttpStatus.OK).body(true);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}

	}


	/**
	 * 제품 정보 수정을 위해 제품 세부 정보 조회
	 *
	 * @param id 수정할 제품의 ID
	 */
	@PostMapping("/showProductDetail/admin")
	public ResponseEntity<?> showProductDetailByProductId(@RequestBody String id) {
		id = id.replaceAll("\"", "");

		return ResponseEntity.status(HttpStatus.OK).body(productRepository.findAllById(id));
	}

	/**
	 * 관리자가 제품 관리를 위해 모든 제품을 조회
	 *
	 * @return 모든 제품 정보를 담은 ResponseEntity
	 */
	@GetMapping("/showProduct/admin")
	public ResponseEntity<?> getAllProducts() {
		List<ProductResponseDto> product = productRepository.selectAll();
		return ResponseEntity.status(HttpStatus.OK).body(product);
	}

	/**
	 * 제품 ID를 기반으로 제품 이미지를 조회
	 *
	 * @param productRequestDto 제품 ID를 담은 ProductRequestDto 객체
	*/
	@PostMapping("/showProduct/detail/admin")
	public ResponseEntity<?> getProductImageByProductId(@RequestBody ProductRequestDto productRequestDto) {
		try {
			String[] names = productRepository.findProductImagesById(productRequestDto.getId());
			String[] paths = imageService.getImagesForSendImage(names, "clientPath");

			return ResponseEntity.status(HttpStatus.OK).body(paths);
		} catch (RuntimeException e) {
			e.printStackTrace();
			log.error(e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}

	/**
	 * 메인 페이지에 표시할 베스트 및 신제품 정보 조회
	 */
	@GetMapping("/product/main")
	public ResponseEntity<?> getBestItemForMain() throws IOException {
		List<ProductResponseDto> best = bestProductRepository.findMainBestProducts();
		List<ProductResponseDto> newest = productRepository.findNewestProducts();

		changedProductThumbnails(best);
		changedProductThumbnails(newest);

		Map<String, List<ProductResponseDto>> result = Map.of(
				"bestProducts", best,
				"newProducts", newest
		);

		return ResponseEntity.status(HttpStatus.OK).body(result);
	}

	// 이미지 변환
	public void changedProductThumbnails(List<ProductResponseDto> products) throws IOException {
		imageService.setProductThumbnail(products);
	}

	/**
	* 카테고리 제품 목록 조회
	 */
	@PostMapping("/showProduct/category")
	public ResponseEntity<?> getProductsInfoByCategory(@RequestBody String category) {
		try {
			category = category.replaceAll("\"", "");

			List<ProductResponseDto> products = productRepository.findProductByCategory(category);
			imageService.setProductThumbnail(products);

			return ResponseEntity.status(HttpStatus.OK).body(products);
		} catch (NullPointerException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
	/***
	 * 커서 기반 페이지네이션
	 * @param category	특정 카테고리
	 * @param cursor 현재 커서
	 * @param totalPage 현재 페이지
	 * @return
	 */
	@GetMapping("/showProduct/category/page")
	public ResponseEntity<?> getProductsByCategory(
				@RequestParam String category, 
				@RequestParam(required = false) String cursor, 
				@RequestParam(required = false) Long totalPage) {
		try {
			PaginationResponseDto response = productRepository.findProductByCategory(category, cursor, totalPage);
			// 마지막 페이지일 경우
			if (response.getNextCursor() == null) {
				return ResponseEntity.ok(null);
			}
			// thumbnail만 불러오고, 나머지 이미지는 상세페이지에서 불러오기
			imageService.setProductThumbnail(response.getProducts());

			return ResponseEntity.ok(response);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	/***
	 * 특정 카테고리에서 정렬
	 * @param sortType	정렬 타입
	 * @param category	특정 카테고리
	 * @param cursor 현재 커서
	 * @param totalPage 현재 페이지
	 * @return
	 */
	@GetMapping("/sort/product/{sortType}")
	public ResponseEntity<?> getSortedProductsByCategory(
			@PathVariable String sortType,
			@RequestParam String category,
			@RequestParam(required = false) String cursor,
			@RequestParam(required = false) Long totalPage) {
		try {
			PaginationResponseDto response = fetchSortedProducts(sortType, category, cursor, totalPage);
			if (isLastPage(response.getNextCursor())) {
				return ResponseEntity.ok(null);
			}
			changedProductThumbnails(response);

			return ResponseEntity.ok(response);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	public void changedProductThumbnails(PaginationResponseDto response) throws IOException {
		imageService.setProductThumbnail(response.getProducts());
	}
	public boolean isLastPage(String nextCursor) {
		if (nextCursor == null) return true;

		return false;
	}

	private PaginationResponseDto fetchSortedProducts(String sortType, String category, String cursor, Long totalPage) {
		switch (sortType.toLowerCase()) {
			case "new":
				return productRepository.findNewestProductByCategory(category, cursor, totalPage);		// 신제품순
			case "dictionary":	
				return productRepository.findDictionaryProductByCategory(category, cursor, totalPage);	// 사전순
			case "cheaper":
				return productRepository.findCheaperProductByCategory(category, cursor, totalPage);	// 낮은 가격순
			case "expensive":
				return productRepository.findExpensiveProductByCategory(category, cursor, totalPage);	// 높은 가격순
			case "best":
				return productRepository.findBestProductByCategory(category, cursor, totalPage);		// 인기순
			default:
				throw new IllegalArgumentException("Invalid sort type: " + sortType);
		}
	}

	// 특정 카테고리 베스트 아이템 조회
	@GetMapping("/best/category")
	public ResponseEntity<?> getBestProductsByCategory (@RequestParam String category) throws IOException {
		category = category.replaceAll("\"", "");

		List<ProductResponseDto> best = bestProductRepository.findBestProductByCategory(category);
		imageService.setProductThumbnail(best);

		long totalProducts = productRepository.countProductsByCategory(category);	// 해당 카테고리에 대한 제품 수
		long page = (int)Math.ceil((double) totalProducts / PRODUCT_PAGE);

		PaginationResponseDto pages = new PaginationResponseDto(best, null, page);

		return ResponseEntity.ok(pages);
	}


	/**
	 * 오늘 배송 상품으로 제품의 배송 상태를 업데이트
	 *
	 * @param productId 배송 가능한 상태로 변경할 제품의 ID를 담은 문자열 리스트
	 * @return 배송 상태 업데이트가 성공하면 true를 반환
	 */
	@PostMapping("/updateDeliveryStatus/true")
	public ResponseEntity<?> updateDeliveryStatusForAvailable(@RequestBody List<String> productId) {
		productId.forEach(i -> {
			productRepository.updateDeliveryAvailabilityById(i, '1');
		});

		return ResponseEntity.status(HttpStatus.OK).body(true);
	}

	/**
	 * 오늘 배송 불가능한 상품으로 제품의 배송 상태를 업데이트
	 *
	 * @param productId 배송 불가능 상태로 변경할 제품의 ID를 담은 문자열 리스트
	 * @return 배송 상태 업데이트가 성공하면 true를 반환
	 */
	@PostMapping("/updateDeliveryStatus/false")
	public ResponseEntity<?> updateDeliveryStatusForUnavailable(@RequestBody List<String> productId) {
		char available = '0';

		for (String id : productId) {
			productRepository.updateDeliveryAvailabilityById(id, available);
		}

		return ResponseEntity.status(HttpStatus.OK).body(true);
	}


	/**
	 * 제품 상세 페이지에서 해당 제품에 맞는 이미지 불러오기
	 * @param productId
	 * @return
	 */
	@PostMapping("/fetch/product/image/productId")
	public ResponseEntity<?> getImageByProductId (@RequestBody String productId) {
		try {
			productId = productId.replaceAll("\"", "");
			ProductResponseDto product = productRepository.findImagesByProductId(productId);

			product.setImages(imageService.getNamesByJson(product.getImage()));
			imageService.setProductImages(product);
			return ResponseEntity.ok(product);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("error");
		}
	}
	/**
	 * 카테고리 베스트 상품 조회
	 *
	 */
	@PostMapping("/bestItem/category")
	public ResponseEntity<?> getBestItemByCategory(@RequestBody String category) {
		category = category.replaceAll("\"", "");

		List<ProductResponseDto> product = productRepository.findBestItemByCategory(category);

		return ResponseEntity.status(HttpStatus.OK).body(product);
	}

	/**
	 * 제품을 구매 수량 순으로 정렬하여 반환
	 *
	 */
	@PostMapping("/sort/product/quantity")
	public ResponseEntity<?> sortProductOrderByQuantity(@RequestBody List<String> productId) {
		try {
			// 아무것도 검색되지 않는 경우
			if (productId == null || productId.size() == 0) {
				return ResponseEntity.status(HttpStatus.OK).body(null);
			}

			List<CartRequestDto> sortedProduct = purchaseRepository.findProductOrderByQuantity(productId);

			return ResponseEntity.status(HttpStatus.OK).body(sortedProduct);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
		}
	}
}
