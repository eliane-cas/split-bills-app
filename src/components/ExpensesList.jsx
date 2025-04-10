import fb from "./firebase";
import React, { useEffect, useState } from "react";
import {
  getDocs,
  getDoc,
  collection,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const db = fb.firestore();
const ExpensesListdb = collection(db, "expenses");

const ExpensesList = () => {
  const navigate = useNavigate();

  const [storedExpenses, setStoredExpenses] = useState([]);

  const getUserName = async (userId) => {
    const docRef = doc(db, "members", userId);
    const docSnap = await getDoc(docRef);
    // .exists() => make sure doc exists in firestore
    return docSnap.exists() ? docSnap.data().Name : "Unknown User";
  };

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(ExpensesListdb);
        // convert firestore data to array + add doc id
        const expenses = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          expenseId: doc.id,
        }));

        // for each expense fetch the name of the payer and the names of the payers
        await Promise.all(
          expenses.map(async (expense) => {
            expense.Payer = await getUserName(expense.Payer);

            if (expense.Payers && Array.isArray(expense.Payers)) {
              expense.Payers = await Promise.all(
                expense.Payers.map(
                  async (payerId) => await getUserName(payerId)
                )
              );
            }
          })
        );
        setStoredExpenses(expenses);
      } catch (error) {
        console.error("Error fetching expenses list:", error);
      }
    };
    fetchDataFromFirestore();
    // storedExpenses state as dependency array so it reruns useEffect if we add, delete or modify an expense
  }, [storedExpenses]);

  const deleteNumber = async (item) => {
    await deleteDoc(doc(db, "expenses", item.expenseId));
  };

  return (
    <div>
      <h6>Expense List</h6>
      <div>
        {storedExpenses.map((item, index) => (
          <div key={index}>
            <li>Expense: {item.Expense}</li>
            <li>Amount: {item.Amount}€</li>
            {item.StartDate && (
              <li>
                Bill start date: {item.StartDate.toDate().toLocaleDateString()}
              </li>
            )}
            {item.EndDate && (
              <li>
                Bill end date: {item.EndDate.toDate().toLocaleDateString()}
              </li>
            )}
            {!item.StartDate && !item.EndDate && <li>Bill with no time!</li>}
            <li>Bill paid by {item.Payer}</li>
            <li>Split bill between: {item.Payers.join(" and ")}</li>
            <button onClick={() => navigate(`/editexpense/${item.expenseId}`)}>
              edit
            </button>
            <button onClick={() => deleteNumber(item)}>delete</button>
            <hr></hr>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpensesList;
