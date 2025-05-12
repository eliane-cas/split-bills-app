import Expenses from "../components/Expenses";
import Members from "../components/Members";
import Split from "../components/Split";
import Logout from "../components/Logout";
import GroupInfo from "./GroupInfo";

import React, { useContext, useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../components/firebase";

import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function GroupHomePage({ groupId }) {
  const { currentUser } = useContext(AuthContext);

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
      <Split />
    </div>
  );
}

export default GroupHomePage;
