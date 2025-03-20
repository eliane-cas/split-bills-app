import fb from "./firebase";
import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";

const db = fb.firestore();
const ExpensesListdb = collection(db, "expenses");

const ExpensesList = () => {
  const [storedExpenses, setStoredExpenses] = useState([]);

  const fetchDataFromFirestore = async () => {
    const querySnapshot = await getDocs(ExpensesListdb);
    const temporaryArr = [];
    querySnapshot.forEach((doc) => {
      temporaryArr.push(doc.data());
    });
    setStoredExpenses(temporaryArr);
  };
  fetchDataFromFirestore();

  return (
    <div>
      <h6>Expense List</h6>
      <div>
        {storedExpenses.map((item, index) => (
          <div key={index}>
            <li>Expense: {item.Expense}</li>
            <li>Amount: {item.Amount}</li>
            <hr></hr>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpensesList;
