import React, { useState, useEffect, useContext } from "react";
import SplittingFunction from "./SplittingFunction";
import { db } from "./firebase";

import {
  getDocs,
  getDoc,
  collection,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ExpensesContext } from "../contexts/ExpensesContext";
import { useNavigate } from "react-router-dom";

const ExpensesListdb = collection(db, "expenses");

const Split = () => {
  const { storedExpenses, triggerRefresh } = useContext(ExpensesContext);
  const [amountPaidPerUser, setAmountPaidPerUser] = useState({});
  const [amountOwedPerUser, setAmountOwedPerUser] = useState({});
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
      const localAmountPaidPerUser = {};

      storedExpenses.forEach((expense) => {
        if (!localAmountPaidPerUser[expense.Payer]) {
          localAmountPaidPerUser[expense.Payer] = +expense.Amount;
        } else {
          localAmountPaidPerUser[expense.Payer] += +expense.Amount;
        }
      });

      await Promise.all(
        Object.entries(localAmountPaidPerUser).map(async ([userId, paid]) => {
          const memberName = await getUserName(userId);
          localAmountPaidPerUser[memberName] = +paid.toFixed(2);
          delete localAmountPaidPerUser[userId];
        })
      );

      setAmountPaidPerUser(localAmountPaidPerUser);

      // 2. Calculate what each user owes
      const localAmountOwedPerUser = {};
      storedExpenses.forEach((expense) => {
        Object.entries(expense.Shares).map(([user, share]) => {
          if (!localAmountOwedPerUser[user]) {
            localAmountOwedPerUser[user] = +share;
          } else {
            localAmountOwedPerUser[user] += +share;
          }
        });
      });

      await Promise.all(
        Object.entries(localAmountOwedPerUser).map(async ([userId, paid]) => {
          const memberName = await getUserName(userId);
          localAmountOwedPerUser[memberName] = +paid.toFixed(2);
          delete localAmountOwedPerUser[userId];
        })
      );
      setAmountOwedPerUser(localAmountOwedPerUser);

      // 3. Calculate total for each user

      const localTotalPerUser = {};
      Object.keys(localAmountOwedPerUser).forEach((user) => {
        const paid = localAmountPaidPerUser[user] || 0;
        const owed = localAmountOwedPerUser[user] || 0;
        localTotalPerUser[user] = +(paid - owed).toFixed(2);
      });

      setTotalPerUser(localTotalPerUser);
      console.log("totals", localTotalPerUser);
    };
    AmountsPerUser();
  }, [storedExpenses]);

  return (
    <div>
      Split
      <div>
        <p>What members have paid</p>
        {Object.entries(amountPaidPerUser).map(([user, value]) => (
          <li key={user}>
            {user} has paid {value}€
          </li>
        ))}
        <p>What members owe</p>
        {Object.entries(amountOwedPerUser).map(([user, value]) => (
          <li key={user}>
            {user} owes {value}€
          </li>
        ))}
      </div>
      <div>
        <p>Totals</p>
        {Object.entries(totalPerUser).map(([user, value]) => (
          <li key={user}>
            {user}: {value}€
          </li>
        ))}
      </div>
      <SplittingFunction totalPerUser={totalPerUser} />
    </div>
  );
};

export default Split;
