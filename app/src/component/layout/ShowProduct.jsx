import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Pagination, Form, Col, Image } from "react-bootstrap";

import { getProductForMain } from "../../api/ProductApi";
import { getWishListByUserId } from "../../api/UserAPI";
import { ERROR, PAGE, PRODUCT } from "../../assets/js/Constants";

import Product from "./Product";
import "../../assets/css/wishList.css";

const ShowProduct = ({ userId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [products, setProducts] = useState({
    bestProducts: [],
    newProducts: [],
    wishList: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState({
    mainCategory: "All",
    subCategory: "",
  });

  // 마이페이지에서 찜 목록 불러오기
  useEffect(() => {
    if (currentPath === "/mypage") {
      console.log("mypage upload wish product");
      getProductByUserId();
    }
  }, [currentPage]);

  // 메인 페이지 제품 정보 불러오기
  useEffect(() => {
    if (currentPath === "/") {
      console.log("mainpage upload product");
      showMainPageProduct();
    }
  }, []);

  /*
    useEffect(() => {
        if (userId) {
            getProductByUserId();   // 마이페이지에서 찜 목록 불러오기
        } else {
            showMainPageProduct();  // 메인 페이지 제품 정보 불러오기
        }

    }, [currentPage]);
    */

  // 메인 페이지에 보여줄 제품 정보(베스트/ 신상 제품) 불러오기
  const showMainPageProduct = async () => {
    try {
      const product = await getProductForMain();

      setProducts((prev) => ({
        ...prev,
        bestProducts: product.bestProducts, // 베스트 제품
        newProducts: product.newProducts, // 신상 제품
      }));
    } catch (error) {
      console.error(ERROR.NON_PRODUCT[ERROR.TEXT_KR], error);
    }
  };

  // 찜 목록 불러오기
  const getProductByUserId = async () => {
    try {
      const wishList = await getWishListByUserId(userId);

      setProducts((prev) => ({
        ...prev,
        wishList: wishList,
      }));
    } catch (error) {
      console.error(ERROR.NON_PRODUCT[ERROR.TEXT_KR], error);
      alert(ERROR.NON_PRODUCT[ERROR.TEXT_KR]);
    }
  };

  // 페이지 변경 시 호출되는 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const renderPagination = (totalProducts) => {
    const totalPages = Math.ceil(totalProducts / PAGE.WISH_LIST);

    return (
      <Pagination>
        {Array.from({ length: totalPages }).map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={currentPage === index + 1}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    );
  };

  // 카테고리별 제품 찾기
  const getFilteredProducts = () => {
    if (selectedCategory.mainCategory === "All") {
      return products.wishList;
    }

    // 2. main 과 sub 카테고리 둘 다 선택된 경우
    if (selectedCategory.subCategory) {
      return products.wishList.filter(
        (product) => product.category === selectedCategory.subCategory,
      );
    }

    // 1. main 카테고리만 선택된 경우
    // 1-1. category item으로부터 title을 찾아야됨
    return products.wishList.filter(
      (product) =>
        PRODUCT.CATEGORY.find(
          (cat) => cat.items && cat.items.includes(product.category),
        ).id === selectedCategory.mainCategory,
    );
  };
  // 카테고리 선택
  const handleCategoryChange = (e) => {
    const main = e.target.value;

    setSelectedCategory((prev) => ({
      ...prev,
      mainCategory: main,
      subCategory: "",
    }));
  };

  const handleImageClick = (product) => {
    // 카테고리에서 접근하지 않고 메인화면에서 접근할 경우
    if (!currentPath.includes("category")) {
      navigate(
        `/category/${product.category.replace(/\//g, "")}/${product.id}`,
        { state: { data: product } },
      );

      return;
    }

    navigate(`${location.pathname}/${product.id}`, {
      state: { data: product },
    });
  };

  /**
   * 제품 보여주기
   * @param {String} title    - 제품명
   * @param {String} additional   - 제품 상세 정보
   * @param {Array} products      - 제품 정보
   */
  const showProduct = (title, additional, products) => {
    return (
      <div className="text-center">
        <h2>{title}</h2>
        <p>{additional}</p>
        <Row xs={1} md={4} className="row-cols-4">
          <Product products={products} />
        </Row>
      </div>
    );
  };

  return (
    <Container>
      {/* Main에 제품(베스트 / 신상) 보여줌*/}
      {currentPath === "/" && (
        <>
          {showProduct(
            PRODUCT.MAIN[PRODUCT.BEST].title,
            PRODUCT.MAIN[PRODUCT.BEST].additional,
            products.bestProducts,
          )}
          {showProduct(
            PRODUCT.MAIN[PRODUCT.NEW].title,
            PRODUCT.MAIN[PRODUCT.NEW].additional,
            products.newProducts,
          )}
        </>
      )}

      {/* 찜 목록 */}
      {currentPath === "/mypage" && (
        <>
          {/* 카테고리 필터 */}
          <Row
            className="align-items-center mb-4"
            style={{ marginTop: "4rem" }}
          >
            <Col xs="auto">
              <strong>CATEGORY :</strong>
            </Col>
            <Col xs="auto">
              <Form.Group controlId="mainCategoryFilter">
                <Form.Select
                  value={selectedCategory.mainCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="All">All</option>
                  {PRODUCT.CATEGORY.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs="auto">
              <Form.Group controlId="subCategoryFilter">
                <Form.Select
                  value={selectedCategory.subCategory}
                  onChange={(e) =>
                    setSelectedCategory((prev) => ({
                      ...prev,
                      subCategory: e.target.value,
                    }))
                  }
                >
                  <option value="">전체</option>
                  {PRODUCT.CATEGORY.find(
                    (c) => c.id === selectedCategory.mainCategory,
                  )?.items.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* 찜한 상품 */}
          <Row xs={2} sm={3} md={4} lg={5} className="g-4">
            {getFilteredProducts().map((product) => (
              <Col key={product.id}>
                <div className="wishlist-card">
                  <div
                    className="image-container"
                    onClick={() => handleImageClick(product)}
                  >
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      className="wishlist-image"
                      fluid
                    />
                    <div className="heart-overlay">❤️</div>
                  </div>
                  <div className="wishlist-info">
                    <p className="wishlist-name">{product.name}</p>
                    <p className="wishlist-price">
                      {product.price.toLocaleString()}원
                    </p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          {/* 페이지네이션 */}
          <div className="mt-4 d-flex justify-content-center">
            {renderPagination(getFilteredProducts().length)}
          </div>
        </>
      )}
    </Container>
  );
};

export default ShowProduct;
