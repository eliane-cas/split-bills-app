import React, { useContext, useEffect, useState } from "react";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";
import { useParams, useNavigate } from "react-router-dom";

function GroupInfo() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [groupInfo, setGroupInfo] = useState(null);

  useEffect(() => {
    const fetchGroupInfo = async () => {
      if (!groupId) return;

      try {
        const docRef = doc(db, "groups", groupId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return;

        const groupData = { id: groupId, ...docSnap.data() };
        setGroupInfo(groupData);
      } catch (error) {
        console.error("Error fetching group info: ", error);
      }
    };
    fetchGroupInfo();
  }, [groupId]);

  console.log(groupInfo);

  return (
    <div>
      {groupInfo ? (
        <>
          <h2>Welcome to: {groupInfo.name}</h2>
          <p>description: {groupInfo.description}</p>
          <button onClick={() => navigate(`/editgroup/${groupInfo.id}`)}>
            edit group
          </button>
        </>
      ) : (
        <p>Loding group info</p>
      )}
    </div>
  );
}

export default GroupInfo;
