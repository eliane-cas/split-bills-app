import fb from "./firebase.js";
import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";

const db = fb.firestore();
const MembersListdb = collection(db, "members");

const AddMember = () => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const saveDataToFirestore = async (e) => {
    e.preventDefault();
    const docRef = await addDoc(MembersListdb, {
      Name: name,
      StartDate: startDate,
      EndDate: endDate,

      Paid: [],
    });
    alert("member added to the database");
  };

  return (
    <>
      <h6>Add member</h6>
      <form
        className="expense-form"
        onSubmit={(e) => {
          saveDataToFirestore(e);
        }}
      >
        <input
          required
          type="text"
          placeholder="User name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <label for="startDate">Entered flat on:</label>
        <input
          required
          type="date"
          id="startDate"
          name="start date"
          onChange={(e) => {
            setStartDate(e.target.value);
          }}
        />
        <label for="endDate">Left flat on:</label>
        <input
          type="date"
          id="endDate"
          name="end date"
          onChange={(e) => {
            setEndDate(e.target.value);
          }}
        />
        <button type="submit">Add member</button>
      </form>
    </>
  );
};

export default AddMember;
