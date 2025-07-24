import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Container, Row, Col, Card, Image, Nav, Navbar } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react"; // swiper
import { Pagination as SwiperPagination } from "swiper/modules";

import Header from "../../../component/layout/Header";
import Footer from "../../../component/layout/Footer";
import Product from "../../../component/layout/Product";
import useSelectCategory from "../../../component/useSelectCateogory";

import "../../../assets/css/category.css";
import "swiper/css";
import "swiper/css/pagination";
import useProducts from "../../../component/useProducts";
import { useCursorPagination } from "../../../component/useCursorPagination";

function Category() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mainCategory } = useParams();

  //   /가 포함된 카테고리일 경우 제품이 검색되지 않는 오류가 발생, useParams()를 사용하면 주소에 있는 값만 불러오기 때문에 적합하지 않으므로, state값을 사용함
  //  ex) 블라우스/셔츠 인 경우 블라우스셔츠가 아닌 블라우스/셔츠 로 검색
  const { products, setProducts, bestItems, page } = useProducts(
    location.state?.data,
  );
  const { bottomRef, selectSortType } = useCursorPagination(
    location.state?.data,
    page,
    products,
    setProducts,
  );
  const { getCategory } = useSelectCategory(mainCategory);

  // 해당 카테고리로 이동
  const goToCategory = (category) => {
    return () => {
      if (category === "ALL") {
        category = getCategory().title;
      }

      navigate(`/category/${category.replace(/\//g, "")}`, {
        state: { data: category },
      });
    };
  };

  // 제품 세부 정보 페이지로 이동
  const handleImageClick = (product) => {
    navigate(`${location.pathname}/${product.id}`, {
      state: { data: product },
    });
  };

  // 무한 스크롤
  const renderPagination = () => {
    return <div ref={bottomRef} style={{ height: "1px" }} />;
  };

  // 각 제품 불러오기
  const renderProducts = (title, additional, sectionProducts) => {
    return (
      <div className="product-section text-center">
        <h2>{title}</h2>
        <p>{additional}</p>
        <Row xs={1} md={4}>
          <Product products={sectionProducts} />
        </Row>
      </div>
    );
  };

  // 제품 정렬
  const handleSortType = (type) => () => {
    selectSortType(type);
  };

  return (
    <>
      <Header />

      <div
        className="best-item-list-custom py-4"
        style={{ backgroundColor: "#f9f9f9" }}
      >
        <Container className="best-item-custom">
          <h5
            className="text-center mb-4"
            style={{
              fontFamily: "'Comic Sans MS', cursive, sans-serif",
              color: "#e91e63",
            }}
          >
            🌟 BEST ITEMS 🌟
          </h5>
          <Swiper
            slidesPerView={4}
            spaceBetween={25}
            pagination={{ clickable: true }}
            modules={[SwiperPagination]}
            style={{ paddingBottom: "2rem" }}
          >
            {bestItems.map((product) => (
              <SwiperSlide key={product.id}>
                <Card className="cute-card">
                  <div
                    className="img-container"
                    style={{
                      width: "280px",
                      height: "380px",
                      margin: "auto",
                      cursor: "pointer",
                    }}
                    onClick={() => handleImageClick(product)}
                  >
                    <Card.Img
                      variant="top"
                      src={product.thumbnail}
                      alt={product.name}
                      style={{
                        borderRadius: "12px",
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title
                      style={{
                        fontSize: "1.1rem",
                        color: "#d81b60",
                        fontWeight: "700",
                      }}
                    >
                      {product.name}
                    </Card.Title>
                    <Card.Text
                      style={{
                        fontSize: "0.85rem",
                        color: "#555",
                        minHeight: "2.5rem",
                      }}
                    >
                      {product.description}
                    </Card.Text>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                        color: "#f50057",
                      }}
                    >
                      {product.sale ? (
                        <>
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#999",
                              marginRight: "0.5rem",
                            }}
                          >
                            {product.price} 원
                          </span>
                          <span>{product.sale} 원</span>
                        </>
                      ) : (
                        <span>{product.price} 원</span>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </div>

      <Container className="category-nav py-4">
        <h5
          className="text-center mb-3"
          style={{
            fontFamily: "'Comic Sans MS', cursive, sans-serif",
            color: "#f06292",
          }}
        >
          {mainCategory === getCategory().title ? "ALL" : mainCategory}
        </h5>

        <Navbar expand="lg" className="navbar-notice-custom mb-4" bg="light">
          <Navbar.Collapse id="navbarNavAltMarkup">
            <Nav className="mx-auto cute-nav">
              <Nav.Link
                disabled={mainCategory === getCategory().title}
                onClick={() => goToCategory("ALL")()}
                style={{ borderRadius: "20px" }}
              >
                ALL
              </Nav.Link>
              {getCategory().items &&
                getCategory().items.map((item, index) => (
                  <Nav.Link
                    key={index}
                    onClick={() => goToCategory(item)()}
                    disabled={mainCategory === item.replace(/\//g, "")}
                    style={{ borderRadius: "20px" }}
                  >
                    {item}
                  </Nav.Link>
                ))}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Row className="align-items-center mb-3">
          <small className="col-sm-1" style={{ color: "#888" }}>
            Total Items.
          </small>
          <div className="col-sm-7"></div>
          <div className="col-sm-4 sorting-option-nav">
            <Navbar expand="lg" bg="light" className="navbar-notice-custom">
              <Navbar.Collapse id="navbarNavAltMarkup">
                <Nav className="mx-auto cute-nav">
                  <Nav.Link
                    name="createDate"
                    onClick={handleSortType("new")}
                    style={{ borderRadius: "20px" }}
                  >
                    신상품
                  </Nav.Link>
                  <Nav.Link
                    name="name"
                    onClick={handleSortType("dictionary")}
                    style={{ borderRadius: "20px" }}
                  >
                    상품명
                  </Nav.Link>
                  <Nav.Link
                    name="price"
                    onClick={handleSortType("cheaper")}
                    style={{ borderRadius: "20px" }}
                  >
                    낮은가격
                  </Nav.Link>
                  <Nav.Link
                    name="price"
                    onClick={handleSortType("expensive")}
                    style={{ borderRadius: "20px" }}
                  >
                    높은가격
                  </Nav.Link>
                  <Nav.Link
                    name="best"
                    onClick={handleSortType("best")}
                    style={{ borderRadius: "20px" }}
                  >
                    인기상품
                  </Nav.Link>
                  <Nav.Link name="review" style={{ borderRadius: "20px" }}>
                    사용후기
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </div>
        </Row>
      </Container>

      <Container>{renderProducts(null, null, products)}</Container>
      <Container>{renderPagination()}</Container>

      <Footer />
    </>
  );
}
export default Category;
