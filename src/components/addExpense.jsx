import fb from "./firebase.js";
import React, { useState, useContext } from "react";
import {
  doc,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import "../css/addExpense.css";
import { MembersContext } from "../contexts/MembersContext.jsx";

const db = fb.firestore();
const ExpensesListdb = collection(db, "expenses");
const MembersListdb = collection(db, "members");

const AddExpense = () => {
  // TODO is it necessary to use state? should i use useEffect?
  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payers, setPayers] = useState([]);
  const [payer, setPayer] = useState("");
  const [shares, setShares] = useState({});

  // get members context
  const { storedMembers, triggerRefresh } = useContext(MembersContext);

  // save expense data to firestore
  const saveDataToFirestore = async (e) => {
    e.preventDefault();

    const calculatedShares = {};

    payers.forEach(async (payer) => {
      calculatedShares[payer] = amount / payers.length;
    });

    const docRef = await addDoc(ExpensesListdb, {
      Expense: expense,
      Amount: amount,
      StartDate: startDate,
      EndDate: endDate,
      Payers: payers,
      Payer: payer,
      Shares: calculatedShares,
    });
    console.log(docRef.id);
    console.log(payer);
    console.log(payers);

    alert("Document written to Database");
  };

  const handleCheckboxChange = (event) => {
    const checkedId = event.target.value;
    console.log(checkedId);
    if (event.target.checked) {
      setPayers([...payers, checkedId]);
    } else {
      setPayers([payers.filter((id) => id !== checkedId)]);
    }
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
            setStartDate(
              Timestamp.fromDate(new Date(e.target.value + "T00:00:00"))
            );
          }}
        />
        <label for="endDate">End Date:</label>
        <input
          type="date"
          id="endDate"
          name="end date"
          onChange={(e) => {
            setEndDate(
              Timestamp.fromDate(new Date(e.target.value + "T00:00:00"))
            );
          }}
        />
        <div>
          Who paid?
          {storedMembers.map((member, index) => (
            <div key={index}>
              <input
                required
                type="radio"
                id={member.Name}
                name="who paid"
                value={member.memberId}
                onChange={(event) => {
                  setPayer(event.target.value);
                }}
              />
              <label for={member.Name}>{member.Name}</label>
            </div>
          ))}
        </div>
        <div>
          Split between who?
          {storedMembers.map((member, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={member.Name}
                name={member.Name}
                value={member.memberId}
                onChange={(event) => {
                  handleCheckboxChange(event);
                }}
              ></input>
              <label for={member.Name}>{member.Name}</label>
            </div>
          ))}
        </div>
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default AddExpense;
