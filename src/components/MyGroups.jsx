import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";

function MyGroups() {
  const navigate = useNavigate();
  return (
    <div>
      <Logout />
      <br />
      My Groups
      <h3>Start or Join a Group</h3>
      <button onClick={() => navigate("/creategroup")}>Create New Group</button>
      <button onClick={() => navigate("/joingroup")}>
        Join with Invite Code
      </button>
    </div>
  );
}

export default MyGroups;
