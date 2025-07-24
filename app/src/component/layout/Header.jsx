import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

import { fetchUser } from "../../api/UserAPI";
import {
  BOARD,
  LOGIN,
  PRODUCT,
  PURCHASE,
  ROUTE,
  SVG_PATH,
} from "../../assets/js/Constants";
import Dropdown from "./Dropdown";

import "../../assets/css/header.css";

const CartIcon = () => {
  <>
    <svg xmlns={SVG_PATH.LINK} style={{ display: "none" }}>
      <symbol id="cart" viewBox="0 0 16 16">
        <path d={SVG_PATH.CART} />
      </symbol>
    </svg>
    <svg className="bi" width="24" height="24">
      <use xlinkHref="#cart" />
    </svg>
  </>;
};

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const ACCESS_TOKEN = localStorage.getItem(LOGIN.ACCESS_TOKEN);

  // access token 변경이 있을 때마다 사용자 이메일을 받아와 로그인 진행
  useEffect(() => {
    login();
  }, [ACCESS_TOKEN]);

  const login = async () => {
    if (ACCESS_TOKEN) {
      const data = await fetchUser();

      const updateUser = {
        id: data,
        nickname: data.split("@")[0],
      };

      setUser(updateUser);
    }
  };

  // 관리자 페이지 이동
  const goToDashboard = () => {
    navigate("/dashboard");
  };
  // 로그인 페이지로 이동
  const goToSignin = () => {
    navigate("/signin");
  };
  // 마이페이지 이동
  const goToMypage = () => {
    navigate("/mypage", {
      state: { userId: user.id, currentTab: PURCHASE.EDIT_USER },
    });
  };
  // 장바구니 페이지로 이동
  const goToCart = () => {
    navigate("/mypage", {
      state: { userId: user.id, currentTab: PURCHASE.CART },
    });
  };
  // 회원가입 페이지 이동
  const goToSignup = () => {
    navigate("/signup");
  };
  // 로그아웃
  const logout = () => {
    if (window.confirm(LOGIN.LOGOUT_ALTER)) {
      alert(LOGIN.LOGOUT_MSG);
      localStorage.removeItem(LOGIN.ACCESS_TOKEN); // 클라이언트에 저장되어 있는 로그인 토큰 지우기
      navigate(ROUTE.MAIN);
    }
  };

  return (
    <header>
      <Navbar
        bg="light"
        expand="md"
        fixed="top"
        className="border-bottom background-color-custom"
      >
        <Container fluid>
          <Navbar.Brand href="/">SHOPING MALL</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarCollapse" />
          <Navbar.Collapse id="navbarCollapse">
            <Nav className="me-auto mb-2 mb-md-0">
              <Nav.Link className="navbar-appeal" href="#">
                신상품 5%
              </Nav.Link>
              <Nav.Link className="navbar-appeal" href="#">
                베스트
              </Nav.Link>
              <Nav.Link className="navbar-appeal" href="#">
                오늘출발
              </Nav.Link>
              {/** 카테고리 나열 */}
              {PRODUCT.CATEGORY.slice(0, -1).map((dropdown) => (
                <Dropdown key={dropdown.id} dropdown={dropdown} />
              ))}
            </Nav>

            <Nav>
              {ACCESS_TOKEN ? (
                <React.Fragment>
                  {" "}
                  {user.id === "ADMIN" ? (
                    <Nav.Link onClick={goToDashboard}>
                      {user.id + " 관리자"}
                    </Nav.Link>
                  ) : (
                    <React.Fragment>
                      <Nav.Link onClick={goToCart}>
                        <CartIcon />
                      </Nav.Link>
                      <Nav.Link onClick={goToMypage}>
                        {user.nickname + " 님"}
                      </Nav.Link>
                    </React.Fragment>
                  )}
                  <Nav.Link onClick={logout}>LOGOUT</Nav.Link>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Nav.Link onClick={goToSignin}>LOGIN</Nav.Link>
                  <Nav.Link onClick={goToSignup}>JOIN</Nav.Link>
                </React.Fragment>
              )}
              {/** 게시판 */}
              {BOARD.CATEGORY.map((dropdown) => (
                <Dropdown
                  key={dropdown.id}
                  dropdown={dropdown}
                  userId={user.id}
                />
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
