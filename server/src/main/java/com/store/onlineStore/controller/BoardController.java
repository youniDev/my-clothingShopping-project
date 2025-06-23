package com.store.onlineStore.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.store.onlineStore.dto.CommentRequestDto;
import com.store.onlineStore.dto.CommentResponseDto;
import com.store.onlineStore.dto.PostDto;
import com.store.onlineStore.dto.PostResponseDto;
import com.store.onlineStore.dto.WriteRequestDto;
import com.store.onlineStore.oauth.config.jwt.TokenProvider;
import com.store.onlineStore.repository.CommentsRepository;
import com.store.onlineStore.repository.WriteRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BoardController {
	@Autowired
	WriteRepository writeRepository;
	@Autowired
	CommentsRepository commentsRepository;

	private final TokenProvider tokenProvider;

	/**
	 * 글 등록
	 *	- 유저만 글 작성 가능
	 *
	 * @param post 작성한 글 정보
	 */
	@PostMapping("/add/write")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<?> addWrite(@RequestBody PostDto post,  @RequestHeader("Authorization") String accessToken) {
		try {
			String userId = this.tokenProvider.getUserIdFromToken(accessToken.substring(7));
			post.setCategory(writeRepository.findCategoryId(post.getCategory()));

			// post id가 있을 경우, 글 수정
			if ((post.getId()) != 0) {
				writeRepository.updateAll(post, userId);

				return ResponseEntity.status(HttpStatus.OK).body(true);
			}
			writeRepository.insertWrite(post, userId);		// 새로 글 등록

			return ResponseEntity.status(HttpStatus.OK).body(true);
		} catch (RuntimeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.toString());
		}
	}

	/**
	 * 글 삭제
	 *
	 * @param writeId 삭제할 글의 ID를 나타내는 문자열
	 */
	@PostMapping("/delete/write")
	public ResponseEntity<?> deleteWrite(@RequestBody String writeId) {
		try {
			writeRepository.deleteWriteByIdwriteId.replaceAll("\"", "")

			return ResponseEntity.status(HttpStatus.OK).body(true);
		} catch (RuntimeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.toString());
		}
	}


	/**
	 * 댓글 추가
	 *	- 관리자일 경우에만 추가 가능
	 * @param comment 추가할 댓글 정보를 담은 CommentRequestDto 객체
	 */
	@PostMapping("/add/comments")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> addComments(@RequestBody CommentRequestDto comment) {
		try {
			commentsRepository.insertComment(comment);

			return ResponseEntity.status(HttpStatus.OK).body(true);
		} catch (RuntimeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.toString());
		}
	}

	/**
	 * 댓글 삭제
	 *
	 * @param commentId 삭제할 댓글의 ID를 나타내는 문자열
	 */
	@PostMapping("/delete/comments")
	public ResponseEntity<?> deleteComments(@RequestBody String commentId) {
		try {
			commentsRepository.deleteCommentById(commentId.replaceAll("\"", ""));

			return ResponseEntity.status(HttpStatus.OK).body(true);
		} catch (RuntimeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.toString());
		}
	}

}
