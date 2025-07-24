import { PRODUCT } from "./Constants";
import {
  validateNotNull,
  changeSubImageToMainImage,
  saveImages,
  deleteImage,
  changeImageOrder,
  saveEncodeImageToBase64,
} from "./ImageManager";

// 폼의 input값 저장
export const handleChange = (value, field, setProduct) => {
  setProduct((prevProduct) => ({ ...prevProduct, [field]: value }));
};

/**
 *
 * @param {*} selectedCategory
 * @param {*} setProduct
 */
export const handleCategoryChange = (selectedCategory, setProduct) => {
  setProduct((prevProduct) => ({
    ...prevProduct,
    mainCategory: selectedCategory,
  }));

  setProduct((prevProduct) => ({
    ...prevProduct,
    subCategory:
      PRODUCT.CATEGORY.find((category) => category.id === selectedCategory)
        ?.items[0] || "",
  }));
};

export const handleItemChange = (selectedSubCategory, setProduct) => {
  setProduct((prevProduct) => ({
    ...prevProduct,
    subCategory: selectedSubCategory,
  }));
};

// price amount 추가
export const handleAddAmount = (amount, target, setProduct) => {
  setProduct((prevProduct) => ({
    ...prevProduct,
    [target]: Number(prevProduct[target]) + Number(amount),
  }));
};

/**
 *  drag 시작 위치 저장
 * @param {*} move
 * @param {number} id - drag 시작하는 이미지의 index
 */
export const saveDragStartIndex = (move, id) => {
  move.effectAllowed = "move";
  move.setData("imgIndex", String(id));
};

/**
 * drag-drop시, 이미지 위치 변경
 * @param {number} start - drag 시작 위치
 * @param {number} target - drop 위치
 * @param {array} images - 기존 이미지 배열
 * @returns 변경된 이미지 배열
 */
export const handleMoveImage = (start, target, images) => {
  if (start === target) return; // 제자리면 return

  return changeImageOrder(start, target, images);
};

/**
 *
 * @param {files} selectedMainImage - 사용자가 대표이미지로 등록하고자 하는 이미지
 * @param {Array} images - 기존 이미지 배열
 * @returns {Array} - 변경된 이미지 배열
 */
export const handleMainImageChange = (selectedMainImage, images) => {
  validateNotNull(selectedMainImage); // 클릭만 하고 등록 안한 경우

  return changeSubImageToMainImage(selectedMainImage, images);
};

/**
 * 사용자가 선택한 이미지 배열에 저장
 * @param {files} selectedSubImages
 * @param {Array} images
 * @returns {Array} - 변경된 이미지 배열
 */
export const handleSubImageChange = (selectedSubImages, images) => {
  validateNotNull(selectedSubImages); // 클릭만 하고 등록 안한 경우

  return saveImages(selectedSubImages, images);
};

/**
 * 이미지 클릭 이벤트 핸들러
 * @param {number} index - 클릭된 이미지의 인덱스
 * @param {Array} images - 이미지 배열
 * @returns {Array} 변경된 이미지 배열 (삭제 또는 변경을 선택한 경우)
 */
export const handleImageClick = (index, images) => {
  const userChoice = window.confirm("이미지를 삭제하시겠습니까?");

  if (userChoice) {
    return deleteImage(index, images);
  }

  return images; // 사용자가 취소한 경우 이미지 배열 그대로 반환
};

/**
 * 여러 이미지를 Base64로 인코딩하여 배열에 저장하는 함수
 * @param {files} images
 * @returns
 */
export const handleEncodeImage = async (images) => {
  return await saveEncodeImageToBase64(images);
};
