# 쇼핑몰 프로젝트
> **Spring Boot + React 기반 의류 쇼핑몰 웹 애플리케이션**

### 기술 스택
- **Frontend**: React, Axios
- **Backend**: Spring Boot, Spring Security, JWT, OAuth 2.0
- **Database**: MySQL
- **API 통신**: REST API
  
### 주요 기능

#### 사용자
- **소셜 로그인**: JWT 기반 OAuth 로그인 (Google, Kakao, Naver)
- **제품 조회**
  - 카테고리 별, 정렬 옵션(상품명, 인기순, 판매순, 신상품, 가격순)
- **위시 리스트**
  - 제품 찜/해제
- **장바구니 및 구매**
  - 장바구니 등록 / 삭제
  - 리뷰 작성
- **마이페이지**
  - 회원 정보 조회 및 수정
  - 위시 리스트 확인
  - 구매 정보 조회
  - 리뷰 작성
    
#### 관리자
- **제품 관리**
  - 제품 등록 / 수정 / 삭제
  - 오늘의 배송 상품 설정
- **게시판 댓글 작성** (관리자만 가능)
  
#### 게시판
- 글 작성
  - 공지사항 (관리자 전용)
  - 사용자 게시글 작성 가능
- 댓글 (관리자만 작성 가능)
  
  ### ERD

- MYSQL ERD 파일<img width="1449" height="866" alt="image" src="https://github.com/user-attachments/assets/94be3f33-f8b2-4f1e-ad33-07497732addb" />

  
