package com.store.onlineStore.service;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.store.onlineStore.dto.ProductResponseDto;
import com.store.onlineStore.oauth.domain.image.Image;

@Service
public class ImageService {
	@Value("${file.dir}")
	private String UPLOAD_DIR;
	@Value("${file.path.server}")
	private String IMAGE_PATH;


	/**
	 * db에 저장된 이미지내역과 변경된 이미지 내역이 같지 않은 경우
	 * @param existing
	 * @param modified
	 * @return
	 */
	public String[] getImagesName(String[] existing, String[] modified) {
		if (isEmptyArray(existing)) return new String[0];

		existing = getImagesForSendImage(existing, "name");
		List<String> modifiedImages = Arrays.asList(modified);

		return Arrays.stream(existing)
				.filter(image -> !modifiedImages.contains(image))
				.toArray(String[]::new);
	}

	
	// 서버 주소를 제외한 기존에 등록된 이미지 이름 얻는 함수
	public String[] getImagesNamesForExisting(String[] existing) {
		String[] name = new String[existing.length];

		int index = 0;
		for (String clientPath : existing) {
			Image image = new Image(clientPath, "server");

			name[index++] = image.name;
		}

		return name;
	}

	// String -> json
	public String getPathAsJson(String[] path) throws IOException {
		if (path == null) return "";

		ObjectMapper objectMapper = new ObjectMapper();

		return objectMapper.writeValueAsString(path);
	}


	public String getImagesForSendImage(String name, String type) {
		Image image = new Image(name, IMAGE_PATH);

		if (type.equals("name")) {
			return image.name;
		}
		if (type.equals("clientPath")) {
			return image.clientpath;
		}

		return null;
	}

	public String[] getImagesForSendImage(String[] names, String type) {
		String[] images = new String[names.length];

		int index = 0;
		for (String name : names) {
			Image image = new Image(name, IMAGE_PATH);

			if (type.equals("name")) {
				images[index++] = image.name;
			}
			if (type.equals("clientPath")) {
				images[index++] = image.clientpath;
			}
		}

		return images;
	}


	private boolean isEmptyArray(String[] array) {
		if (array.length == 1 && array[0].equals("[]")) return true;

		return false;
	}

	/**
	 * 기존에 저장된 이미지의 이름 배열에 새로 추가할 이미지의 이름을 저장하는 함수
	 */
	public Image[] getImagesName(MultipartFile[] files, String[] existing) {
		int filesLength = 0, existingLength = 0;
		if (files != null) filesLength = files.length;
		if (existing != null) existingLength = existing.length;

		Image[] images = new Image[filesLength + existingLength];
		int index = 0;

		File directory = new File(UPLOAD_DIR);
		for (int i = 0; i < filesLength; i++) {
			images[index++] = new Image(files[i], directory, IMAGE_PATH);	// 새로 등록할 이미지
		}

		for (int i = 0; i < existingLength; i++) {
			images[index++] = new Image(existing[i], "receiveByReact", IMAGE_PATH);	// 기존 이미지
		}

		return images;
	}

	// 이미지 이름 저장
	public String[] getImagesName(Image[] images) {
		String[] name = new String[images.length];

		for (int i = 0; i < images.length; i++) {
			name[i] = images[i].name;
		}

		return name;
	}

	// 경로 저장
	public String[] getImagesPath(Image[] images) {
		String[] path = new String[images.length];

		for (int i = 0; i < images.length; i++) {
			path[i] = images[i].path;
		}

		return path;
	}

	// 카테고리별 제품들의 썸네일들 불러오기
	public void setProductThumbnail(List<ProductResponseDto> products) throws IOException {
		for (ProductResponseDto product : products) {
			setProductThumbnail(product);
		}
	}

	// 해당 제품의 썸네일만 불러오기
	public void setProductThumbnail(ProductResponseDto product) throws IOException {
		product.setThumbnail(getImagesForSendImage(product.getThumbnail(), "clientPath"));
	}

	// json -> string
	public String[] getNamesByJson(String jsonString) {
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			return objectMapper.readValue(jsonString, String[].class);
		} catch (Exception e) {
			e.printStackTrace();
			return new String[]{};
		}
	}

	// 해당 제품의 이미지들 불러오기
	public void setProductImages(ProductResponseDto product) throws IOException {
		String[] names = product.getImages();

		product.setImages(getImagesForSendImage(names, "clientPath"));
	}

	// 새로 등록할 이미지의 이름을 얻는 함수
	private String[] getImagesNamesByFiles(MultipartFile[] files, File directory) {
		String[] name = new String[files.length];

		int index = 0;
		for (MultipartFile file : files) {
			Image image = new Image(file, directory, IMAGE_PATH);

			name[index++] = image.name;
		}

		return name;
	}

	public void setProductImages(List<ProductResponseDto> products) throws IOException{
		for (ProductResponseDto product : products) {
			setProductImages(product);
		}
	}

}
