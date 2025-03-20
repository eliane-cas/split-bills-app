import fb from "./firebase.js";
import React, { useState } from "react";
import "../css/addExpense.css";
const DB = fb.firestore();

const ExpenseList = DB.collection("expenses");

const AddExpense = () => {
  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payers, setPayers] = useState("");

  const submit = (e) => {
    e.preventDefault();
    ExpenseList.add({
      Expense: expense,
      Amount: amount,
      StartDate: startDate,
      EndDate: endDate,
    })
      .then((docRef) => {
        alert("data successfully submitted");
      })
      .catch((error) => {
        console.error("error:", error);
      });
  };

  return (
    <div>
      <h6>Add expense</h6>
      <form
        className="expense-form"
        onSubmit={(event) => {
          submit(event);
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
