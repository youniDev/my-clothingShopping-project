import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Nav } from "react-bootstrap";

import { PURCHASE } from "../../../assets/js/Constants";

import Header from "../../../component/layout/Header";
import Footer from "../../../component/layout/Footer";
import UserDetail from "../../../component/layout/UserDetail";
import Cart from "../../../component/layout/Cart";
import DeliveryStatus from "../../../component/layout/DeliveryStatus";
import ShowProduct from "../../../component/layout/ShowProduct";

const MyPage = () => {
  const { state } = useLocation();
  const [currentTab, setTab] = useState(state.currentTab);

  const menu = [
    {
      category: "상세정보",
      icon: "🧑",
      content: (
        <UserDetail
          onRegistrationComplete={() => setTab(PURCHASE.EDIT_USER)}
          userId={state.userId}
        />
      ),
    },
    {
      category: "찜목록",
      icon: "❤️",
      content: <ShowProduct userId={state.userId} />,
    },
    {
      category: "장바구니",
      icon: "🛒",
      content: <Cart userId={state.userId} />,
    },
    {
      category: "배송정보",
      icon: "🚚",
      content: <DeliveryStatus userId={state.userId} />,
    },
  ];

  return (
    <>
      <Header />
      <Container
        fluid
        className="py-5"
        style={{
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          marginTop: "7rem",
        }}
      >
        <Row className="justify-content-center">
          {/* 카테고리 별 */}
          <Col xs={10} md={3} className="mb-4">
            <div className="p-4 bg-white rounded-4 shadow-sm">
              <h5 className="mb-4 text-center fw-bold">👤 My Page</h5>
              <Nav className="flex-column gap-2">
                {menu.map((item, i) => (
                  <Nav.Link
                    key={i}
                    onClick={() => setTab(i)}
                    className={`py-2 px-3 rounded-3 fw-medium ${
                      currentTab === i ? "bg-primary text-white" : "text-dark"
                    }`}
                    style={{
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {item.icon && <span className="me-2">{item.icon}</span>}
                    {item.category}
                  </Nav.Link>
                ))}
              </Nav>
            </div>
          </Col>
          {/* content */}
          <Col xs={12} md={7}>
            <div className="bg-white rounded-4 shadow-sm p-4">
              <h5 className="fw-bold mb-3">{menu[currentTab].category}</h5>
              <hr />
              {menu[currentTab].content}
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default MyPage;
