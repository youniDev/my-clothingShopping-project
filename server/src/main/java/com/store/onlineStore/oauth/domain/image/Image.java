package com.store.onlineStore.oauth.domain.image;

import java.io.File;
import java.util.UUID;

import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

public class Image {
	public String name;
	public String path;
	public String clientpath;

	/**
	 * 이미지 새로 생성
	 * @param file
	 * @param directory
	 */
	public Image(MultipartFile file, File directory, String server) {
		this.name = generateName(file);
		this.path = generateImagePath(this.name, directory);
		this.clientpath = server + this.path;
	}

	/**
	 * react로 부터 받은 이미지 경로
	 * @param clientpath
	 * @param type
	 */
	public Image(String clientpath, String type, String server) {
		this.clientpath = clientpath;
		this.name = deleteServerPath(this.clientpath, server);
		this.path = name;
	}

	/**
	 * react에게 보낼 이미지 경로
	 * @param name
	 */
	public Image(String name, String server) {
		this.name = convertJsonToString(name);
		this.path = name;
		this.clientpath = server + this.name;
	}
	private String generateName(MultipartFile file) {
		String originalName = StringUtils.cleanPath(file.getOriginalFilename());

		int dotIndex = originalName.lastIndexOf('.');

		if (dotIndex > 0) {
			return UUID.randomUUID().toString() + originalName.substring(dotIndex);
		}

		return null;
	}
	private String generateImagePath(String name, File directory) {
		if (name == null) return null;

		String basePath = directory.getAbsolutePath();
		String path = basePath + File.separator + name;

		return path;
	}

	private String convertJsonToString(String name) {
		return name.replaceAll("[\"\\[\\]]", "");
	}

	public String deleteServerPath(String path, String server) {
		if (path.contains(server)) {
			return path.replaceAll(server, "");
		}

		return path;
	}
}
