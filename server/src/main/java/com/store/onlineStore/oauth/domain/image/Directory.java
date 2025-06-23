package com.store.onlineStore.oauth.domain.image;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class Directory {
	String[] path;
	String upload;

	public Directory(String[] path, String upload) {
		this.path = path;
		this.upload = upload;
	}

	public Directory(MultipartFile[] files, String[] paths) throws IOException {
		this.path = paths;
		saveAllImageInDirectory(files);
	}

	public void saveAllImageInDirectory(MultipartFile[] files) throws IOException {
		if (files == null) {
			log.info("files is null");
			return ;
		}

		for (int i = 0; i < files.length; i++) {
			File image = new File(this.path[i]);

			files[i].transferTo(image);
		}
	}

	public void deleteAllImageInDirectory(String[] names) throws IOException {
		if (isEmptyArray(names)) return ;

		getNamesFromImageJSon(names);

		for (String name : path) {
			Path filePath = Paths.get(name);

			if (Files.notExists(filePath)) continue;

			Files.delete(filePath);
		}
	}

	/**
	 * json 형식으로 저장된 요소들을 string 배열로 변환해 저장
	 * @param s db에 저장되어있는 json 형태의 이미지 이름 배열
	 */
	private void getNamesFromImageJSon(String[] s) {
		int length = s.length;
		String[] names = new String[length];

		for (int i = 0; i < length; i++) {
			names[i] = s[i].replaceAll("[\"\\[\\]]", "");
		}

		this.path = names;
	}

	private boolean isEmptyArray(String[] array) {
		if (array.length == 1 && array[0].equals("[]")) return true;

		return false;
	}
}
