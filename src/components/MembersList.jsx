import fb from "./firebase";
import React, { useState } from "react";
import { getDocs, collection } from "firebase/firestore";

const db = fb.firestore();
const MembersListdb = collection(db, "members");

function MembersList() {
  const [storedMembers, setStoredMembers] = useState([]);

  const fetchDataFromFirestore = async () => {
    const querySnapshot = await getDocs(MembersListdb);
    const temporaryArr = [];
    querySnapshot.forEach((doc) => {
      temporaryArr.push(doc.data());
    });
    setStoredMembers(temporaryArr);
  };
  fetchDataFromFirestore();

  return (
    <div>
      <h6>Members List</h6>
      <div>
        {storedMembers.map((item, index) => (
          <div key={index}>
            <li>Name: {item.Name}</li>
            <li>Entered flat on: {item.StartDate}</li>
            {item.EndDate && <li>Left flat on: {item.EndDate}</li>}
            {!item.EndDate && <li>still lives in flat!</li>}
            <hr></hr>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MembersList;
