import { createContext, useContext, useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../components/firebase";

const ExpensesListdb = collection(db, "expenses");

export const ExpensesContext = createContext();

export const ExpensesProvider = ({ children }) => {
  const [storedExpenses, setStoredExpenses] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const fetchExpenses = async () => {
    try {
      const querySnapshot = await getDocs(ExpensesListdb);
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
    fetchExpenses();
  }, [refresh]);

  return (
    <ExpensesContext.Provider
      value={{
        storedExpenses,
        fetchExpenses,
        triggerRefresh,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

// Further on create custom hook
// export const useExpenses = () => useContext(ExpensesContext);
