package com.store.onlineStore.oauth.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
/**
 * 외부에 저장된 이미지 조회
 *  /images/**로 들어온 모든 경로를 파일 주소로 변경
 */
public class WebConfig implements WebMvcConfigurer {
	@Value("${path.image}")
	private String CONNECT_PATH;
	@Value("${file.path.resourcePath}")
	private String RESOURCE_PATH;
	final Path FILE_ROOT = Paths.get("./").toAbsolutePath().normalize();    // resources 폴더가 아닌 위치 일때 , 현재 위치를 지정함

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		String resourceBasePath = "file:///" + FILE_ROOT.toString() + RESOURCE_PATH;

		registry.addResourceHandler(CONNECT_PATH)
				.addResourceLocations(resourceBasePath);
	}
}
