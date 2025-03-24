import fb from "./firebase";
import React, { useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const db = fb.firestore();
const ExpensesListdb = collection(db, "expenses");

const ExpensesList = () => {
  const navigate = useNavigate();

  const [storedExpenses, setStoredExpenses] = useState([]);

  const fetchDataFromFirestore = async () => {
    const querySnapshot = await getDocs(ExpensesListdb);
    const temporaryArr = [];
    querySnapshot.forEach((doc) => {
      let tempObj = doc.data();
      tempObj.docId = doc.id;
      temporaryArr.push(tempObj);
      // console.log(doc.id);
    });
    setStoredExpenses(temporaryArr);
  };
  fetchDataFromFirestore();

  // console.log(storedExpenses);

  const deleteNumber = async (item) => {
    await deleteDoc(doc(db, "expenses", item.docId));
  };

  return (
    <div>
      <h6>Expense List</h6>
      <div>
        {storedExpenses.map((item, index) => (
          <div key={index}>
            <li>Expense: {item.Expense}</li>
            <li>Amount: {item.Amount}€</li>
            {item.StartDate && <li>Bill start date: {item.StartDate}</li>}
            {item.EndDate && <li>Bill end date: {item.EndDate}</li>}
            {!item.StartDate && !item.EndDate && <p>bill with no time!</p>}
            <li>split bill between: {item.Payers.join(" and ")}</li>
            <button onClick={() => navigate(`/editexpense/${item.docId}`)}>
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
