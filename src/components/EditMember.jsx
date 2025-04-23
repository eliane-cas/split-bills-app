import fb from "./firebase.js";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { MembersContext } from "../contexts/MembersContext.jsx";
import {
  formatDateForInput,
  parseDateToTimestamp,
} from "../utilities/dateUtils.jsx";

const db = fb.firestore();

function EditMember() {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [startDateStr, setStartDateStr] = useState("");
  const [endDateStr, setEndDateStr] = useState("");
  const [endDate, setEndDate] = useState(null);

  const navigate = useNavigate();

  const { firebaseId } = useParams();

  const { storedMembers, triggerRefresh } = useContext(MembersContext);
  console.log(storedMembers);

  useEffect(() => {
    const member = storedMembers.find((m) => m.memberId === firebaseId);
    console.log("member", member);
    if (member) {
      setName(member.Name);
      setStartDate(member.StartDate);
      setStartDateStr(formatDateForInput(member.StartDate));
      setEndDate(member.EndDate);
      setEndDateStr(formatDateForInput(member.EndDate));
    }
  }, [firebaseId, storedMembers]);

  const updateData = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "members", firebaseId), {
      Name: name,
      StartDate: parseDateToTimestamp(startDateStr),
      EndDate: parseDateToTimestamp(endDateStr),
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
          value={startDateStr}
          onChange={(e) => {
            setStartDateStr(e.target.value);
          }}
        />
        <label for="endDate">Left flat on:</label>
        <input
          type="date"
          id="endDate"
          value={endDateStr}
          onChange={(e) => {
            setEndDateStr(e.target.value);
          }}
        />
        <button type="submit">Update member</button>
        <button onClick={() => navigate("/")}>go to homepage</button>
      </form>
    </>
  );
}

export default EditMember;
