import { createContext, useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../components/firebase";

export const MembersContext = createContext();

export const MembersProvider = ({ children, activeGroupId }) => {
  const [storedMembers, setStoredMembers] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!activeGroupId) return;

      try {
        const q = query(
          collection(db, "members"),
          where("groupId", "==", activeGroupId)
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
    setStoredMembers([]);
    fetchMembers();
  }, [activeGroupId]);

  const triggerRefresh = () => setRefresh((prev) => !prev);

  return (
    <MembersContext.Provider value={{ storedMembers, triggerRefresh }}>
      {children}
    </MembersContext.Provider>
  );
};
