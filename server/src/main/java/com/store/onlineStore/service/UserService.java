package com.store.onlineStore.service;

import java.util.StringTokenizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Service;

import com.store.onlineStore.dto.registerDTO.RegistrationDto;
import com.store.onlineStore.dto.registerDTO.UserResponseDto;
import com.store.onlineStore.oauth.config.jwt.TokenProvider;
import com.store.onlineStore.repository.UserRepository;
import com.store.onlineStore.util.EmailUtil;
import com.store.onlineStore.util.RandomNum;
import com.store.onlineStore.util.RedisUtil;
import com.store.onlineStore.util.SmsUtil;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserService {

	@Autowired
	UserRepository userRepository;
	@Autowired
	SmsUtil sms;
	@Autowired
	EmailUtil email;
	@Autowired
	RedisUtil redisUtil;
	
	final int random = 5;


	// 문자 인증 번호 전송
	public ResponseEntity<?> sendVerificationCodeByPhone(String telephone) {
		String verificationCode = new RandomNum(random).getNum();

		// 300원만 무료....sms 1건당 10원...
		//sms.sendOne(telephone, verificationCode);

		return ResponseEntity.ok(verificationCode);
	}

	// 이메일 인증 번호 전송
	public ResponseEntity<?> sendVerificationCodeByEmail(String mail) {
		String verificationCode = new RandomNum(random).getNum();
		// send 이메일
		// email.sendMail(mail, verificationCode);

		return ResponseEntity.ok(verificationCode);
	}

}
