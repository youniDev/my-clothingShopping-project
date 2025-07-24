import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Form,
  Nav,
  Navbar,
} from "react-bootstrap";

import {
  getProductList,
  updateDeliveryStatusForAvailable,
  updateDeliveryStatusForUnavailable,
  deleteProduct,
  getProductImage,
} from "../../../api/ProductApi";
import {
  saveDecodeBase64ToImages,
  setImagesFromJson,
} from "../../../assets/js/ImageManager";
import { PRODUCT, ERROR } from "../../../assets/js/Constants";
import {
  sortByNumberOrderByASC,
  sortByNumberOrderByDESC,
  sortByStringOrderByASC,
} from "../../../assets/js/sortBySelectOption";

/**
 * 제품 관리 기능 1. 수정 2. 오늘배송상품 등록
 * @param {function} props.onRegistrationComplete - 제품 수정이 완료될 때 호출되는 콜백 함수
 * @param {string} props.id - 사용자가 선택한 제품 고유 식별자 // 지워도 될 듯?
 *
 * @returns {JSX.Element} - TotalProductControl 컴포넌트의 JSX 요소
 */
const TotalProductControl = ({ onRegistrationComplete, productDetail }) => {
  const [products, setProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    mainCategory: "All",
    subCategory: "",
  });

  useEffect(() => {
    showProductList(); // product list 불러오기
  }, []);

  // 제품 정보 불러오기
  const showProductList = async () => {
    getProductList()
      .then((product) => {
        console.log("received product info", product);
        setProducts(product);
      })
      .catch((error) => {
        console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error);
        alert(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_KR]);
      });
  };

  // 체크박스 개별
  const handleCheckboxChange = (productId) => {
    setSelectedProductIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(productId)) {
        return prevSelectedIds.filter((id) => id !== productId); // check 해제될 경우 setSelectedPRoductIds에서 삭제
      }
      return [...prevSelectedIds, productId]; // check 될 경우 setSelectedPRoductIds에 추가
    });
  };
  // 전체 선택 or 해제 체크박스
  const handleToggleSelectAll = () => {
    const isAllSelected =
      selectedProductIds.length === products.length &&
      selectedProductIds.every((id) =>
        products.some((product) => product.id === id),
      ); // 현재 선택된 제품 ID 배열과 모든 제품의 ID 배열이 동일한지 확인
    setSelectedProductIds(
      isAllSelected ? [] : products.map((product) => product.id),
    ); // 동일하다면 모두 선택 해제, 그렇지 않으면 모두 선택
  };

  // 상품 삭제 기능
  const handleDeleteSelected = () => {
    deleteProduct({ selectedProductIds })
      .then((res) => {
        if (res) showProductList();
      })
      .catch((error) => {
        console.log("Falied Delete product ", error);
      });
  };

  const handleDeliveryStatusForSameDay = async () => {
    // 선택된 제품들 중에 '오늘배송 상품'으로 등록되어 있는지 확인
    const hasSameDayProducts = selectedProductIds.some(
      (productId) =>
        products.find((product) => product.id === productId)
          ?.delivery_availability === "1",
    );

    // '오늘배송 상품'이 있다면 해당 제품들을 selectedProductIds에서 제거
    if (hasSameDayProducts) {
      alert("선택된 제품 중 오늘배송 상품이 있습니다.");
      setSelectedProductIds((prevSelectedIds) => {
        return prevSelectedIds.filter((productId) => {
          const isSameDayProduct =
            products.find((product) => product.id === productId)
              ?.delivery_availability === "1"; // delivery_availability === '1'인 제품만 제외
          return !isSameDayProduct;
        });
      });
      return;
    }

    updateDeliveryStatusForAvailable({ selectedProductIds })
      .then((res) => {
        alert("오늘 배송 상품 등록 완료");
        showProductList();
        console.log("SUCCESS, UPDATE DELIVERY STATUS", res);
      })
      .catch((error) => {
        console.log("FAIL, UPDATE DELIVIRY_STATUS", error);
      });
  };

  const handleDeliveryStatusUnavliableForSameDay = async () => {
    // 선택된 제품들 중에 '오늘배송 상품'으로 등록되어 있는지 확인
    const hasSameDayProducts = selectedProductIds.some(
      (productId) =>
        products.find((product) => product.id === productId)
          ?.delivery_availability === "0",
    );

    // '오늘배송 상품'이 있다면 해당 제품들을 selectedProductIds에서 제거
    if (hasSameDayProducts) {
      alert("선택된 제품 중 오늘배송 상품이 있습니다.");
      setSelectedProductIds((prevSelectedIds) => {
        return prevSelectedIds.filter((productId) => {
          const isSameDayProduct =
            products.find((product) => product.id === productId)
              ?.delivery_availability === "0"; // delivery_availability === '1'인 제품만 제외
          return !isSameDayProduct;
        });
      });
      return;
    }

    updateDeliveryStatusForUnavailable({ selectedProductIds })
      .then((res) => {
        alert("오늘 배송 상품 등록을 취소 완료");
        showProductList();
        console.log("SUCCESS, UPDATE DELIVERY STATUS", res);
      })
      .catch((error) => {
        console.log("FAIL, UPDATE DELIVIRY_STATUS", error);
      });
  };

  /*
    const handleEditProduct = (product) => {
        let decodedImages = [];

        if (product.image) {
            decodedImages = saveDecodeBase64ToImages(product.image);
        }
        
        // 새로운 객체를 만들어서 기존 속성들을 복사하고 imagePreview 속성을 추가
        const updatedProduct = {
            ...product,
            previewImage: decodedImages
        };

        sendProductToEditProduct(updatedProduct);
    };
    */

  const handleEditProduct = async (product) => {
    // 이미지 불러오기
    const images = await fetchImageByProductId(product.id);

    console.log("image path", images);
    // 새로운 객체를 만들어서 기존 속성들을 복사하고 imagePreview 속성을 추가
    const updatedProduct = {
      ...product,
      previewImage: images,
      recievedImages: images,
    };

    sendProductToEditProduct(updatedProduct);
  };

  const fetchImageByProductId = async (id) => {
    const images = await getProductImage({ id });

    return images;
  };

  const decodeImages = (images) => {
    let decodedImages = [];

    if (images) {
      decodedImages = saveDecodeBase64ToImages(images);
    }

    return decodedImages;
  };

  /**
   *
   * @param {object} data - 세부 수정을 위해 선택된 데이터의 정보
   */
  const sendProductToEditProduct = (data) => {
    onRegistrationComplete(PRODUCT.EDIT_PRODUCT_TAB_INDEX);
    productDetail(data);
  };

  // 제품 등록 클릭 시, 제품 등록 tab으로 이동
  const handleAddProduct = () => {
    onRegistrationComplete(PRODUCT.ADD_PRODUCT_TAP_INDEX);
  };

  // Function to filter products based on selected category
  const getFilteredProducts = () => {
    if (selectedCategory.mainCategory === "All") {
      return products;
    }

    // 2. main 과 sub 카테고리 둘 다 선택된 경우
    if (selectedCategory.subCategory) {
      return products.filter(
        (product) => product.category === selectedCategory.subCategory,
      );
    }

    // 1. main 카테고리만 선택된 경우
    // 1-1. category item으로부터 title을 찾아야됨
    return products.filter(
      (product) =>
        PRODUCT.CATEGORY.find(
          (cat) => cat.items && cat.items.includes(product.category),
        ).id === selectedCategory.mainCategory,
    );
  };

  const handleCategoryChange = (e) => {
    const main = e.target.value;

    setSelectedCategory((prevProduct) => ({
      ...prevProduct,
      mainCategory: main,
      subCategory: "",
    }));
  };

  // 숫자 내림차순 정렬
  const sortIntegerOrderByDESC = (e) => {
    const sortedProducts = sortByNumberOrderByDESC(
      [...products],
      e.target.name,
    );

    setProducts(sortedProducts);
  };
  // 숫자 오름차순 정렬
  const sortInteger = (e) => {
    const sortedProducts = sortByNumberOrderByASC([...products], e.target.name);

    setProducts(sortedProducts);
  };
  const sortString = (e) => {
    const sortedProducts = sortByStringOrderByASC([...products], e.target.name);

    setProducts(sortedProducts);
  };

  return (
    <Container fluid className="p-4" style={{ marginTop: "-5rem" }}>
      {/* 상단 버튼 */}
      <Row className="justify-content-end mb-3">
        <Col xs="auto" className="d-flex gap-2">
          <Button variant="secondary" onClick={handleAddProduct}>
            상품 등록
          </Button>
          <Button
            variant="secondary"
            onClick={handleDeliveryStatusForSameDay}
            disabled={!selectedProductIds.length}
          >
            오늘배송 등록
          </Button>
          <Button
            variant="secondary"
            onClick={handleDeliveryStatusUnavliableForSameDay}
            disabled={!selectedProductIds.length}
          >
            오늘배송 취소
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteSelected}
            disabled={!selectedProductIds.length}
          >
            삭제
          </Button>
        </Col>
      </Row>

      {/* 필터 */}
      <Row className="align-items-center mb-3 g-2">
        <Col xs="auto">
          <strong>카테고리:</strong>
        </Col>
        <Col xs="auto">
          <Form.Select
            value={selectedCategory.mainCategory}
            onChange={handleCategoryChange}
          >
            <option value="All">전체</option>
            {PRODUCT.CATEGORY.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xs="auto">
          <Form.Select
            value={selectedCategory.subCategory}
            onChange={(e) =>
              setSelectedCategory((prev) => ({
                ...prev,
                subCategory: e.target.value,
              }))
            }
          >
            <option value="">소분류 선택</option>
            {PRODUCT.CATEGORY.find(
              (cat) => cat.id === selectedCategory.mainCategory,
            )?.items.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* 정렬 네비게이션 */}
      <Row className="justify-content-end mb-2">
        <Col xs="auto">
          <Nav variant="pills">
            <Nav.Item>
              <Nav.Link name="createDate" onClick={sortIntegerOrderByDESC}>
                신상품
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link name="name" onClick={sortString}>
                상품명
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link name="cost" onClick={sortInteger}>
                ↓ 원가
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link name="cost" onClick={sortIntegerOrderByDESC}>
                ↑ 원가
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link name="price" onClick={sortInteger}>
                ↓ 판매가
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link name="price" onClick={sortIntegerOrderByDESC}>
                ↑ 판매가
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                name="purchaseQuantity"
                onClick={sortIntegerOrderByDESC}
              >
                인기
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link name="review">사용후기</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>

      {/* 테이블 */}
      <Table striped bordered hover responsive>
        <thead className="table-dark text-center align-middle">
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleToggleSelectAll}
                checked={selectedProductIds.length === products.length}
              />
            </th>
            {PRODUCT.TABLE_HEADERS.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getFilteredProducts().map((product) => (
            <tr key={product.id}>
              <td className="text-center">
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(product.id)}
                  checked={selectedProductIds.includes(product.id)}
                />
              </td>
              <td className="text-center">{product.id}</td>
              <td
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: "blue",
                }}
                onClick={() => handleEditProduct(product)}
              >
                {product.name}
              </td>
              <td>{product.description}</td>
              <td className="text-center">{product.cost}</td>
              <td className="text-center">{product.price}</td>
              <td className="text-center">{product.quantity}</td>
              <td className="text-center">{product.category}</td>
              <td className="text-center">{product.purchaseQuantity}</td>
              <td className="text-center">
                {product.delivery_availability === "1" ? "O" : "X"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TotalProductControl;
