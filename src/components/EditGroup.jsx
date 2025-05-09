import React, { useContext, useEffect, useState } from "react";
import {
  getDoc,
  doc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../components/firebase";
import { useParams, useNavigate } from "react-router-dom";

function EditGroup() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [groupInfo, setGroupInfo] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  useEffect(() => {
    const fetchGroupInfo = async () => {
      if (!groupId) return;

      try {
        const docRef = doc(db, "groups", groupId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return;

        const groupData = { id: groupId, ...docSnap.data() };
        setGroupInfo(groupData);
        setGroupName(groupData.name);
        setGroupDescription(groupData.description);
      } catch (error) {
        console.error("Error fetching group info: ", error);
      }
    };
    fetchGroupInfo();
  }, [groupId]);

  console.log(groupInfo);
  const updateGroup = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "groups", groupId), {
      name: groupName,
      description: groupDescription,
    });
    alert("group updated in the database");
  };

  return (
    <div>
      <div>
        <form onSubmit={(e) => updateGroup(e)} className="expense-form">
          <h2>Edit Group</h2>
          <input
            type="text"
            value={groupName}
            onChange={(e) => {
              setGroupName(e.target.value);
            }}
            required
          />
          <textarea
            value={groupDescription}
            onChange={(e) => {
              setGroupDescription(e.target.value);
            }}
          />
          <button type="submit">Update Group</button>
          <button onClick={() => navigate(`/groups/${groupId}`)}>
            go to homepage
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditGroup;
