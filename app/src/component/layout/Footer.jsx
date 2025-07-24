import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { BOARD, POST_LINK, SVG_PATH } from "../../assets/js/Constants";

import "../../assets/css/footer.css";

const Footer = () => {
  const navigate = useNavigate();

  const goToBoard = (menu) => {
    const path = "/community";

    navigate(`${path}/${menu}`, { state: { data: menu, user: "" } });
  };

  return (
    <div
      className="footer-bg-custom"
      style={{ backgroundColor: "#1f1f1f", color: "#ccc", marginTop: "4rem" }}
    >
      <footer className="py-5">
        <hr style={{ borderColor: "#444" }} />
        <Container>
          <Row className="footer-custom" style={{ lineHeight: "1.8rem" }}>
            <Col md={3}>
              <div className="mb-3">
                <svg
                  xmlns={SVG_PATH.LINK}
                  width="28"
                  height="28"
                  fill="none"
                  stroke="#ccc"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <title>Product</title>
                  <circle cx="12" cy="12" r="10" />
                  <path d={SVG_PATH.CIRCLE} />
                </svg>
              </div>
              <h5 className="text-white mb-2">PRODUCT. SHOPPING MALL</h5>
              <ul className="list-unstyled">
                <li>
                  <span className="text-secondary p-0">developers. YOUNI</span>
                </li>
                <li>
                  <span className="text-secondary p-0">
                    address. [12345] 서울특별시
                  </span>
                </li>
                <li>
                  <span className="text-secondary p-0">
                    email. gum0945@naver.com
                  </span>
                </li>
                <li>
                  <Nav.Link
                    onClick={() => window.open(POST_LINK.GITHUB, "_blank")}
                    className="text-secondary p-0"
                  >
                    GitHub
                  </Nav.Link>
                </li>
              </ul>
              <small className="d-block mt-3 text-muted">
                &copy; 2025 YOUNIDEV.
              </small>
            </Col>

            <Col md={2}>
              <h5 className="text-white">소개</h5>
              <ul className="list-unstyled text-small">
                <li>
                  <span className="text-secondary">의류 쇼핑몰</span>
                </li>
                <li>
                  <Nav.Link
                    onClick={() => window.open(POST_LINK.VLOG, "_blank")}
                    className="text-secondary p-0"
                  >
                    자세히보기
                  </Nav.Link>
                </li>
                <li>
                  <span className="text-secondary">
                    2025/01/20 ~ 2025/05/20
                  </span>
                </li>
                <li>
                  <span className="text-secondary">developers. YOUNI</span>
                </li>
              </ul>
            </Col>

            <Col md={2}>
              <h5 className="text-white">고객센터</h5>
              <ul className="list-unstyled text-small">
                <li>
                  <strong className="text-secondary">1234-1234</strong>
                </li>
                <li>MON - FRI AM 11:00 - PM 5:30</li>
                <li>(BREAK) PM 12:00 - PM 1:00</li>
                <li>SAT. SUN. HOLIDAY CLOSE</li>
              </ul>
            </Col>

            <Col md={2}>
              <h5 className="text-white">계좌 정보</h5>
              <ul className="list-unstyled text-small">
                <li>농협 123-1234-1234-12</li>
                <li>국민 123456-12-123456</li>
              </ul>
            </Col>

            <Col md={3}>
              <h5 className="text-white">Q&A</h5>
              <ul className="list-unstyled text-small">
                {/** 게시판 */}
                {BOARD.CATEGORY.map((category) =>
                  category.items.map((menu, index) => (
                    <li key={index}>
                      <Nav.Link
                        onClick={() => goToBoard(menu)}
                        className="text-secondary p-0"
                      >
                        {menu}
                      </Nav.Link>
                    </li>
                  )),
                )}
              </ul>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Footer;
