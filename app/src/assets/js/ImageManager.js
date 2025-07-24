/**
 * 대표 이미지를 선택된 이미지로 변경하는 함수
 * @param {number} selectedSubImage - 사용자가 대표 이미지로 설정하고자 하는 이미지 객체
 * @param {Array} images - 기존 이미지 배열
 * @returns {Array} 변경된 이미지 배열
 */
export const changeSubImageToMainImage = (selectedSubImageIndex, images) => {
  const MAIN_INDEX = 0;

  [images[selectedSubImageIndex], images[MAIN_INDEX]] = [
    images[MAIN_INDEX],
    images[selectedSubImageIndex],
  ];

  return images;
};

export const changeImageOrder = (startIndex, endIndex, images) => {
  [images[startIndex], images[endIndex]] = [
    images[endIndex],
    images[startIndex],
  ];

  return images;
};

/**
 * JSON 형식의 데이터를 JavaScript 객체로 파싱하고 String 배열로 변환
 * @param {*} jsonImages
 * @returns {Array} - Json 데이터를 String 배열로 변환
 */
export const setImagesFromJson = (jsonImages) => {
  // JSON을 파싱하여 JavaScript 배열로 변환
  const jsonArray = JSON.parse(jsonImages);

  // JavaScript 배열에서 각 요소를 문자열로 변환하여 새로운 String
  return jsonArray.map((image) => String(image));
};

/**
 * 등록하고자 하는 이미지를 저장하는 함수
 * @param {files} selectedImages - 사용자가 등록하고자 하는 이미지 객체
 * @param {Array} images - 기존 이미지 배열
 * @returns {Array} - 변경된 이미지 배열
 */
export const saveImages = (selectedImages, images) => {
  const updatedImages = [...images];

  for (const selectedImage of selectedImages) {
    updatedImages.push(selectedImage);
  }

  return updatedImages;
};

/**
 * 이미지 제거 함수
 * @param {int} index - 제거하고자 하는 값의 인덱스
 * @param {Array} images - 기존 이미지 배열
 * @returns 변경된 이미지 배열
 * .. 왜 바로 return updatedImages.splice(index, 1) 하면 왜 안돼지? 이렇게 하면 1번 지워지는게 아니라 2번 지워짐
 */
export const deleteImage = (index, images) => {
  const updatedImages = images.slice();
  updatedImages.splice(index, 1);

  return updatedImages;
};

/**
 * 이미지를 Base64 문자열로 인코딩하는 함수
 * @param {files} image - 인코딩할 이미지 파일
 * @returns {Promise<string>} 이미지의 Base64 문자열
 */
const encodeImageToBase64 = async (image) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(image);
  });
};

/**
 * 여러 이미지를 Base64로 인코딩하여 배열에 저장하는 함수
 * @param {Array} images - 인코딩할 이미지 배열
 * @returns {Promise<string>} 이미지의 Base64 문자열을 ','로 구분하여 결합한 문자열
 */
export const saveEncodeImageToBase64 = async (images) => {
  const encodedImages = [];

  for (const image of images) {
    const base64String = await encodeImageToBase64(image);
    encodedImages.push(base64String);
  }

  return encodedImages.join(",");
};

/**
 * Base64 문자열을 비동기적으로 이미지로 디코딩하여 배열에 저장하는 함수
 * @param {Array} base64Images - 디코딩할 Base64 문자열들의 배열
 * @returns {Promise<Array>} 디코딩된 이미지 Blob들의 배열
 */
export const decodeAllImages = async (base64Images) => {
  const decodedImages = await Promise.all(
    base64Images.map((base64Image) => decodeBase64ToImage(base64Image)),
  );

  decodedImages.forEach((imageUrl) => URL.revokeObjectURL(imageUrl)); // 컴포넌트 언마운트 시 URL 해제

  return decodedImages;
};

/**
 * Base64 문자열을 이미지로 디코딩하는 함수
 * @param {string} base64String - 디코딩할 Base64 문자열
 * @returns {Blob} 디코딩된 이미지 Blob
 */
export const decodeBase64ToImage = (base64String) => {
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes], { type: "image/jpeg" });
};

/**
 * 여러 Base64 문자열을 이미지로 디코딩하여 배열에 저장하는 함수
 * @param {string} encodedImages - 디코딩할 Base64 문자열을 ','로 구분하여 결합한 문자열
 * @returns {Array} 디코딩된 이미지 Blob들의 배열
 */
export const saveDecodeBase64ToImages = (encodedImages) => {
  const base64Array = encodedImages.split(",");

  const decodedImages = base64Array.map((base64String) => {
    return decodeBase64ToImage(base64String);
  });

  return decodedImages;
};

/**
 * 파라미터가 NULL일 경우 예외처리를 위한 함수
 * @param {object} value - 검사하고자 하는 값
 */
export const validateNotNull = (value) => {
  try {
    if (isNull(value)) {
      throw new Error("The value is null");
    }
  } catch (error) {
    console.error("An error occurred", error.message);
  }
};

const isNull = (target) => {
  if (target === null) return true;

  return false;
};
