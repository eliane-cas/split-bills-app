import fb from "./firebase";
import React, { useState, useEffect, useContext } from "react";
import { getDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { ExpensesContext } from "../contexts/ExpensesContext.jsx";
import {
  formatDateForInput,
  parseDateToTimestamp,
} from "../utilities/dateUtils.jsx";

const db = fb.firestore();

function EditExpense() {
  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [startDateStr, setStartDateStr] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [endDateStr, setEndDateStr] = useState("");
  const [payers, setPayers] = useState([]);
  const [payer, setPayer] = useState("");

  const navigate = useNavigate();

  const { firebaseId } = useParams();

  const { storedExpenses, triggerRefresh } = useContext(ExpensesContext);

  useEffect(() => {
    const bill = storedExpenses.find((e) => e.expenseId === firebaseId);
    console.log("bill", bill);
    if (bill) {
      setExpense(bill.Expense);
      setAmount(bill.Amount);
      setStartDate(bill.StartDate);
      setStartDateStr(formatDateForInput(bill.StartDate));
      setEndDate(bill.EndDate);
      setEndDateStr(formatDateForInput(bill.EndDate));
    }
  }, [firebaseId, storedExpenses]);

  console.log(payers);

  const updateData = async (e) => {
    e.preventDefault();
    console.log(endDateStr, startDateStr);
    await updateDoc(doc(db, "expenses", firebaseId), {
      Expense: expense,
      Amount: amount,
      StartDate: parseDateToTimestamp(startDateStr),
      EndDate: parseDateToTimestamp(endDateStr),
    });
    alert("expense updated in the database");
  };

  return (
    <div>
      Edit Expense
      <div>
        <h6>Edit expense</h6>
        <form
          className="expense-form"
          onSubmit={(e) => {
            updateData(e);
          }}
        >
          <input
            type="text"
            value={expense}
            onChange={(e) => {
              setExpense(e.target.value);
            }}
            required
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            required
          />
          <label for="startDate">Start Date:</label>
          <input
            type="date"
            value={startDateStr}
            id="startDate"
            name="start date"
            onChange={(e) => {
              setStartDateStr(e.target.value);
            }}
          />
          <label for="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDateStr}
            name="end date"
            onChange={(e) => {
              setEndDateStr(e.target.value);
            }}
          />

          <div>
            {payers.map((payer, index) => (
              <div key={index}></div>
            ))}
          </div>

          <button type="submit">Update this Expense</button>
          <button onClick={() => navigate("/")}>go to homepage</button>
        </form>
      </div>
    </div>
  );
}

export default EditExpense;
