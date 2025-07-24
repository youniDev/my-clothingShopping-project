import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { ERROR, ROUTE, SIGNUP, LOGIN } from "../../assets/js/Constants";
import { addUser, updateUser, deleteUser } from "../../api/UserAPI";
import VerificationModal from "./VerificationModal";

import {
  isDuplicationEmail,
  setErrorMsg,
  validate,
  isFormRight,
  findAddressByPostCode,
  isNullForm,
  updateUserForm,
} from "../../assets/js/RegistrationUserFunction";

// 주소 찾기 API
import { useDaumPostcodePopup } from "react-daum-postcode";

const RegistrationUser = ({ userInfo: user }) => {
  const navigate = useNavigate();
  const open = useDaumPostcodePopup(SIGNUP.ADDRESS_DAUM_POST_URL); // 주소 찾기

  const [showButton, setShowButton] = useState({
    idDuplication: false,
    verification: "",
  });
  const [formData, setFormData] = useState(user);
  const [errorState, setErrorState] = useState({
    id: { state: "", message: "" },
    password: { state: "", message: "" },
    passwordMatch: { state: "", message: "" },
    name: { state: "", message: "" },
    address: { state: "", message: "" },
    detail: { state: "", message: "" },
  });
  const verificationDisabled = (btn) => {
    setShowButton((prevState) => ({ ...prevState, verification: btn }));
  };
  const setError = (field, text) => {
    if (field === "id") {
      setShowButton((prevState) => ({ ...prevState, idDuplication: false }));
    }
    setErrorState((prevState) => ({
      ...prevState,
      [field]: { state: "block", message: text },
    }));
  };

  /*
   * 회원가입 form data 서버에 전송
   */
  const sendUserInfo = async (data) => {
    try {
      await addUser(data);

      navigate(ROUTE.MAIN);
    } catch {
      alert(ERROR.FAIL_COMMUNICATION[ERROR.SIGNUP.FAIL]);
      console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN]);
    }
  };

  // 회원 정보 수정
  const updateUserInfo = async (data) => {
    try {
      await updateUser(data);

      navigate(ROUTE.MAIN);
    } catch {
      alert(ERROR.FAIL_COMMUNICATION[ERROR.SIGNUP.FAIL]);
      console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN]);
    }
  };

  // 회원 탈퇴 요청
  const deleteuserInfo = async () => {
    await deleteUser();
    console.log("탈퇴 성공");
    localStorage.removeItem(LOGIN.ACCESS_TOKEN);
    navigate(ROUTE.MAIN);
  };

  /**
   * 제출
   * @param {*} e - 제출 동작 멈춤
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const type = e.nativeEvent.submitter.value;

    //  회원 탈퇴
    if (type === "delete") {
      if (window.confirm("정말로 탈퇴하시겠습니까?")) {
        deleteuserInfo();
      }
    }

    //  회원 가입 혹은 수정
    if (type === "insert") {
      if (user.id) {
        if (isNullForm) {
          const updateData = updateUserForm(formData);

          updateUserInfo(updateData);
        }
      }
      if (!user.id) {
        if (isFormRight(formData, errorState, showButton)) {
          const updateData = updateUserForm(formData);

          sendUserInfo(updateData);
        }
      }
    }
  };

  /**
   * 이메일 중복 검사
   */
  const handleCheckDuplicateEmail = async () => {
    if (validate("id", formData.id)) {
      const result = await isDuplicationEmail(formData.id, errorState.id.state);

      if (!result)
        setShowButton((prevState) => ({ ...prevState, idDuplication: true })); // 중복 검사 버튼 비활성화
    }
  };

  // form data 저장
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setError(name, setErrorMsg(value));

    if (validate(name, value)) {
      setErrorState((prevState) => ({ ...prevState, [name]: { state: "" } }));
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  // 비밀번호 일치한지 확인
  const validatePasswordMatch = (e) => {
    const { name, value } = e.target;

    setError(name, setErrorMsg(value));

    // 같을 경우
    if (value === formData.password) {
      setErrorState((prevState) => ({ ...prevState, [name]: { state: "" } }));
    }
  };

  // 주소 API
  const handleComplete = (data) => {
    let fullAddress = findAddressByPostCode(data);

    setFormData((prevData) => ({ ...prevData, address: fullAddress }));
  };
  const handleClickByPostcode = () => {
    open({ onComplete: handleComplete });
  };

  function inputUser(
    label,
    placeholder,
    type,
    name,
    buttonText,
    onClick,
    buttonDisabled,
  ) {
    return (
      <Form.Group as={Row} className="mb-3 align-items-center" key={name}>
        <Form.Label
          column
          sm={2}
          className={`${label ? "label-basic-info-custom fw-bold" : ""}`}
        >
          {label}
        </Form.Label>
        {type && (
          <Col sm={4}>
            <Form.Control
              type={type}
              placeholder={placeholder}
              onChange={handleInputChange}
              value={formData[name]}
              name={name}
              readOnly={name === "id" && user.id}
              className="form-control-custom"
            />
          </Col>
        )}
        {buttonText && (
          <Col sm={2}>
            <Button
              variant="outline-secondary"
              onClick={onClick}
              disabled={buttonDisabled}
            >
              {buttonText}
            </Button>
          </Col>
        )}
        {name && (
          <Col sm={4} className="error-text-custom">
            <Form.Text
              className="text-danger"
              style={{ display: errorState[name].state ? "block" : "none" }}
            >
              {errorState[name].message}
            </Form.Text>
          </Col>
        )}
      </Form.Group>
    );
  }

  return (
    <Container className="px-4">
      <Form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">
        <Card className="mb-4">
          <Card.Header className="bg-light fw-bold">기본 정보</Card.Header>
          <Card.Body>
            {user.id ? (
              <>
                {inputUser(
                  "아이디",
                  "email@example.com",
                  "text",
                  "id",
                  "",
                  null,
                  true,
                )}
                {inputUser("이름", "이름", "text", "name", "", null, false)}
                {inputUser(
                  "주소",
                  "주소",
                  "text",
                  "address",
                  "우편번호찾기",
                  handleClickByPostcode,
                  false,
                )}
                {inputUser(null, "상세주소", "text", "detail", "", null, false)}
                {!["NAVER", "GOOGLE", "KAKAO"].includes(user.password) &&
                  inputUser(
                    "비밀번호변경",
                    "",
                    "",
                    "password",
                    "비밀번호변경",
                    null,
                    false,
                  )}
              </>
            ) : (
              <>
                {inputUser(
                  "아이디",
                  "email@example.com",
                  "text",
                  "id",
                  "중복확인",
                  handleCheckDuplicateEmail,
                  showButton.idDuplication,
                )}
                {inputUser(
                  "비밀번호",
                  "비밀번호",
                  "password",
                  "password",
                  "",
                  null,
                  false,
                )}
                {inputUser(
                  "비밀번호 확인",
                  "비밀번호 확인",
                  "password",
                  "passwordMatch",
                  "",
                  validatePasswordMatch,
                  false,
                )}
                {inputUser("이름", "이름", "text", "name", "", null, false)}
                {inputUser(
                  "주소",
                  "주소",
                  "text",
                  "address",
                  "우편번호찾기",
                  handleClickByPostcode,
                  false,
                )}
                {inputUser(null, "상세주소", "text", "detail", "", null, false)}
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2} className="fw-bold">
                    본인 인증
                  </Form.Label>
                  <Col sm={4}>
                    <VerificationModal
                      verificationBtnDisabled={verificationDisabled}
                    />
                  </Col>
                </Form.Group>
              </>
            )}
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header className="bg-light fw-bold">추가 정보</Card.Header>
          <Card.Body>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                생년월일
              </Form.Label>
              <Col sm={4}>
                <Form.Control
                  type="date"
                  name="birth"
                  value={formData.birth}
                  onChange={handleInputChange}
                />
              </Col>
              {!user.id && (
                <Col sm={4}>
                  <span className="text-warning">🎁 생일 쿠폰 지급</span>
                </Col>
              )}
            </Form.Group>

            {user.id && (
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
                  포인트
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    type="text"
                    value={formData.point}
                    name="point"
                    readOnly
                  />
                </Col>
              </Form.Group>
            )}

            {!user.id && (
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
                  가입 경로
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    onChange={handleInputChange}
                    name="path"
                  />
                </Col>
              </Form.Group>
            )}
          </Card.Body>
        </Card>

        <Form.Group as={Row} className="mt-4">
          <Col
            sm={{ span: 10, offset: 2 }}
            className="d-flex justify-content-end gap-3"
          >
            <Button type="submit" value="insert" variant="primary">
              {user.id ? "정보 수정" : "회원 가입"}
            </Button>
            {user.id && (
              <Button type="submit" value="delete" variant="outline-danger">
                회원 탈퇴
              </Button>
            )}
          </Col>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default RegistrationUser;
