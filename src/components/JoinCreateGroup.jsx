import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";
import { AuthContext } from "../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid"; // create unique ids

function JoinCreateGroup() {
  const [joinCode, setJoinCode] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const handleJoinGroup = async () => {
    if (!joinCode) return alert("Please enter group code");

    const groupRef = doc(db, "groups", joinCode);
    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) {
      return "No group found with this code";
    }

    await updateDoc(doc(db, "users", currentUser.uid), {
      joinedGroups: arrayUnion(joinCode),
    });
  };

  const handleCreateGroup = async () => {
    if (!newGroupName) return alert("Enter a group name");
    const newGroupId = uuidv4;

    await setDoc(doc(db, "groups", newGroupId), {
      name: newGroupName,
      createdBy: currentUser.uid,
      createdAt: new Date(),
    });

    await updateDoc(doc(db, "users", currentUser.uid), {
      joinedGroups: arrayUnion(newGroupId),
    });
  };

  return (
    <div>
      <div>
        <h2>Current groups</h2>
      </div>
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
      <div>
        <h2>Create a New Group</h2>
        <input
          type="text"
          placeholder="Enter new group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <button onClick={handleCreateGroup}>Create Group</button>
      </div>
    </div>
  );
}

export default JoinCreateGroup;
