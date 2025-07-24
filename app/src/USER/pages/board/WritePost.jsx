import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { addPost } from "../../../api/BoardAPI";
import { useNavigate, useLocation } from "react-router-dom";
import { BOARD, ERROR, SUCCESS } from "../../../assets/js/Constants";
import Header from "../../../component/layout/Header";
import Footer from "../../../component/layout/Footer";

const WritePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state.author;

  const [post, setPost] = useState({
    title: "",
    content: "",
    category: "",
    image: "",
  });

  // 글 등록
  const handleSubmit = (e) => {
    e.preventDefault();

    goToCategory();
  };

  const goToCategory = async () => {
    try {
      await addPost(post);

      alert(SUCCESS.INSERT_POST);
      navigate(`/community`, { state: { data: post.category, user: user } });
    } catch (error) {
      console.error(ERROR.FAIL_INSERT_POST[ERROR.TEXT_KR], error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Header />
      <Container
        style={{ maxWidth: "800px", marginTop: "8rem", marginBottom: "4rem" }}
      >
        <h3 className="mb-4 text-center fw-bold">게시글 작성</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">카테고리</Form.Label>
            <Form.Select
              name="category"
              value={post.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                카테고리를 선택하세요
              </option>
              {BOARD.CATEGORY[0].items.slice(1).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">제목</Form.Label>
            <Form.Control
              type="text"
              name="title"
              placeholder="제목을 입력하세요"
              value={post.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">내용</Form.Label>
            <Form.Control
              as="textarea"
              name="content"
              rows={6}
              placeholder="내용을 입력하세요"
              value={post.content}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="text-end">
            <Button variant="primary" type="submit" className="px-4">
              작성
            </Button>
          </div>
        </Form>
      </Container>
      <Footer />
    </>
  );
};

export default WritePost;
