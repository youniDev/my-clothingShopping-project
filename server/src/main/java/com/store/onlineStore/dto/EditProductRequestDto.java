package com.store.onlineStore.dto;

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
public class EditProductRequestDto {
	private String id;
	private String name;
	private String description;
	private String category;
	private String image;
	private int cost;
	private int price;
	private int stock;
}
