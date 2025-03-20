import fb from "./firebase";
import React, { useEffect, useState } from "react";

const DB = fb.firestore();
const ExpenseList = DB.collection("expenses");

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const unsubscribe = ExpenseList.limit(100).onSnapshot((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(data, typeof data);
      console.log(ExpenseList);
      setExpenses(data);
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      <h6>Expense List</h6>

      <div>
        {expenses.map((expense) => (
          <div key={expense.id}>
            <p>Expense: {expense.Expense}</p>
            <p>Amount: {expense.Amount}</p>
            {<p>Start Date: {expense.StartDate}</p>}
            {<p>End Date: {expense.EndDate}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpensesList;
