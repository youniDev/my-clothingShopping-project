import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAccessTokenByNaver } from "../../../api/AuthAPI";
import { ERROR } from "../../../assets/js/Constants";

const NaverRedirectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleOAuthNaver = async (e) => {
    try {
      const token = await getAccessTokenByNaver(e);
      localStorage.clear();
      localStorage.setItem("accessToken", token);
      window.location.href = `/`;
    } catch (error) {
      alert(ERROR.FAIL_LOGIN[ERROR.TEXT_KR]);
      navigate("/signin");
    }

    /*
        getAccessTokenByNaver(e)
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
      handleOAuthNaver(code);
    }
  }, [location]);

  return (
    <div>
      <div>로그인 중...</div>
    </div>
  );
};

export default NaverRedirectPage;
