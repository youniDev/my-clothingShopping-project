// src/component/layout/Dropdown.jsx
import React, { useState } from "react";
import { NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "../../assets/css/dropdown.css";
import { BOARD } from "../../assets/js/Constants";

const Dropdown = (props) => {
  const navigate = useNavigate();
  const { dropdown, userId } = props;
  let timeoutId;

  const [show, setShow] = useState(false);

  // 드롭다운 펼치기
  const showDropdown = () => {
    clearTimeout(timeoutId);
    setShow(true);
  };
  const hideDropdown = () => {
    timeoutId = setTimeout(() => setShow(false), 50); // 드롭다운이 바로 닫치는 현상 막기
  };

  /**
   *
   * @param {*} e
   * @param {*} category - 드롭다운에서 선택한 카테고리
   */
  const handleDropdownClick = (e, category) => {
    e.stopPropagation(); // 부모 NavDropdown의 클릭 이벤트로 전파되는 걸 막기
    goToCatory(category); // 선택한 카테고리로 이동
    setShow(false);
  };

  const goToCatory = (category) => {
    let path = "/category"; // 제품 카테고리로 이동

    // 게시판으로 이동
    if (
      BOARD.CATEGORY[0].items.includes(category) ||
      BOARD.CATEGORY[0].title === category
    ) {
      path = "/community";
      navigate(`${path}/${category}`, {
        state: { data: category, user: userId },
      });
    }

    // replace -> 카테고리에서 '/' 가 포함될 경우 삭제
    navigate(`${path}/${category.replace(/\//g, "")}`, {
      state: { data: category, user: userId },
    });
  };

  return (
    <NavDropdown
      title={dropdown.title}
      id={`nav-dropdown-${dropdown.id}`}
      show={show}
      onMouseEnter={showDropdown}
      onMouseLeave={hideDropdown}
      onClick={(e) => {
        handleDropdownClick(e, dropdown.title);
      }}
      className="custom-nav-dropdown"
    >
      {dropdown.items.map((category) => (
        <NavDropdown.Item
          key={category}
          onClick={(e) => {
            handleDropdownClick(e, category);
          }}
          className="custom-dropdown-item"
        >
          {category}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};

export default Dropdown;
