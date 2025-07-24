import React, { useEffect, useState } from "react";
import { Card, Row, Col, Container } from "react-bootstrap";
import {
  fetchSalesProductsByOrderId,
  fetchDeliveryStatusByUserId,
} from "../../api/PurchaseApi";
import { ERROR } from "../../assets/js/Constants";
import AddReview from "./AddReview";

const DeliveryStatus = ({ userId }) => {
  const [delivery, setDelivery] = useState([]);
  const [completeReview, setCompleteReview] = useState(false);

  useEffect(() => {
    fetchDeliveryStatus(); // 구매 리스트 불러오기
  }, [completeReview]);

  const fetchDeliveryStatus = async () => {
    try {
      const data = await fetchDeliveryStatusByUserId(userId);

      const orderIds = data.map((order) => order.order_id);
      showPurchaseProducts(orderIds, data);
    } catch {
      console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN]);
    }
  };

  const showPurchaseProducts = async (orderIds, deliveryStatus) => {
    try {
      const data = await fetchSalesProductsByOrderId(orderIds);

      const ordersWithProducts = deliveryStatus.map((order) => {
        const orderProducts = data
          .map((innerArray) =>
            innerArray.filter((product) => product.orderId === order.order_id),
          )
          .flat(); // flat 메소드를 사용하여 이중 배열을 평탄화
        return { ...order, products: orderProducts };
      });

      console.log(ordersWithProducts);
      setDelivery(ordersWithProducts);
    } catch {
      console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN]);
    }
  };

  const handleReviewSubmit = () => {
    setCompleteReview((prev) => !prev);
  };

  // 영어로 된 배송 정보 한글로 표기
  const translateStatus = (status) => {
    const statusMap = {
      ORDER_RECEIVED: "주문 접수",
      SHIPPING: "배송 중",
      DELIVERED: "배송 완료",
      CANCELLED: "주문 취소",
      RETURNED: "반품 완료",
    };
    return statusMap[status] || "알 수 없음";
  };

  return (
    <Container>
      {delivery.map((order, orderIndex) => (
        <Card key={orderIndex} className="mb-4 shadow-sm">
          <Card.Header>
            <strong>주문 번호:</strong> {order.order_id} &nbsp;|&nbsp;
            <strong>배송 상태:</strong> {translateStatus(order.shipping_status)}
          </Card.Header>
          <Card.Body>
            {order.products.map((product, productIndex) => (
              <Card key={productIndex} className="mb-3">
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>제품명:</strong> {product.name}
                      </p>
                      <p>
                        <strong>가격:</strong> {product.cost} 원
                      </p>
                      <p>
                        <strong>수량:</strong> {product.purchaseQuantity} 개
                      </p>
                    </Col>
                    <Col md={6} className="text-end">
                      {product.reviewId ? (
                        <p className="text-success">✅ 리뷰 작성 완료</p>
                      ) : (
                        <AddReview
                          userId={userId}
                          product={product}
                          orderId={order.order_id}
                          onReviewSubmit={handleReviewSubmit}
                        />
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default DeliveryStatus;
