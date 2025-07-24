import axios from "axios";

export const ProductApi = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export const ImageApi = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const blobApi = axios.create({
  baseURL: "http://localhost:8080",
  responseType: "blob",
});

/**
 * 제품 등록
 * @param {object} formData - 제품 정보를 포함하는 FormData 객체
 * @returns
 */
export const addProduct = async ({ formData }) => {
  const response = await ProductApi.post(`/api/addProduct`, formData);
  return response.data;
};

/**
 * 이미지 등록
 */
export const addImage = async (formData) => {
  const response = await ImageApi.post(`/api/addImagesByProductId`, formData);

  return response.data;
};

/**
 * 이미지 등록
 */
export const addImageByProductId = async (formData) => {
  const response = await ImageApi.post(`/api/addImages/ProductId`, formData);

  return response.data;
};

/**
 * 제품 상세 정보 수정
 * @param {object} product - 업데이트할 제품 정보를 담은 객체
 * @returns
 */
export const updateProduct = async ({ product }) => {
  const response = await ProductApi.post(`/api/updateProduct`, product);

  return response.data;
};

/**
 * 모든 제품 목록 조회
 * @returns - 제품 목록을 담은 객체
 */
export const getProductList = async () => {
  const response = await ProductApi.get(`/api/showProduct/admin`);

  return response.data;
};

/**
 * 특정 제품 이미지 조회
 * @param {string} id - 제품 ID를 담은 객체
 * @returns  - 제품 이미지를 담은 객체
 */
export const getProductImage = async ({ id }) => {
  const response = await ProductApi.post(`/api/showProduct/detail/admin`, {
    id: id,
  });

  return response.data;
};

/**
 * 이미지 blob로 변경
 * @param {} src
 * @returns
 */
export const fetchImageByFileName = async (src) => {
  const response = await ProductApi.get(`/api/image?image=${src}`);

  return response.data;
};

/**
 * 20240930 카테고리별 제품 목록 조회 중, 이미지 이름 말고 서버에서 직접 경로를 받음
 */
export const getFileByCategory = async ({ category }) => {
  const response = await ProductApi.post("/api/showProduct/category", category);

  return response.data;
};

/**
 * 카테고리 별 베스트 아이템 추적
 *
 */
export const getBestProductByCategory = async ({ category }) => {
  const response = await ProductApi.get("/api/best/category", {
    params: {
      category: category,
    },
  });

  return response.data;
};

/**
 *
 * 20241029 페이지네이션 최적화 중
 */
export const getProductByPagination = async ({
  category,
  cursor,
  totalPage,
}) => {
  const response = await ProductApi.get("/api/showProduct/category/page", {
    params: {
      category: category, // 'category' 요청 파라미터
      cursor: cursor, // 'cursor' 요청 파라미터
      totalPage: totalPage,
    },
  });

  return response.data;
};

/**
 * 특정 제품 정보 조회
 * @param {string} id - 제품 ID를 담은 객체
 * @returns - 제품 정보를 담은 객체
 */
export const getProductInfo = async ({ id }) => {
  const response = await ProductApi.post(`/api/showProductDetail/admin`, id);

  return response.data;
};

/**
 * 선택된 제품 삭제
 * @param {string[]} selectedProductIds - 삭제할 제품들의 ID를 담은 배열
 * @returns
 */
export const deleteProduct = async ({ selectedProductIds }) => {
  const response = await ProductApi.post(
    `/api/deleteProduct`,
    selectedProductIds
  );

  return response.data;
};

/**
 * 오늘배송 상품으로 등록
 * @param {string[]} selectedProductIds - 오늘 배송 상품으로 등록할 제품들의 ID를 담은 배열
 * @returns
 */
export const updateDeliveryStatusForAvailable = async ({
  selectedProductIds,
}) => {
  const response = await ProductApi.post(
    `/api/updateDeliveryStatus/true`,
    selectedProductIds
  );

  return response.data;
};

/**
 * 오늘 배송 상품 등록 취소
 * @param {string[]} selectedProductIds - 오늘 배송 상품 등록을 취소할 제품들의 ID를 담은 배열
 * @returns
 */
export const updateDeliveryStatusForUnavailable = async ({
  selectedProductIds,
}) => {
  const response = await ProductApi.post(
    `/api/updateDeliveryStatus/false`,
    selectedProductIds
  );

  return response.data;
};

/**
 * 판매량 순으로 제품 정렬
 * @param {object} product - 정렬할 제품 정보를 담은 객체
 * @returns - 정렬된 결과를 담은 객체
 */
export const sortProductByBest = async ({ product }) => {
  const response = await ProductApi.post(`/api/sort/product/quantity`, product);

  return response.data;
};

/**
 * 카테고리별로 베스트 제품 조회
 * @param {string} category - 조회할 제품의 카테고리
 * @returns - 카테고리별 베스트 제품을 담은 객체
 */
export const getBestItemByCategory = async (category) => {
  const response = await ProductApi.post(`/api/bestItem/cateory`, category);

  return response.data;
};

/**
 * 메인 페이지에 표시할 제품 정보 조회
 * @returns - 메인 페이지에 표시할 베스트 제품과 신제품 정보를 담은 객체
 */
export const getProductForMain = async () => {
  const response = await ProductApi.get(`/api/product/main`);

  return response.data;
};

/**
 * 제품 ID에 해당하는 리뷰 조회
 * @param {string} productId - 제품 ID
 * @returns - 제품의 리뷰 정보를 담은 객체
 */
export const fetchReviewByProductId = async (productId) => {
  const response = await ProductApi.post(
    `/api/fetch/review/productId`,
    productId
  );

  return response.data;
};

/**
 * 제품 세부 페이지에서 제품 이미지 불러오기
 * @param {string} productId - 제품 ID
 * @returns
 */
export const fetchDetailImagesByProductId = async (productId) => {
  const response = await ProductApi.post(
    "/api/fetch/product/image/productId",
    productId
  );

  return response.data;
};

//  * 이미지 인코딩 & 디코딩 관련 함수
// 이미지 파일을 Base64 문자열로 인코딩하는 함수
export const encodeImagesToBase64 = async (imageFiles) => {
  const encodedImages = [];

  for (const imageFile of imageFiles) {
    if (imageFile === "Nothing") {
      encodedImages.push(encodeURIComponent(imageFile));
    } else {
      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      encodedImages.push(base64String);
    }
  }

  return encodedImages.join(","); // 이미지들을 문자열로 결합하여 반환
};

// 이미지 주소 변환
/*
export const convertAllImagesAddress = async (imagesJson) => {
  const stringImages = await Promise.all(imagesJson.map((images) => convertImages(images)));

  return stringImages;
}
export const convertImages = (image) => {
  const cleanedImageString = image
  .replace(/[\[\]"]/g, '') // 대괄호와 따옴표 제거
  
  return cleanedImageString.split(',').map(img => img.trim());
}
export const decodedAllImages = async (images) => {
  const decodedImages = await Promise.all(images.map((address) => decodeImagesAddress(address)));

  // 컴포넌트 언마운트 시 URL 해제
  decodedImages.forEach((imageUrl) => URL.revokeObjectURL(imageUrl));

  return decodedImages;
}
export const decodeImagesAddress = async (image) => {
  try {
      const decodedImages = await Promise.all(image.map(async (adress) => {
      const data = await fetchImageByFileName(adress);

      const imageBase64 = data.image;
      const imagePath = data.imagePath;

      // Base64 문자열을 Blob으로 변환
      const byteCharacters = atob(imageBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' }); // MIME 타입을 지정
      // Blob을 파일로 변환
      const file = new File([blob], imagePath, { type: 'image/jpeg' });

      return file;
    }));

    return decodedImages;

  } catch (error) {
    console.error("20240930 changed image pass error", error);
  }
}
*/

// 이미지 디코딩
export const decodeAllImages = async (base64Images) => {
  const decodedImages = await Promise.all(
    base64Images.map((base64Image) => decodeBase64ToImages(base64Image))
  );

  // 컴포넌트 언마운트 시 URL 해제
  decodedImages.forEach((imageUrl) => URL.revokeObjectURL(imageUrl));

  return decodedImages; // 이미지 URL 배열을 반환
};
// Base64 문자열을 이미지로 디코딩하는 함수
export const decodeBase64ToImages = (encodedImages) => {
  const base64Array = encodedImages.split(",");

  const decodedImages = base64Array.map((base64String) => {
    if (base64String === "Nothing") {
      return base64String;
    }
    const binaryString = atob(base64String);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: "image/jpeg" });
  });

  return decodedImages;
};
