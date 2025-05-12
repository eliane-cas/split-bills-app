import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  doc,
  collection,
  setDoc,
  addDoc,
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
  const [name, setName] = useState("");

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName) return alert("Enter a group name");
    const inviteCode = uuidv4().slice(0, 8);

    try {
      const docRef = await addDoc(collection(db, "groups"), {
        name: newGroupName,
        description: newGroupDescription,
        createdBy: currentUser.uid,
        createdAt: new Date(),
        members: [currentUser.uid],
        inviteCode: inviteCode,
      });

      await addDoc(collection(db, "members"), {
        Name: name,
        groupId: docRef.id,
        linkedUser: currentUser.uid,
      });

      await updateDoc(doc(db, "users", currentUser.uid), {
        joinedGroups: arrayUnion(docRef.id),
      });

      navigate(`/groups/${docRef.id}`);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("An error occurred while creating the group. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleCreateGroup} className="expense-form">
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
        <label>Your name in this group:</label>
        <input
          required
          type="text"
          placeholder="your name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <button type="submit">Create Group</button>
      </form>
    </div>
  );
}

export default CreateGroup;
