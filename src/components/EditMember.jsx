import fb from "./firebase.js";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const db = fb.firestore();

function EditMember() {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  const { firebaseId } = useParams();

  useEffect(() => {
    const fetchMemberFromFirestore = async () => {
      const querySnapshot = await getDoc(doc(db, "members", firebaseId));

      const targetObject = querySnapshot.data();
      console.log("target object", targetObject);

      setName(targetObject.Name);
      setStartDate(targetObject.StartDate);
      setEndDate(targetObject.EndDate);
    };
    fetchMemberFromFirestore();
  }, [firebaseId]);

  const updateData = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "members", firebaseId), {
      Name: name,
      StartDate: startDate,
      EndDate: endDate,
    });
    alert("member updated in the database");
  };

  return (
    <>
      <h6>Edit member</h6>
      <form
        className="expense-form"
        onSubmit={(e) => {
          updateData(e);
        }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <label for="startDate">Entered flat on:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
          }}
        />
        <label for="endDate">Left flat on:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
          }}
        />
        <button type="submit">Update member</button>
        <button onClick={() => navigate("/")}>go to homepage</button>
      </form>
    </>
  );
}

export default EditMember;
