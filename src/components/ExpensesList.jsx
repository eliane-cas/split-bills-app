import { db } from "./firebase";
import React, { useEffect, useState, useContext } from "react";
import {
  getDocs,
  getDoc,
  collection,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ExpensesContext } from "../contexts/ExpensesContext";
import { useNavigate, useParams } from "react-router-dom";
import { formatDateForDisplay } from "../utilities/dateUtils";

const ExpensesList = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const { storedExpenses, fetchExpenses, triggerRefresh } =
    useContext(ExpensesContext);

  // Add usernames to expense data
  const [parsedExpenses, setParsedExpenses] = useState([]);

  const getUserName = async (userId) => {
    const docRef = doc(db, "members", userId);
    const docSnap = await getDoc(docRef);
    // .exists() => make sure doc exists in firestore
    return docSnap.exists() ? docSnap.data().Name : "Unknown User";
  };

  // add names to expense data
  useEffect(() => {
    const enrichExpensesWithNames = async () => {
      const enriched = await Promise.all(
        storedExpenses.map(async (expense) => {
          const enrichedExpense = { ...expense };
          enrichedExpense.Payer = await getUserName(expense.Payer);

          if (expense.Payers && Array.isArray(expense.Payers)) {
            enrichedExpense.Payers = await Promise.all(
              expense.Payers.map((payerId) => getUserName(payerId))
            );
          }
          return enrichedExpense;
        })
      );
      setParsedExpenses(enriched);
    };
    enrichExpensesWithNames();
  }, [storedExpenses]);

  const deleteNumber = async (item) => {
    await deleteDoc(doc(db, "expenses", item.expenseId));
    triggerRefresh();
  };

  return (
    <div>
      <h6>Expense List</h6>
      <div>
        {parsedExpenses.map((item, index) => (
          <div key={index}>
            <li>Expense: {item.Expense}</li>
            <li>Amount: {item.Amount}€</li>
            {item.StartDate && (
              <li>Bill start date: {formatDateForDisplay(item.StartDate)}</li>
            )}
            {item.EndDate && (
              <li>Bill end date: {formatDateForDisplay(item.EndDate)}</li>
            )}
            {!item.StartDate && !item.EndDate && <li>Bill with no time!</li>}
            <li>Bill paid by {item.Payer}</li>
            <li>Split bill between: {item.Payers.join(" and ")}</li>
            <button
              onClick={() =>
                navigate(`/groups/${groupId}/editexpense/${item.expenseId}`)
              }
            >
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
