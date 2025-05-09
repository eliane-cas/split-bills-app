import { createContext, useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../components/firebase";

export const MembersContext = createContext();

export const MembersProvider = ({ children }) => {
  const [storedMembers, setStoredMembers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [groupId, setGroupId] = useState(null);

  const fetchMembers = async () => {
    if (!groupId) return;

    try {
      const q = query(
        collection(db, "members"),
        where("groupId", "==", groupId)
      );
      const querySnapshot = await getDocs(q);
      const members = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        memberId: doc.id,
      }));
      setStoredMembers(members);
    } catch (error) {
      console.error("Error fetching members list:", error);
    }
  };

  const triggerRefresh = () => setRefresh((prev) => !prev);

  useEffect(() => {
    if (groupId) {
      fetchMembers(groupId);
    }
  }, [refresh, groupId]);

  return (
    <MembersContext.Provider
      value={{ storedMembers, fetchMembers, triggerRefresh, setGroupId }}
    >
      {children}
    </MembersContext.Provider>
  );
};
