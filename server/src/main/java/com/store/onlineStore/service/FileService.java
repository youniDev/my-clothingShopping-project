package com.store.onlineStore.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.store.onlineStore.oauth.domain.image.Directory;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class FileService {
	@Value("${file.dir}")
	private String IMAGE_UPLOAD_DIR;
	@Value("${file.path.server}")
	private String IMAGE_PATH;

	// 이미지 이름으로 로컬 내에 있는 이미지들 제거

	/**
	 * db에 저장되어 있는 이름을 비교해 파일에 있는 이미지 모두 제거하는 함수
	 * @param images db에 저장되어 있는 이미지 이름 배열
	 * @throws IOException
	 */
	public void deleteImages(String[] images) throws IOException {
		Directory directory = new Directory(images, IMAGE_PATH);

		directory.deleteAllImageInDirectory(images);
	}

	// 해당 dir에 이미지 저장
	public void saveImages(MultipartFile[] files, String[] paths) throws IOException {
		File file = new File(IMAGE_UPLOAD_DIR);

		if (!file.exists()) {
			file.mkdirs();
			log.info("create directory");
		}

		Directory directory = new Directory(files, paths);
	}

	// 변경 전 이미지와 변경 후 이미지의 변동이 있을 때 변동된 이미지 삭제
	public void deleteImages(String[] original, String modified) throws IOException {
		ArrayList<String> imagesToDelete = new ArrayList<>();
		ArrayList<String> modifiedImages = new ArrayList<>(Arrays.asList(modified));

		for (String image : original) {
			if (!modifiedImages.contains(image)) imagesToDelete.add(image);
		}

		String[] finalImagesToDelete = new String[imagesToDelete.size()];
		finalImagesToDelete = imagesToDelete.toArray(finalImagesToDelete);

		deleteImages(finalImagesToDelete);
	}
}
