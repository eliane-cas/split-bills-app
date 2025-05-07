import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";
import { AuthContext } from "../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid"; // create unique ids

function CreateGroup() {
  const [newGroupName, setNewGroupName] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

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

export default CreateGroup;
