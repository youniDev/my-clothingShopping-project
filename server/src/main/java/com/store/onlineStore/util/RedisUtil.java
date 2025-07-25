package com.store.onlineStore.util;

import java.time.Duration;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class RedisUtil {
	private final StringRedisTemplate template;

	public String getData(String key) {
		ValueOperations<String, String> valueOperations = template.opsForValue();
		return valueOperations.get(key);
	}

	public boolean existData(String key) {
		return Boolean.TRUE.equals(template.hasKey(key));
	}

	public void setDataExpire(String key, String value, long duration) {
		ValueOperations<String, String> valueOperations = template.opsForValue();
		Duration expireDuration = Duration.ofSeconds(duration);
		valueOperations.set(key, value, expireDuration);
	}

	public void deleteData(String key) {
		template.delete(key);
	}
}
