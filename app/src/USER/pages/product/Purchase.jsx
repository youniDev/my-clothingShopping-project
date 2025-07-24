import React, { useEffect, useState } from "react";

import { ERROR, ROUTE, SIGNUP, SUCCESS } from "../../../assets/js/Constants";
import { findAddressByPostCode } from "../../../assets/js/RegistrationUserFunction";
import { addToSales as insertPurchaseOrder } from "../../../api/PurchaseApi";

import { Card, Container, Col, Form, Button, Row } from "react-bootstrap";
import { fetchUserByUserId } from "../../../api/UserAPI";
import { useLocation, useNavigate } from "react-router-dom";

// 주소 찾기 API
import { useDaumPostcodePopup } from "react-daum-postcode";

const Purchase = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const open = useDaumPostcodePopup(SIGNUP.ADDRESS_DAUM_POST_URL); // 주소 찾기

  const [purchase, setPurchase] = useState({
    products: location.state.selectedProducts, // product id, name, price, quantity, tootal cost (제품 수량 * 제품 가격)
    user: [],
    totalCost: location.state.totalCost, // 총 구매비용 (모든 제품의 구매 가격)
  });

  useEffect(() => {
    fetchUser();
  }, []);

  // 유저 정보 조회
  const fetchUser = async () => {
    try {
      const data = await fetchUserByUserId();

      setPurchase((prev) => ({
        ...prev,
        user: data, // name, address
      }));
    } catch {
      alert(ERROR.FAIL_SELECT_USER[ERROR.TEXT_KR]);
      console.error(ERROR.FAIL_SELECT_USER[ERROR.TEXT_EN]);
    }
  };

  // 주문 정보 보내기
  const sendPurchaseOrder = async () => {
    const updateProducts = purchase.products.map((product) => ({
      productId: product.product_id,
      quantity: product.quantity,
      totalCost: purchase.totalCost,
    }));

    const data = await insertPurchaseOrder({ purchaseProduct: updateProducts });

    return data;
  };

  // 주소가 입력되지 않았으면 주문 불가
  const isAddressValid = () => {
    if (!purchase.user.address || !purchase.user.detail) {
      alert("주소와 상세주소를 모두 입력해주세요.");
      return true;
    }

    return false;
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // 주소가 입력되지 않았으면 주문 불가
      if (isAddressValid()) return;

      // 정상적으로 완료된 경우
      if (sendPurchaseOrder()) {
        goToMain();
      }
    } catch {
      alert(ERROR.FAIL_INSERT_ORDER[ERROR.TEXT_KR]);
      console.error(ERROR.FAIL_INSERT_ORDER[ERROR.TEXT_EN]);
    }
  };

  const goToMain = () => {
    alert(SUCCESS.INSERT_ORDER);
    navigate(ROUTE.MAIN);
  };

  // 상세 주소 수정
  const handleAddressDeatilChange = (e) => {
    const addressDetail = e.target.value;

    setPurchase((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        detail: addressDetail,
      },
    }));
  };
  // 주소 API
  const handleComplete = (data) => {
    let fullAddress = findAddressByPostCode(data);

    // 새 주소 입력 후 저장
    setPurchase((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        address: fullAddress,
      },
    }));
  };
  // 우편번호 찾기
  const handleClickByPostcode = () => {
    open({ onComplete: handleComplete });
  };

  return (
    <Container style={{ marginTop: "4rem", maxWidth: "800px" }}>
      <Form onSubmit={handleSubmit}>
        {/* 배송정보 섹션 */}
        <Card className="mb-4 shadow-sm">
          <Card.Header style={{ backgroundColor: "#f8f9fa" }}>
            <h5 className="mb-0">📦 배송 정보</h5>
          </Card.Header>
          <Card.Body>
            <Form.Group as={Row} className="mb-3" controlId="name">
              <Form.Label column sm={3} className="text-end fw-bold">
                이름
              </Form.Label>
              <Col sm={9}>
                <Form.Control type="text" value={purchase.user.name} readOnly />
              </Col>
            </Form.Group>
            {/** 주소 찾기 */}
            <Form.Group as={Row} className="mb-3" controlId="address">
              <Form.Label column sm={3} className="text-end fw-bold">
                주소
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={purchase.user.address}
                  readOnly
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="detail">
              <Form.Label column sm={3} className="text-end fw-bold">
                상세주소
              </Form.Label>
              <Col sm={6}>
                <Form.Control
                  type="text"
                  onChange={handleAddressDeatilChange}
                  value={purchase.user.detail}
                />
              </Col>
              <Col sm={3}>
                <Button
                  variant="outline-primary"
                  onClick={handleClickByPostcode}
                >
                  우편번호 찾기
                </Button>
              </Col>
            </Form.Group>
          </Card.Body>
        </Card>

        {/* 주문상품 섹션 */}
        <Card className="mb-4 shadow-sm">
          <Card.Header style={{ backgroundColor: "#f8f9fa" }}>
            <h5 className="mb-0">🛍️ 주문 상품</h5>
          </Card.Header>
          <Card.Body>
            {purchase.products.map((product, index) => (
              <div key={index} className="mb-3 pb-2 border-bottom">
                <p>
                  <strong>제품명:</strong> {product.name}
                </p>
                <p>
                  <strong>가격:</strong> {product.price}원
                </p>
                <p>
                  <strong>수량:</strong> {product.quantity}개
                </p>
              </div>
            ))}
          </Card.Body>
        </Card>

        {/* 결제 금액 섹션 */}
        <Card className="mb-4 shadow-sm">
          <Card.Header style={{ backgroundColor: "#f8f9fa" }}>
            <h5 className="mb-0">💰 결제 금액</h5>
          </Card.Header>
          <Card.Body>
            <Form.Group as={Row} className="align-items-center">
              <Form.Label column sm={4} className="text-end fw-bold">
                총 결제금액
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  value={purchase.totalCost + "원"}
                  readOnly
                  className="fw-bold text-danger"
                  style={{ fontSize: "1.2rem" }}
                />
              </Col>
            </Form.Group>
          </Card.Body>
        </Card>

        {/* 결제 버튼 */}
        <div className="text-end">
          <Button
            type="submit"
            variant="dark"
            size="lg"
            style={{
              padding: "0.75rem 2rem",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            결제하기
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Purchase;
