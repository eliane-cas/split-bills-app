import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import { AuthContext } from "../contexts/AuthContext";
import {
  getDoc,
  doc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../components/firebase";
import { useLocation } from "react-router-dom";

function MyGroups() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [myGroups, setMyGroups] = useState([]);
  const location = useLocation();
  useEffect(() => {
    const fetchJoinedGroups = async () => {
      if (!currentUser) return;
      try {
        // get group ids from user document
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return;

        const data = docSnap.data();
        const groupIds = data.joinedGroups || [];

        // get group details from group document
        const groupData = await Promise.all(
          groupIds.map(async (groupId) => {
            const docRef = doc(db, "groups", groupId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) return null;
            return { id: groupId, ...docSnap.data() };
          })
        );
        // remove any null entries in the array
        setMyGroups(groupData.filter((g) => g !== null));
      } catch (error) {
        console.error("Error fetching joined groups:", error);
      }
    };
    fetchJoinedGroups();
  }, [currentUser, location.key]);

  const deleteGroup = async (groupId) => {
    const confirm = window.confirm(
      "⚠️ You are about to delete this group for ALL members. Proceed?"
    );
    if (!confirm) return;

    try {
      // delete expenses from group
      const expensesQuery = query(
        collection(db, "expenses"),
        where("groupId", "==", groupId)
      );
      const expensesSnap = await getDocs(expensesQuery);
      const expensesDelete = expensesSnap.docs.map((docSnap) =>
        deleteDoc(doc(db, "expenses", docSnap.id))
      );

      // delete members from group
      const membersQuery = query(
        collection(db, "members"),
        where("groupId", "==", groupId)
      );
      const membersSnap = await getDocs(membersQuery);
      const membersDelete = membersSnap.docs.map((docSnap) =>
        deleteDoc(doc(db, "members", docSnap.id))
      );

      // remove group from users' joined groups array // CHECK IF THIS WORKS
      const userUpdates = membersSnap.docs.map(async (docSnap) => {
        const userData = docSnap.data();
        const userId = userData.linkedUser;
        console.log(userId, "userId");
        if (!userId) return;

        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          joinedGroups: arrayRemove(groupId),
        });
      });

      // delete group document
      const groupRef = doc(db, "groups", groupId);
      const groupDelete = deleteDoc(groupRef);

      await Promise.all([
        ...expensesDelete,
        ...membersDelete,
        ...userUpdates,
        groupDelete,
      ]);
      alert("Group and all related data succesfully deleted");
    } catch (error) {
      console.error("Error deleting group and related data: ", error);
    }
  };

  console.log(myGroups);

  return (
    <div>
      <Logout />
      <br />
      {currentUser ? (
        <>
          <p>Logged in as: {currentUser.email}</p>
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
      <h3>My Groups</h3>
      {myGroups.length === 0 ? (
        <p>You haven't joined any groups yet</p>
      ) : (
        <ul>
          {myGroups.map((group) => (
            <li key={group.id}>
              <h6>{group.name}</h6>
              <p>{group.description}</p>
              <button onClick={() => navigate(`/groups/${group.id}`)}>
                Go to group
              </button>
              <button onClick={() => deleteGroup(group.id)}>
                Delete group
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3>Start or Join a Group</h3>
      <button onClick={() => navigate("/creategroup")}>Create New Group</button>
      <button onClick={() => navigate("/joingroup")}>
        Join with Invite Code
      </button>
    </div>
  );
}

export default MyGroups;
