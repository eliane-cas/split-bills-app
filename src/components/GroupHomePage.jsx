import Expenses from "../components/Expenses";
import Members from "../components/Members";
import Split from "../components/Split";
import Logout from "../components/Logout";
import GroupInfo from "./GroupInfo";

import React, { useContext, useEffect, useState } from "react";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";
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

  const [groupInfo, setGroupInfo] = useState();

  useEffect(() => {
    const fetchGroupInfo = async () => {
      if (!groupId) return;

      try {
        const docRef = doc(db, "groups", groupId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return;

        const groupData = docSnap.data();
        setGroupInfo(groupData);
      } catch (error) {
        console.error("Error fetching group info: ", error);
      }
    };
    fetchGroupInfo();
  }, [groupId]);

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
          <button onClick={() => navigate(`/mygroups`)}>
            Go back to my groups
          </button>
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
      <GroupInfo />
      <Members />
      <Expenses />
      <Split groupId={groupId} />
    </div>
  );
}

export default GroupHomePage;
