import fb from "./firebase.js";
import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import "../css/addExpense.css";

const db = fb.firestore();
const ExpensesListdb = collection(db, "expenses");

const AddExpense = () => {
  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payers, setPayers] = useState("");

  const saveDataToFirestore = async (e) => {
    e.preventDefault();
    const docRef = await addDoc(ExpensesListdb, {
      Expense: expense,
      Amount: amount,
      StartDate: startDate,
      EndDate: endDate,
    });
    alert("Document written to Database");
  };

  return (
    <div>
      <h6>Add expense</h6>
      <form
        className="expense-form"
        onSubmit={(e) => {
          saveDataToFirestore(e);
          console.log("submitted");
        }}
      >
        <input
          type="text"
          placeholder="Expense"
          onChange={(e) => {
            setExpense(e.target.value);
          }}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          required
        />
        <label for="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          name="start date"
          onChange={(e) => {
            setStartDate(e.target.value);
          }}
        />
        <label for="endDate">End Date:</label>
        <input
          type="date"
          id="endDate"
          name="end date"
          onChange={(e) => {
            setEndDate(e.target.value);
          }}
        />

        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default AddExpense;
