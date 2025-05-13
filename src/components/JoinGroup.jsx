import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "./firebase";
import { AuthContext } from "../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid"; // create unique ids

function JoinGroup() {
  const [joinCode, setJoinCode] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const handleJoinGroup = async () => {
    if (!joinCode) return alert("Please enter group code");

    const q = query(
      collection(db, "groups"),
      where("inviteCode", "==", joinCode)
    );

    const querySnapshot = await getDocs(q);
    let groupId;
    if (!querySnapshot.empty) {
      const groupDoc = querySnapshot.docs[0];
      const groupData = groupDoc.data();
      groupId = groupDoc.id;
      console.log("Group found:", groupData);
    } else {
      console.log("No group found with that invite code.");
    }

    await updateDoc(doc(db, "users", currentUser.uid), {
      joinedGroups: arrayUnion(groupId),
    });

    navigate(`/groups/${groupId}`);
  };

  return (
    <div>
      <div>
        <h2>Join an Existing Group</h2>
        <input
          type="text"
          placeholder="Enter group code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />
        <button onClick={handleJoinGroup}>Join Group</button>
      </div>
    </div>
  );
}

export default JoinGroup;
