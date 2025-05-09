import { createContext, useContext, useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../components/firebase";

export const ExpensesContext = createContext();

export const ExpensesProvider = ({ children }) => {
  const [storedExpenses, setStoredExpenses] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [groupId, setGroupId] = useState(null);

  const fetchExpenses = async (groupId) => {
    if (!groupId) return;

    try {
      const q = query(
        collection(db, "expenses"),
        where("groupId", "==", groupId)
      );
      const querySnapshot = await getDocs(q);
      const expenses = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        expenseId: doc.id,
      }));
      setStoredExpenses(expenses);
    } catch (error) {
      console.error("Error fetching expense list:", error);
    }
  };

  const triggerRefresh = () => setRefresh((prev) => !prev);

  useEffect(() => {
    if (groupId) {
      fetchExpenses(groupId);
    }
  }, [refresh, groupId]);

  return (
    <ExpensesContext.Provider
      value={{
        storedExpenses,
        fetchExpenses,
        triggerRefresh,
        setGroupId,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

// Further on create custom hook
// export const useExpenses = () => useContext(ExpensesContext);
