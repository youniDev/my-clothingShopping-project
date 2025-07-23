package com.store.onlineStore.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
// // 커서 기반 페이징 1029 추가중
public class PaginationResponseDto {
	private List<ProductResponseDto> products; // 제품 리스트
	private String nextCursor; // 다음 커서
	private Long totalPage;

	public PaginationResponseDto(List<ProductResponseDto> products, String nextCursor, Long totalPage) {
		this.products = products;
		this.nextCursor = nextCursor;
		this.totalPage = totalPage;
	}
}
