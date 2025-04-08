import fb from "./firebase";
import React, { useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const db = fb.firestore();
const MembersListdb = collection(db, "members");

function MembersList() {
  const [storedMembers, setStoredMembers] = useState([]);

  const navigate = useNavigate();

  // put inside a use effect to not endelessly fetch the data from firestore ==>
  const fetchMembersFromFirestore = async () => {
    const querySnapshot = await getDocs(MembersListdb);
    const temporaryArr = [];
    querySnapshot.forEach((doc) => {
      let tempObj = doc.data();
      tempObj.docId = doc.id;
      temporaryArr.push(tempObj);
    });
    setStoredMembers(temporaryArr);
  };
  fetchMembersFromFirestore();

  const deleteMember = async (item) => {
    await deleteDoc(doc(db, "members", item.docId));
    console.log("deleted member", item);
  };

  return (
    <div>
      <h6>Members List</h6>
      <div>
        {storedMembers.map((item, index) => (
          <div key={index}>
            <li>Name: {item.Name}</li>
            <li>Entered flat on: {item.StartDate}</li>
            {item.EndDate && <li>Left flat on: {item.EndDate}</li>}
            {!item.EndDate && <li>Still lives in flat!</li>}

            <button onClick={() => navigate(`/editmember/${item.docId}`)}>
              edit
            </button>
            <button onClick={() => deleteMember(item)}>delete</button>
            <hr></hr>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MembersList;
