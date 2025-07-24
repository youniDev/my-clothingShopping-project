import React, { useEffect, useState } from "react";

import { ERROR } from "../../assets/js/Constants";
import { deleteToCart, fetchCartProductsByUserId } from "../../api/PurchaseApi";

import { Card, Container, Table, Col, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Cart = ({ userId }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({
    products: [],
    selectedProducts: [],
    selectAll: true,
    totalCost: 0,
  });

  useEffect(() => {
    fetchCart();

    console.log("product", cart.products);
  }, []);

  const fetchCart = async () => {
    try {
      const data = await fetchCartProductsByUserId();

      setCart((prev) => ({
        ...prev,
        products: data,
        totalCost: data.reduce(
          (total, product) => total + product.price * product.purchaseQuantity,
          0
        ),
        selectedProducts: data.map((product) => product.product_id),
      }));
    } catch {
      console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN]);
    }
  };

  const handleCheckboxChange = (productId) => {
    setCart((prevData) => {
      const { selectedProducts } = prevData;

      const updatedSelectedProducts = selectedProducts.includes(productId)
        ? selectedProducts.filter((id) => id !== productId)
        : [...selectedProducts, productId];

      const updatedTotalCost = updatedSelectedProducts.reduce(
        (total, productId) => {
          const product = prevData.products.find(
            (product) => product.product_id === productId
          );
          return total + product.price * product.purchaseQuantity;
        },
        0
      );

      return {
        ...prevData,
        selectedProducts: updatedSelectedProducts,
        totalCost: updatedTotalCost,
      };
    });
  };

  const handleSelectAllChange = () => {
    setCart((prevData) => {
      const { selectAll, products } = prevData;

      const updatedSelectAll = !selectAll;
      const updatedSelectedProducts = updatedSelectAll
        ? products.map((product) => product.product_id)
        : [];
      const updatedTotalCost = updatedSelectAll
        ? products.reduce(
            (total, product) =>
              total + product.price * product.purchaseQuantity,
            0
          )
        : 0;

      return {
        ...prevData,
        selectAll: updatedSelectAll,
        selectedProducts: updatedSelectedProducts,
        totalCost: updatedTotalCost,
      };
    });
  };

  const handleSubmit = () => {
    const selectedProductDetails = cart.selectedProducts.map((productId) => {
      const product = cart.products.find((p) => p.product_id === productId);
      return {
        product_id: productId,
        name: product.name,
        price: product.price,
        quantity: product.purchaseQuantity,
      };
    });

    // 구매 페이지로 이동
    navigate(`/purchase`, {
      state: {
        selectedProducts: selectedProductDetails,
        userId: userId,
        totalCost: cart.totalCost,
      },
    });
  };

  const handleCancel = () => {
    const selectedProductDetails = cart.selectedProducts.map((productId) => {
      const product = cart.products.find((p) => p.product_id === productId);
      return {
        productId: product.product_id,
        userId: userId,
      };
    });

    deleteToCart({ cart: selectedProductDetails })
      .then((res) => {
        if (res) {
          alert("삭제되었습니다.");
          fetchCart();
        } else alert("다시 시도해주세요.");
      })
      .catch((error) =>
        console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error)
      );
  };

  return (
    <Container style={{ marginTop: "4rem", maxWidth: "900px" }}>
      <Card className="shadow-sm">
        <Card.Header style={{ backgroundColor: "#f8f9fa" }}>
          <h5 className="mb-0">🛒 장바구니</h5>
        </Card.Header>
        <Card.Body>
          <Table
            striped
            bordered
            hover
            responsive
            style={{ textAlign: "center", marginBottom: "0" }}
          >
            <thead>
              <tr>
                <th style={{ width: "130px", whiteSpace: "nowrap" }}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAllChange}
                    checked={cart.selectAll}
                    style={{ marginRight: "8px", marginLeft: "-10px" }}
                  />
                  전체 선택
                </th>
                <th>제품 정보</th>
                <th>가격</th>
                <th>수량</th>
              </tr>
            </thead>
            <tbody>
              {cart.products?.map((product, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxChange(product.product_id)}
                      checked={cart.selectedProducts.includes(
                        product.product_id
                      )}
                    />
                  </td>
                  <td>
                    <div
                      onClick={() =>
                        navigate(
                          `/category/${product.category}/${product.product_id}`,
                          {
                            state: { data: product },
                          }
                        )
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td>{product.price.toLocaleString()} 원</td>
                  <td>{product.purchaseQuantity}개</td>
                </tr>
              ))}

              {/* 총합계 라인 */}
              <tr style={{ backgroundColor: "#f1f1f1" }}>
                <td colSpan="2" style={{ fontWeight: "bold" }}>
                  총 합계:
                </td>
                <td
                  colSpan="2"
                  style={{ fontWeight: "bold", color: "#dc3545" }}
                >
                  {cart.totalCost.toLocaleString()} 원
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* 하단 버튼 */}
      <Row className="mt-4">
        <Col sm={6}></Col>
        <Col sm={6} className="text-end">
          <Button variant="danger" onClick={handleCancel} className="me-2">
            선택 삭제
          </Button>
          <Button
            variant="dark"
            onClick={handleSubmit}
            style={{ fontWeight: "bold" }}
          >
            주문하기
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
