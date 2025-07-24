import React, { useEffect, useState } from "react";
import { Button, Modal, Col, Row, Form } from "react-bootstrap";
import StarRatings from "react-star-ratings";

import {
  handleImageClick,
  handleMoveImage,
  handleSubImageChange,
  saveDragStartIndex,
} from "../../assets/js/ProductAdditionFunctions";
import { addProductReview } from "../../api/UserAPI";
import { ERROR, SUCCESS } from "../../assets/js/Constants";
import { addImageByProductId } from "../../api/ProductApi";

const AddReview = ({ userId, product, orderId, onReviewSubmit }) => {
  const [isModalOpen, setModalOpen] = useState();
  const [selectedProduct, setSelectedProduct] = useState({
    ...product,
    image: [],
    rating: 0, // 별점
  });

  // 리뷰 작성 모달 닫기
  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct({});
    onReviewSubmit(); // 리뷰 등록 후 리랜더링
  };

  /**
   * 구매한 제품 리뷰 등록
   * @returns
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productReview = await handleImage();
      const isComplete = await addProductReview(userId, orderId, productReview);

      if (isComplete) {
        alert(SUCCESS.INSERT_REVIEW);
        closeModal();
        return;
      }
    } catch (error) {
      alert(ERROR.FAIL_INSERT_REVIEW[ERROR.TEXT_KR]);
      console.error(ERROR.FAIL_INSERT_REVIEW[ERROR.TEXT_EN], error);
    }
  };

  // 이미지 서버에 저장 후 이름 반환
  const handleImage = async () => {
    try {
      const image = new FormData();

      // 이미지 배열 추가
      selectedProduct.image.forEach((path) => {
        image.append("files", path); // 파일 객체인 경우 files로 추가
      });

      const images = await addImageByProductId(image);

      const updateProduct = {
        ...selectedProduct,
        image: images,
      };

      return updateProduct;
    } catch (error) {
      console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error);
      alert(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_KR]);
    }
  };

  // 리뷰 등록 창
  const handleReviewClick = () => {
    setModalOpen(true);
  };

  // 이미지 등록 관리
  const handleImageChange = (e) => {
    // 기존 이미지가 있을 경우
    if (selectedProduct.image) {
      const updatedImages = handleSubImageChange(
        e.target.files,
        selectedProduct.image,
      );
      setSelectedProduct((prev) => ({ ...prev, image: updatedImages }));

      return;
    }
    setSelectedProduct((prev) => ({ ...prev, image: e.target.files })); // 처음 이미지를 등록할 경우
  };
  /**
   * 이미지 클릭 시, 삭제 기능
   * @param {number} index 변경하고자 하는 값의 index
   */
  const deleteImage = (index) => {
    const updatedImages = handleImageClick(index, selectedProduct.image);

    setSelectedProduct((prev) => ({ ...prev, image: updatedImages }));
  };

  /**
   * drag drop을 통해 이미지 위치 이동
   * @param {*} e
   * @param {number} i - drag 한 이미지를 놓을 위치의 인덱스
   */
  const onDragDrop = (e, i) => {
    e.preventDefault();
    const updateImages = [...selectedProduct.image];

    handleMoveImage(
      Number(e.dataTransfer.getData("imgIndex")),
      i,
      updateImages,
    );

    setSelectedProduct((prev) => ({ ...prev, image: updateImages }));
  };
  const onDragOver = (e) => {
    e.preventDefault();
  };

  // 별점 추가
  const changeRating = (newRating) => {
    setSelectedProduct({ ...selectedProduct, rating: newRating });
  };

  // 리뷰 글 작성
  const handleReview = (review) => {
    setSelectedProduct({ ...selectedProduct, review: review });
  };

  return (
    <>
      <Button
        type="button"
        variant="primary"
        className="btn"
        onClick={handleReviewClick}
      >
        리뷰작성
      </Button>
      <Modal show={isModalOpen} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>리뷰 작성</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>제품명: {product.name}</p>
            <p>구매자: {userId}</p>
            {/* 이미지 등록 */}
            <Form.Group className="mb-3" as={Row}>
              <Col sm={5}>
                <Form.Control
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </Col>
            </Form.Group>
            {/* 이미지 보이기 */}
            <Row>
              <Col sm={2} />
              <Col sm={10}>
                {selectedProduct.image &&
                  selectedProduct.image.map((image, index) => (
                    <div
                      type="button"
                      key={index}
                      className="uploaded-image-container"
                      style={{
                        display: "inline-block",
                        margin: "10px",
                        backgroundColor: index === 0 ? "#ffcccb" : "#f0f0f0",
                      }}
                      onClick={() => deleteImage(index)}
                      onDragOver={onDragOver}
                      onDrop={(e) => onDragDrop(e, index)}
                    >
                      <img
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt={`Uploaded Image ${index + 1}`}
                        className="uploaded-image"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "contain",
                          cursor: "pointer",
                        }}
                        draggable
                        onDragStart={(e) =>
                          saveDragStartIndex(e.dataTransfer, index)
                        }
                        onDragOver={onDragOver}
                        onDrop={(e) => onDragDrop(e, index)}
                      />
                    </div>
                  ))}
              </Col>
            </Row>
            {/* 리뷰 작성 */}
            <Form.Group className="mb-3" as={Row}>
              <Form.Label>[리뷰]</Form.Label>
              <Col sm={12}>
                <Form.Control
                  as="textarea"
                  rows={20}
                  value={selectedProduct.review}
                  onChange={(e) => handleReview(e.target.value)}
                />
              </Col>
            </Form.Group>
            {/* 평점 */}
            <Form.Group className="mb-3" as={Row}>
              <Form.Label>평점</Form.Label>
              <Col sm={12}>
                <StarRatings
                  rating={selectedProduct.rating}
                  starRatedColor="blue"
                  changeRating={changeRating}
                  numberOfStars={5}
                  name="rating"
                />
              </Col>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              취소
            </Button>
            <Button type="submit" variant="primary">
              작성
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddReview;
