import React from "react";
import { Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import "../../assets/css/product.css";
import "../../assets/css/itemImage.css";

const Product = ({ products }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const handleImageClick = (product) => {
    // 카테고리에서 접근하지 않고 메인화면에서 접근할 경우
    if (!path.includes("category")) {
      navigate(
        `/category/${product.category.replace(/\//g, "")}/${product.id}`,
        { state: { data: product } },
      );

      return;
    }

    navigate(`${path}/${product.id}`, { state: { data: product } }); // 제품 상세 페이지로 이동
  };

  return (
    <React.Fragment>
      {products?.map((p) => (
        <Col key={p.id} xs={6} md={4} lg={3} className="mb-4">
          <div className="product-card" onClick={() => handleImageClick(p)}>
            <div className="product-image-container">
              <img src={p.thumbnail} alt={p.name} className="product-image" />
            </div>
            <div className="product-info">
              <h5 className="product-name">{p.name}</h5>
              <p className="product-description">{p.description}</p>
              <div className="product-price">{p.price} 원</div>
            </div>
          </div>
        </Col>
      ))}
    </React.Fragment>
  );
};

export default Product;
