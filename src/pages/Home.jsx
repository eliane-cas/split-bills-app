import Expenses from "../components/Expenses";
import Members from "../components/Members";
import Split from "../components/Split";

import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { auth } from "../components/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";

function Home() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      <header>Split Bills App</header>
      {currentUser ? (
        <>
          <p>Logged in as: {currentUser.email}</p>
          <Logout />
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
      <Members />
      <Expenses />
      <Split />
    </div>
  );
}

export default Home;
