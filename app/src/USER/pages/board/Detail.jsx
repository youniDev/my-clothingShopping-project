import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Table,
  Form,
  Button,
  Col,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../../component/layout/Header";
import Footer from "../../../component/layout/Footer";
import Comment from "../../../component/layout/Comment";

import {
  deleteComment,
  deletePost,
  fetchCommentsByPostId,
} from "../../../api/BoardAPI";
import { ERROR } from "../../../assets/js/Constants";
import "../../../assets/css/board.css";

function Detail() {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state.data;
  const id = location.state.id;
  const userId = location.state.userId;

  const [comments, setComments] = useState([]);
  const [replyCommentId, setReplyCommentId] = useState(null);

  const getCommentsByPostId = async () => {
    console.log("갱신");

    const result = await fetchCommentsByPostId(post.postId);

    result.forEach((comment, index) => {
      // 만약 comment 객체의 parentCommentId가 존재한다면
      if (comment.parentCommentId !== null) {
        // 해당 댓글의 자식 댓글을 찾아서 reply 필드에 추가함
        result.filter((c) => {
          const isChildComment = c.commentId === comment.parentCommentId;

          // 현재 댓글이 자식 댓글이면 해당 부모 댓글의 reply 필드에 추가
          if (isChildComment) {
            // 부모 댓글의 reply 필드가 없다면 빈 배열로 초기화
            if (!c.reply) {
              c.reply = [];
            }
            // 자식 댓글을 부모 댓글의 reply 필드에 추가
            c.reply.push(comment);
          }
          return isChildComment;
        });
        // 추가된 comment 필드를 삭제함
        delete result[index];
      }
    });

    setComments(result);
  };

  useEffect(() => {
    getCommentsByPostId();
  }, []);

  // 대댓글 달기
  const handleReplyComment = (commentId) => {
    if (replyCommentId === commentId) {
      setReplyCommentId(null); // 대댓글 입력창 닫기

      return;
    }
    setReplyCommentId(commentId); // 대댓글 입력창 열기
  };

  const handleCloseComment = () => {
    setReplyCommentId(null); // 대댓글 입력창 닫기
  };

  // 댓글 삭제
  const handleDeleteComments = async (commentId) => {
    try {
      await deleteComment(commentId);
      await getCommentsByPostId();
    } catch (error) {
      alert("다시 시도해주세요.");
      console.log(ERROR.FAIL_COMMUNICATION, error);
    }
  };

  // 글 삭제
  const handleDeletePost = async (postId) => {
    try {
      alert("삭제 되었습니다");
      await deletePost(postId);
      navigate(`/community/${id}`, { state: { data: id, user: userId } });
    } catch (error) {
      alert("다시 시도해주세요.");
      console.log(ERROR.FAIL_COMMUNICATION, error);
    }
  };

  return (
    <>
      <Header />
      <Container className="mt-5 pt-5">
        {/* 게시글 카드 */}
        <Card className="mb-4 shadow-sm">
          <Card.Header>
            <h5>{post.title}</h5>
          </Card.Header>
          <Card.Body>
            <Row className="mb-2">
              <Col>
                <strong>작성자:</strong> {post.userId}
              </Col>
              <Col className="text-end">
                <strong>작성일:</strong> {post.createDate}
              </Col>
            </Row>
            <Card.Text>{post.content}</Card.Text>
            {post.userId === userId && (
              <div className="text-end">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeletePost(post.postId)}
                >
                  게시글 삭제
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* 댓글 목록 */}
        <h5 className="mb-3">💬 댓글</h5>
        {comments.map((c) => (
          <Card key={c.commentId} className="mb-3 ms-2">
            <Card.Body>
              <Row>
                <Col>
                  <strong>{c.commentUserId}</strong>
                </Col>
                <Col className="text-end">
                  {c.commentUserId === userId && (
                    <Button
                      className="delete-button ms-2"
                      size="sm"
                      onClick={() => handleDeleteComments(c.commentId)}
                    >
                      삭제
                    </Button>
                  )}
                  {!c.reply && (
                    <Button
                      className="insert-button ms-2"
                      size="sm"
                      onClick={() => handleReplyComment(c.commentId)}
                    >
                      댓글
                    </Button>
                  )}
                </Col>
              </Row>
              <p className="mt-2">{c.content}</p>

              {/* 대댓글 작성 폼 */}
              {replyCommentId === c.commentId && (
                <Comment
                  postId={post.postId}
                  userId={userId}
                  parentCommentId={c.commentId}
                  onCloseComment={handleCloseComment}
                  onCommentAdded={getCommentsByPostId}
                />
              )}

              {/* 대댓글 목록 */}
              {Array.isArray(c.reply) && (
                <div className="ms-4 mt-3">
                  {c.reply.map((reply, i) => (
                    <Card key={reply.commentId} className="mb-2">
                      <Card.Body>
                        <Row>
                          <Col>
                            <strong>{reply.commentUserId}</strong>
                          </Col>
                          <Col className="text-end">
                            {reply.commentUserId === userId && (
                              <Button
                                size="sm"
                                className="delete-button ms-2"
                                onClick={() =>
                                  handleDeleteComments(reply.commentId)
                                }
                              >
                                삭제
                              </Button>
                            )}
                            {i === c.reply.length - 1 && (
                              <Button
                                className="insert-button ms-2"
                                size="sm"
                                onClick={() =>
                                  handleReplyComment(reply.commentId)
                                }
                              >
                                댓글
                              </Button>
                            )}
                          </Col>
                        </Row>
                        <p className="mt-2">{reply.content}</p>

                        {i === c.reply.length - 1 &&
                          replyCommentId === reply.commentId && (
                            <Comment
                              postId={post.postId}
                              userId={userId}
                              parentCommentId={c.commentId}
                              onCloseComment={handleCloseComment}
                              onCommentAdded={getCommentsByPostId}
                            />
                          )}
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        ))}

        {/* 댓글 입력 폼 */}
        <Comment
          postId={post.postId}
          userId={userId}
          onCommentAdded={getCommentsByPostId}
        />
      </Container>
      <Footer />
    </>
  );
}

export default Detail;
