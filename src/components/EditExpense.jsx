import fb from "./firebase";
import React, { useState, useEffect } from "react";
import { getDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

const db = fb.firestore();

function EditExpense() {
  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payers, setPayers] = useState([]);

  const navigate = useNavigate();

  const { firebaseId } = useParams();

  useEffect(() => {
    const fetchExpenseFromFirestore = async () => {
      const querySnapshot = await getDoc(doc(db, "expenses", firebaseId));

      const targetObject = querySnapshot.data();
      console.log("target object", targetObject);

      setExpense(targetObject.Expense);
      setAmount(targetObject.Amount);
      setStartDate(targetObject.StartDate);
      setEndDate(targetObject.EndDate);
      setPayers(targetObject.Payers);
    };
    fetchExpenseFromFirestore();
  }, [firebaseId]);

  console.log(payers);

  const updateData = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "expenses", firebaseId), {
      Expense: expense,
      Amount: amount,
      StartDate: startDate,
      EndDate: endDate,
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
            value={startDate.toDate().toLocaleDateString()}
            id="startDate"
            name="start date"
            onChange={(e) => {
              setStartDate(
                Timestamp.fromDate(new Date(e.target.value + "T00:00:00"))
              );
            }}
          />
          <label for="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate.toDate().toLocaleDateString()}
            name="end date"
            onChange={(e) => {
              setEndDate(
                Timestamp.fromDate(new Date(e.target.value + "T00:00:00"))
              );
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
