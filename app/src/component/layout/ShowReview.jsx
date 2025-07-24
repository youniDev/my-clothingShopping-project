import React, { useEffect, useState } from "react";
import { Card, Badge, Col, Row, Image } from "react-bootstrap";
import { fetchReviewByProductId } from "../../api/ProductApi";
import { ERROR } from "../../assets/js/Constants";

import "../../assets/css/review.css";

const ShowReview = ({ productId }) => {
  const [reviews, setReview] = useState([]);

  useEffect(() => {
    fetchReview();
  }, []);

  // 해당 제품의 모든 리뷰 불러오기
  const fetchReview = async () => {
    try {
      const productReviews = await fetchReviewByProductId(productId);

      setReview(productReviews);
    } catch (error) {
      console.error(ERROR.FAIL_SELECT_REVIEW[ERROR.TEXT_EN], error);
    }
  };

  return (
    <>
      <h3 className="mb-4" style={{ fontWeight: "bold", color: "#333" }}>
        📷 제품 리뷰
      </h3>
      <Row xs={1} md={2} lg={2} className="g-4">
        {reviews.length !== 0 &&
          reviews.map((r, i) => (
            <Col key={i}>
              <Card
                style={{
                  borderRadius: "20px",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body>
                  <div className="d-flex align-items-center mb-2">
                    <Badge
                      bg="secondary"
                      className="me-2"
                      style={{ fontSize: "0.8rem" }}
                    >
                      유저 ID
                    </Badge>
                    <span style={{ fontWeight: "bold" }}>{r.user_id}</span>
                  </div>

                  <div className="mb-2">
                    <Badge bg="warning" text="dark">
                      평점 ⭐ {r.rating}
                    </Badge>
                  </div>

                  <Card.Text style={{ fontStyle: "italic", color: "#555" }}>
                    "{r.review}"
                  </Card.Text>

                  <Row>
                    {r.images.map((image, index) => (
                      <Col key={index} xs={6} md={4} className="mb-3">
                        <div
                          style={{
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow:
                              index === 0 ? "0 0 10px #ffb3b3" : "0 0 8px #ccc",
                          }}
                        >
                          <Image
                            src={image}
                            alt={`image ${index}`}
                            style={{
                              width: "100%",
                              height: "150px",
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </>
  );
};

export default ShowReview;
