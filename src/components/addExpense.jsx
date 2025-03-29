import fb from "./firebase.js";
import React, { useState } from "react";
import {
  doc,
  addDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import "../css/addExpense.css";

const db = fb.firestore();
const ExpensesListdb = collection(db, "expenses");
const MembersListdb = collection(db, "members");

const AddExpense = () => {
  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payers, setPayers] = useState([]);

  // get members from database
  const [storedMembers, setStoredMembers] = useState([]);

  const fetchDataFromFirestore = async () => {
    const querySnapshot = await getDocs(MembersListdb);
    const temporaryArr = [];
    querySnapshot.forEach((doc) => {
      let tempObj = doc.data();
      tempObj.docId = doc.id;
      temporaryArr.push(tempObj);
    });
    setStoredMembers(temporaryArr);
  };
  fetchDataFromFirestore();

  // console.log(storedMembers);

  // save expense data to firestore
  const saveDataToFirestore = async (e) => {
    e.preventDefault();
    const docRef = await addDoc(ExpensesListdb, {
      Expense: expense,
      Amount: amount,
      StartDate: startDate,
      EndDate: endDate,
      Payers: payers,
    });
    console.log(docRef.id);

    alert("Document written to Database");

    // splitting the bill
    storedMembers.forEach(async (member) => {
      if (payers.includes(member.Name)) {
        console.log(amount / payers.length, member.Name);
        member.Bills = [
          ...member.Bills,
          {
            billId: docRef.id,
            totalamount: amount,
            share: amount / payers.length,
          },
        ];

        await updateDoc(doc(db, "members", member.docId), {
          Bills: member.Bills,
        });
        console.log(member.Bills);
      }
    });
  };

  const handleCheckboxChange = (event) => {
    const checkedId = event.target.value;
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
        <div>
          {storedMembers.map((member, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={member.Name}
                name={member.Name}
                value={member.Name}
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
