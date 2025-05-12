import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import { AuthContext } from "../contexts/AuthContext";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";

function MyGroups() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [myGroups, setMyGroups] = useState([]);

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
  }, [currentUser]);

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
