package com.store.onlineStore.dto;

import com.store.onlineStore.oauth.config.jwt.TokenProvider;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WriteRequestDto {
	private String userId;
	private PostDto post;
}
