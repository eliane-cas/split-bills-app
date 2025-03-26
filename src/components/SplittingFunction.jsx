import fb from "./firebase";
import React, { useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
const db = fb.firestore();
const ExpensesListdb = collection(db, "expenses");
const MembersListdb = collection(db, "members");

function SplittingFunction() {
  const [storedExpenses, setStoredExpenses] = useState([]);
  const [storedMembers, setStoredMembers] = useState([]);

  const fetchDataFromFirestore = async () => {
    const querySnapshot = await getDocs(ExpensesListdb);
    const temporaryArr = [];
    querySnapshot.forEach((doc) => {
      let tempObj = doc.data();
      tempObj.docId = doc.id;
      temporaryArr.push(tempObj);
      // console.log(doc.id);
    });
    setStoredExpenses(temporaryArr);
  };
  fetchDataFromFirestore();

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

  //console.log(storedMembers, "stored Members");

  // storedMembers.map((item) => console.log(item.Name));

  const SplittingBills = () => {
    storedExpenses.map((item) => {
      //console.log(item.Amount);
      //console.log(item.Payers.length);
      const splitAmount = item.Amount / item.Payers.length;
      //console.log(splitAmount);
      if (item.Payers.includes("Hello")) {
        //console.log("include in hello");
      }
    });
  };

  SplittingBills();

  return <div>Splitting Function</div>;
}

export default SplittingFunction;
