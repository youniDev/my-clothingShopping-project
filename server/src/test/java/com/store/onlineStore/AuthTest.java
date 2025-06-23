package com.store.onlineStore;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.store.onlineStore.controller.LoginController;

@SpringBootTest
public class AuthTest {
	@Autowired
	LoginController controller;
	final String email = "aa@a.c";

	private Map<String, String> setData(String pw) {
		Map<String, String> info = new HashMap<>();

		info.put("email", email);
		info.put("password", pw);

		return info;
	}
	@Test
	void 발급_테스트() {
		String pw = "cs!@12Aa";

		controller.signin(setData(pw));
	}
}
