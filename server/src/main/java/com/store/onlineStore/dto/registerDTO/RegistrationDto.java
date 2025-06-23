package com.store.onlineStore.dto.registerDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RegistrationDto {
	private String id;
	private String password;
	private String name;
	private String birth;
	private String path;
	private String address;

	public void setAddress(String address) {
		this.address = address;
	}
}
