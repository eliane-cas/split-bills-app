import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  doc,
  collection,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "./firebase";
import { AuthContext } from "../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid"; // create unique ids

function CreateGroup() {
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName) return alert("Enter a group name");
    const inviteCode = uuidv4().slice(0, 8);

    try {
      const newGroupRef = doc(collection(db, "groups"));
      await setDoc(newGroupRef, {
        name: newGroupName,
        description: newGroupDescription,
        createdBy: currentUser.uid,
        createdAt: new Date(),
        members: [currentUser.uid],
        inviteCode: inviteCode,
      });

      await updateDoc(doc(db, "users", currentUser.uid), {
        joinedGroups: arrayUnion(newGroupRef.id),
      });

      navigate(`/groups/${newGroupRef.id}`);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("An error occurred while creating the group. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleCreateGroup}>
        <h2>Create a New Group</h2>
        <input
          type="text"
          placeholder="Enter new group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          required
        />
        <textarea
          placeholder="Group description"
          value={newGroupDescription}
          onChange={(e) => setNewGroupDescription(e.target.value)}
        />
        <button type="submit">Create Group</button>
      </form>
    </div>
  );
}

export default CreateGroup;
