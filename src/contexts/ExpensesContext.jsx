import { createContext, useContext, useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../components/firebase";

export const ExpensesContext = createContext();

export const ExpensesProvider = ({ children, activeGroupId }) => {
  const [storedExpenses, setStoredExpenses] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => setRefresh((prev) => !prev);

  useEffect(
    () => {
      const fetchExpenses = async () => {
        if (!activeGroupId) return;

        try {
          setStoredExpenses([]);
          const q = query(
            collection(db, "expenses"),
            where("groupId", "==", activeGroupId)
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
      fetchExpenses();
    },
    activeGroupId,
    refresh
  );

  return (
    <ExpensesContext.Provider
      value={{
        storedExpenses,

        triggerRefresh,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

// Further on create custom hook
// export const useExpenses = () => useContext(ExpensesContext);
