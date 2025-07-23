package com.store.onlineStore.dto;

import net.minidev.json.annotate.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class CartRequestDto {
	@JsonIgnore
	private String userId;	// 제품을 구매하는 사용자의 id
	private String productId;	// 구매하려는 제품 id
	private int quantity;	// 구매하려는 제품 수량
	private int totalCost;	// 총 구매 금액
}
