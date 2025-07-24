import React, { useEffect, useState } from "react";

import { fetchUserInfo } from "../../api/UserAPI";

import RegistrationUser from "./RegistrationUser";
import { Container } from "react-bootstrap";

const UserDetail = ({ userId }) => {
  const [user, setUser] = useState([]);
  const [showRegistrationUser, setShowRegistrationUser] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserByUserId();
    }
  }, []);

  const fetchUserByUserId = async () => {
    const data = await fetchUserInfo();
    console.log(data);

    const address = data.address.split("/");

    const updateUser = {
      ...data,
      id: data.user_id,
      address: address[0],
      detail: address[1],
    };

    setUser(updateUser);
    setShowRegistrationUser(true);
  };

  return (
    <Container>
      {showRegistrationUser && <RegistrationUser userInfo={user} />}
    </Container>
  );
};

export default UserDetail;
