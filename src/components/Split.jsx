import React, { useState } from "react";
import SplittingFunction from "./SplittingFunction";
import fb from "./firebase";

import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const db = fb.firestore();
const MembersListdb = collection(db, "members");

const Split = () => {
  const [storedMembers, setStoredMembers] = useState([]);

  const fetchDataFromFirestore = async () => {
    const querySnapshot = await getDocs(MembersListdb);
    const temporaryArr = [];
    querySnapshot.forEach((doc) => {
      let tempObj = doc.data();
      tempObj.MemberId = doc.id;
      temporaryArr.push(tempObj);
    });
    setStoredMembers(temporaryArr);
  };
  fetchDataFromFirestore();

  // console.log("split", storedMembers);

  // console.log("stored Expenses", typeof storedExpenses);

  return (
    <div>
      Split
      {storedMembers.map((item, index) => (
        <div key={index}>
          <p>{item.Name}</p>
          <p>Owes:</p>
          {/* {item.Bills.map((bill, index) => (
            <div key={index}>{bill}€</div>
          ))}
          <div>
            Total:{" "}
            {item.Bills.reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              0
            )}
            €
          </div> */}
        </div>
      ))}
      <SplittingFunction />
    </div>
  );
};

export default Split;
