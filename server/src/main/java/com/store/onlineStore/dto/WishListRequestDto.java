package com.store.onlineStore.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WishListRequestDto {
	@JsonIgnore // 클라이언트로부터는 숨김
	private String userId;

	private String productId;
}
