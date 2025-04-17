import React, { useState, useEffect, useContext } from "react";
import SplittingFunction from "./SplittingFunction";
import fb from "./firebase";

import {
  getDocs,
  getDoc,
  collection,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ExpensesContext } from "../contexts/ExpensesContext";
import { useNavigate } from "react-router-dom";

const db = fb.firestore();
const ExpensesListdb = collection(db, "expenses");

const Split = () => {
  // const [storedExpenses, setStoredExpenses] = useState([]);
  const { storedExpenses, triggerRefresh } = useContext(ExpensesContext);
  const [AmountPaidPerUser, setAmountPaidPerUser] = useState({});
  const [AmountOwedPerUser, setAmountOwedPerUser] = useState({});
  const [totalPerUser, setTotalPerUser] = useState({});

  const getUserName = async (userId) => {
    const docRef = doc(db, "members", userId);
    const docSnap = await getDoc(docRef);
    // .exists() => make sure doc exists in firestore
    return docSnap.exists() ? docSnap.data().Name : "Unknown User";
  };

  // CALCULATE AMOUNTS PER USER
  useEffect(() => {
    const AmountsPerUser = async () => {
      // 1. Calculate what each user has paid
      const AmountPaidPerUser = {};

      storedExpenses.forEach((expense) => {
        if (!AmountPaidPerUser[expense.Payer]) {
          AmountPaidPerUser[expense.Payer] = +expense.Amount;
        } else {
          AmountPaidPerUser[expense.Payer] += +expense.Amount;
        }
      });

      await Promise.all(
        Object.entries(AmountPaidPerUser).map(async ([userId, paid]) => {
          const memberName = await getUserName(userId);
          AmountPaidPerUser[memberName] = paid;
          delete AmountPaidPerUser[userId];
        })
      );
      // console.log(AmountPaidPerUser);
      setAmountPaidPerUser(AmountPaidPerUser);

      // 2. Calculate what each user owes
      const AmountOwedPerUser = {};

      storedExpenses.forEach((expense) => {
        Object.entries(expense.Shares).map(([user, share]) => {
          if (!AmountOwedPerUser[user]) {
            AmountOwedPerUser[user] = +share;
          } else {
            AmountOwedPerUser[user] += +share;
          }
        });
      });

      await Promise.all(
        Object.entries(AmountOwedPerUser).map(async ([userId, paid]) => {
          const memberName = await getUserName(userId);
          AmountOwedPerUser[memberName] = paid;
          delete AmountOwedPerUser[userId];
        })
      );
      setAmountOwedPerUser(AmountOwedPerUser);
      console.log(AmountOwedPerUser);
    };

    // 3. Calculate total for each user
    const totalPerUser = {};
    Object.keys(AmountPaidPerUser).forEach((user) => {
      const paid = AmountPaidPerUser[user] || 0;
      const owed = AmountOwedPerUser[user] || 0;
      totalPerUser[user] = paid - owed;
    });

    setTotalPerUser(totalPerUser);
    console.log("totals", totalPerUser);

    AmountsPerUser();
  }, [storedExpenses]);

  return (
    <div>
      Split
      <div>
        <p>What members have paid</p>
        {Object.entries(AmountPaidPerUser).map(([user, value]) => (
          <li key={user}>
            {user} has paid {value}€
          </li>
        ))}
        <p>What members owe</p>
        {Object.entries(AmountOwedPerUser).map(([user, value]) => (
          <li key={user}>
            {user} owes {value}€
          </li>
        ))}
      </div>
      <SplittingFunction />
    </div>
  );
};

export default Split;
