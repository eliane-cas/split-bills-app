import Expenses from "../components/Expenses";
import Members from "../components/Members";
import Split from "../components/Split";
import Logout from "../components/Logout";

import React, { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { ExpensesContext } from "../contexts/ExpensesContext";
import { MembersContext } from "../contexts/MembersContext";

function GroupHomePage() {
  const { currentUser } = useContext(AuthContext);
  const { groupId } = useParams();
  const { setGroupId: setExpensesGroupId } = useContext(ExpensesContext);
  const { setGroupId: setMembersGroupId } = useContext(MembersContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (groupId) {
      setExpensesGroupId(groupId);
      setMembersGroupId(groupId);
    }
  }, [groupId]);

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
      <Split groupId={groupId} />
    </div>
  );
}

export default GroupHomePage;
