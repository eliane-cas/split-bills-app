import fb from "./firebase";
import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

const db = fb.firestore();
const ExpensesListdb = collection(db, "expenses");

function EditExpense() {
  const [storedExpenses, setStoredExpenses] = useState([]);

  const fetchDataFromFirestore = async () => {
    const querySnapshot = await getDocs(ExpensesListdb);
    const temporaryArr = [];
    querySnapshot.forEach((doc) => {
      let tempObj = doc.data();
      tempObj.docId = doc.id;
      temporaryArr.push(tempObj);
    });
    setStoredExpenses(temporaryArr);
  };
  fetchDataFromFirestore();

  return (
    <div>
      Edit Expense
      <div>
        <h6>Edit expense</h6>
        <form
          className="expense-form"
          onSubmit={(e) => {
            // saveDataToFirestore(e);
            console.log("submitted");
          }}
        >
          <input
            type="text"
            placeholder="Expense"
            onChange={(e) => {
              //   setExpense(e.target.value);
            }}
            required
          />
          <input
            type="number"
            placeholder="Amount"
            onChange={(e) => {
              //   setAmount(e.target.value);
            }}
            required
          />
          <label for="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="start date"
            onChange={(e) => {
              //   setStartDate(e.target.value);
            }}
          />
          <label for="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="end date"
            onChange={(e) => {
              //   setEndDate(e.target.value);
            }}
          />

          <button type="submit">Update this Expense</button>
        </form>
      </div>
    </div>
  );
}

export default EditExpense;
