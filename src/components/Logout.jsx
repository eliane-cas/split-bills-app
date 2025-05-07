import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { auth } from "../components/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Logout() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/signuplogin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return <button onClick={handleLogout}>Log Out</button>;
}

export default Logout;
