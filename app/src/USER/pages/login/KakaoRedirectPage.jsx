import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAccessTokenByKakao } from "../../../api/AuthAPI";
import { ERROR } from "../../../assets/js/Constants";

const KakaoRedirectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleOAuthKakao = async (e) => {
    try {
      const token = await getAccessTokenByKakao(e);
      localStorage.clear();
      localStorage.setItem("accessToken", token);
      window.location.href = `/`;
    } catch (error) {
      alert(ERROR.FAIL_LOGIN[ERROR.TEXT_KR]);
      navigate("/signin");
    }
    /*
        getAccessTokenByKakao(e)
        .then((response) => {
            localStorage.clear();
            localStorage.setItem('accessToken', response);
            window.location.href = `/`;
        }).catch((error) => {
            alert('로그인 실패. 다시 시도해주세요.');
            navigate("/signin");
        });
        */
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    if (code) {
      handleOAuthKakao(code);
    }
  }, [location]);

  return (
    <div>
      <div>로그인 중...</div>
    </div>
  );
};

export default KakaoRedirectPage;
