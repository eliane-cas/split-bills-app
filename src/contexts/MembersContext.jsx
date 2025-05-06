import { createContext, useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../components/firebase";

const MembersListdb = collection(db, "members");

export const MembersContext = createContext();

export const MembersProvider = ({ children }) => {
  const [storedMembers, setStoredMembers] = useState([]);

  const [refresh, setRefresh] = useState(false);

  const fetchMembers = async () => {
    try {
      const querySnapshot = await getDocs(MembersListdb);
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
    fetchMembers();
  }, [refresh]);

  return (
    <MembersContext.Provider
      value={{ storedMembers, fetchMembers, triggerRefresh }}
    >
      {children}
    </MembersContext.Provider>
  );
};
