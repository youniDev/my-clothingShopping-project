import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Form,
  Tabs,
  Tab,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Slider from "react-slick";

import {
  ERROR,
  NOTION,
  PRODUCT,
  PURCHASE,
  SUCCESS,
  PRODUCT_DETAIL_SETTING,
  LOGIN,
} from "../../../assets/js/Constants";
import { addToCart } from "../../../api/PurchaseApi";

import Header from "../../../component/layout/Header";
import Footer from "../../../component/layout/Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons"; // 빈 하트 아이콘
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons"; // 꽉 찬 하트 아이콘

import {
  addWishListByUserId,
  deleteWishListByUserId,
} from "../../../api/UserAPI";
import { fetchDetailImagesByProductId } from "../../../api/ProductApi";

import ShowReview from "../../../component/layout/ShowReview";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../assets/css/productDetail.css";
import "../../../assets/css/customSlick.css";

function ProductDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state && location.state.data;
  const ACCESS_TOKEN = localStorage.getItem(LOGIN.ACCESS_TOKEN);
  const [showProductInfo, setShowProductInfo] = useState({
    images: product.images,
    quantity: PRODUCT.PURCHASE_QUANTITY,
    totalCost: product.price,
  });
  const [isWish, setIsWish] = useState(false);

  useEffect(() => {
    initDetailImages();
  }, []);

  // 해당 제품의 이미지들 불러오기
  const initDetailImages = async () => {
    const data = await fetchDetailImagesByProductId(product.id);

    setShowProductInfo((prev) => ({
      ...prev,
      images: data.images,
    }));
  };

  // 구매 수량 수정
  const handleIncreaseQuantity = () => {
    const updateQuantity = Number(showProductInfo.quantity) + Number(1);

    setShowProductInfo((prev) => ({
      ...prev,
      quantity: updateQuantity,
      totalCost: product.price * updateQuantity,
    }));
  };
  const handleDecreaseQuantity = () => {
    const updateQuantity = Number(showProductInfo.quantity) - Number(1);

    // 구매 수량이 2 이상일 때
    if (showProductInfo.quantity > 1) {
      setShowProductInfo((prev) => ({
        ...prev,
        quantity: updateQuantity,
        totalCost: product.price * updateQuantity,
      }));
    }
  };

  /**
   * 이동
   */
  const goToSignup = () => {
    navigate("/signin");
  };
  const goToCart = (data) => {
    navigate("/mypage", { state: { userId: data, currentTab: PURCHASE.CART } });
  };
  const goToOrder = () => {
    navigate(`/purchase`, {
      state: {
        selectedProducts: updatePurchaseOrder(),
        totalCost: showProductInfo.totalCost,
      },
    });
  };

  // 회원 여부 판별
  const isNotMemberShip = () => {
    if (!ACCESS_TOKEN) {
      // 가입 권유 선택창
      if (window.confirm(NOTION.JOIN_MEMBERSHIP)) {
        goToSignup(); // 회원가입 페이지로 이동
      }

      return true;
    }

    return false;
  };
  // 구매 시
  const handleOrderSubmit = () => {
    // 회원이 아닌 경우 구매 불가
    if (isNotMemberShip()) {
      return;
    }

    goToOrder(); // 구매 페이지로 이동
  };

  // 찜 저장 시,
  const handleWishlist = async () => {
    // 회원이 아닌 경우 사용 불가
    if (isNotMemberShip()) {
      return;
    }
    try {
      addWishlist(); // 찜 리스트 저장
    } catch (error) {
      const isDuplicate = error.response.data; // 하트가 눌러져 있는 경우 -> 제품이 이미 찜이 된 경우
      deleteWishlist(isDuplicate, error); // 찜 해제
    }
  };

  // 찜 리스트 저장
  const addWishlist = async () => {
    await addWishListByUserId(product.id);
    setIsWish(true); // 하트 변경
    alert(SUCCESS.INSERT_WISHLIST);
  };
  // 찜 해제
  const deleteWishlist = async (isDuplicate, error) => {
    if (isDuplicate.includes("duplicate")) {
      // 찜 해제 여부 권유창
      if (window.confirm(NOTION.DELETE_WISHLIST)) {
        try {
          await deleteWishListByUserId(product.id); // 찜 db에서 삭제
          setIsWish(false); // 하트 해제
          alert(SUCCESS.DELETE_WISHLIST);
        } catch (error) {
          errorNotion(
            error,
            ERROR.FAIL_DELETE_WISHLIST[ERROR.TEXT_EN],
            ERROR.FAIL_DELETE_WISHLIST[ERROR.TEXT_KR]
          );
        }
      }
      return;
    }
    errorNotion(
      error,
      ERROR.FAIL_INSERT_WISHLIST[ERROR.TEXT_EN],
      ERROR.FAIL_INSERT_WISHLIST[ERROR.TEXT_KR]
    );
  };

  // 장바구니 저장 시,
  const handleAddToCart = async () => {
    /**
     * 회원 아닐 경우, 장바구니 저장 불가
     * 추가 고려 사항 1. 게스트 저장 방식 생각해보기
     *              - 0. mypage 에서 접근 못하게 - 장바구니 페이지만 이용 가능
     *              - 1-1. 브라우저가 닫히면 캐시 삭제 - sessionStorage
     *              - 1-2. 일정 기간 데이터 유지 - localStorage
     *              - 3. 구매 -> 회원가입 유도 -> 로그인 페이지로 이동 (소셜 로그인도 가능하게)
     */
    if (isNotMemberShip()) {
      return;
    }
    try {
      const data = await addToCart(updateCart()); // 장바구니 DB에 제품 저장
      if (window.confirm(NOTION.GO_TO_CART)) {
        //  장바구니로 이동
        goToCart(data);
      }
    } catch (error) {
      errorNotion(
        error,
        ERROR.FAIL_INSERT_CART[ERROR.TEXT_EN],
        ERROR.FAIL_INSERT_CART[ERROR.TEXT_KR]
      );
    }
  };

  // 장바구니 정보 업데이트
  const updateCart = () => {
    const cart = {
      productId: product.id,
      quantity: showProductInfo.quantity,
    };

    return cart;
  };
  // 주문 상세 정보 업데이트
  const updatePurchaseOrder = () => {
    const purchaseOrder = [
      {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: showProductInfo.quantity,
      },
    ];

    return purchaseOrder;
  };

  // 에러 메시지 표기
  const errorNotion = (error, errorText, errorNotion) => {
    console.error(errorText, error);
    alert(errorNotion);
  };

  return (
    <>
      <Header />

      <Container
        fluid
        className="py-5"
        style={{ backgroundColor: "#fafafa", minHeight: "100vh" }}
      >
        <div
          className="detail-wrapper"
          style={{
            maxWidth: "1140px",
            margin: "auto",
            background: "white",
            borderRadius: 12,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            padding: "2.5rem",
          }}
        >
          <Row className="gx-5 align-items-center">
            {/* 이미지 슬라이더 */}
            <Col xs={12} md={6} className="mb-4 mb-md-0">
              <div
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                }}
              >
                <Slider {...PRODUCT_DETAIL_SETTING}>
                  {showProductInfo.images &&
                    showProductInfo.images.map((img, idx) => (
                      <div key={idx}>
                        <Image
                          src={img}
                          alt={`Image ${idx + 1}`}
                          fluid
                          style={{
                            width: "100%",
                            height: "auto",
                            objectFit: "cover",
                            borderRadius: 12,
                          }}
                        />
                      </div>
                    ))}
                </Slider>
              </div>
            </Col>

            {/* 상품 정보 */}
            <Col xs={12} md={6}>
              <h1
                style={{
                  fontWeight: "700",
                  fontSize: "2.4rem",
                  marginBottom: "1rem",
                  color: "#222",
                }}
              >
                {product.name}
              </h1>

              <p
                style={{
                  fontSize: "1rem",
                  color: "#666",
                  marginBottom: "2rem",
                  lineHeight: 1.6,
                }}
              >
                {product.description}
              </p>

              <table
                style={{
                  width: "100%",
                  marginBottom: "2rem",
                  fontSize: "0.95rem",
                  color: "#444",
                }}
              >
                <tbody>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        paddingBottom: "0.5rem",
                        width: "35%",
                        color: "#888",
                      }}
                    >
                      판매가
                    </th>
                    <td
                      style={{
                        fontWeight: "700",
                        fontSize: "1.3rem",
                        paddingBottom: "0.5rem",
                      }}
                    >
                      {product.price} 원
                    </td>
                  </tr>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        paddingBottom: "0.5rem",
                        color: "#888",
                      }}
                    >
                      적립금
                    </th>
                    <td style={{ color: "#999", paddingBottom: "0.5rem" }}>
                      {product.price * 0.01} 원 (1%)
                    </td>
                  </tr>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        paddingBottom: "0.5rem",
                        color: "#888",
                      }}
                    >
                      할인 기간
                    </th>
                    <td style={{ color: "#4d75da", paddingBottom: "0.5rem" }}>
                      남은 시간 10일 03:43:17 (24,400원 할인)
                      <br />
                      <small style={{ color: "#bbb" }}>
                        2024-01-26 09:50 ~ 2024-02-08 00:00
                      </small>
                    </td>
                  </tr>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        paddingBottom: "0.5rem",
                        color: "#888",
                      }}
                    >
                      상품소재
                    </th>
                    <td style={{ color: "#666" }}>울60%, 나일론25%, 폴리15%</td>
                  </tr>
                </tbody>
              </table>

              {/* 구매 수량 확인 */}
              <Form
                className="d-flex align-items-center mb-4"
                style={{ gap: "0.5rem", maxWidth: "160px" }}
              >
                <Button
                  variant="outline-secondary"
                  style={{
                    borderRadius: "8px",
                    width: "40px",
                    height: "40px",
                    fontWeight: "700",
                  }}
                  onClick={handleDecreaseQuantity}
                >
                  -
                </Button>
                <Form.Control
                  type="number"
                  value={showProductInfo.quantity}
                  readOnly
                  style={{
                    textAlign: "center",
                    borderRadius: "8px",
                    height: "40px",
                    fontWeight: "600",
                    borderColor: "#ddd",
                  }}
                />
                <Button
                  variant="outline-secondary"
                  style={{
                    borderRadius: "8px",
                    width: "40px",
                    height: "40px",
                    fontWeight: "700",
                  }}
                  onClick={handleIncreaseQuantity}
                >
                  +
                </Button>
              </Form>

              {/* 총 가격 */}
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "1.4rem",
                  marginBottom: "1.8rem",
                  color: "#222",
                }}
              >
                총상품금액 (수량): {showProductInfo.totalCost} 원
              </div>

              {/* 버튼 */}
              <div className="d-flex" style={{ gap: "1rem" }}>
                <Button
                  onClick={handleOrderSubmit}
                  disabled={product.quantity === 0}
                  style={{
                    flex: 1,
                    borderRadius: "10px",
                    padding: "1rem",
                    fontWeight: "700",
                    backgroundColor: "#f75c6a",
                    borderColor: "#f75c6a",
                  }}
                >
                  {product.quantity === 0 ? "SOLD OUT" : "바로 구매"}
                </Button>

                <Button
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0}
                  variant="outline-secondary"
                  style={{
                    flex: 1,
                    borderRadius: "10px",
                    padding: "1rem",
                    fontWeight: "700",
                    color: "#f75c6a",
                    borderColor: "#f75c6a",
                    backgroundColor: "white",
                  }}
                >
                  장바구니
                </Button>

                <Button
                  onClick={handleWishlist}
                  variant="outline-secondary"
                  style={{
                    borderRadius: "50%",
                    width: "45px",
                    height: "45px",
                    padding: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#f75c6a",
                    borderColor: "#f75c6a",
                    backgroundColor: "white",
                  }}
                >
                  <FontAwesomeIcon
                    icon={isWish ? fasHeart : farHeart}
                    size="lg"
                  />
                </Button>
              </div>
            </Col>
          </Row>
          `
          <Tabs
            defaultActiveKey="detail"
            id="product-detail-tabs"
            className="mt-5"
          >
            <Tab eventKey="detail" title="상세정보" className="pt-4">
              <div
                style={{ color: "#555", lineHeight: "1.6", fontSize: "1rem" }}
              >
                {product.longDescription || ERROR.NONE_PRODUCT_DESCRIPTION}
              </div>
            </Tab>
            <Tab eventKey="review" title="리뷰" className="pt-4">
              <ShowReview productId={product.id} />
            </Tab>
          </Tabs>
        </div>
      </Container>

      <Footer />
    </>
  );
}

export default ProductDetail;
