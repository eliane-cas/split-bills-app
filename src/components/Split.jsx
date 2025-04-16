import React, { useState, useEffect } from "react";
import SplittingFunction from "./SplittingFunction";
import fb from "./firebase";

import {
  getDocs,
  getDoc,
  collection,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const db = fb.firestore();
const ExpensesListdb = collection(db, "expenses");

const Split = () => {
  const [storedExpenses, setStoredExpenses] = useState([]);
  const [AmountPaidPerUser, setAmountPaidPerUser] = useState({});
  const [AmountOwedPerUser, setAmountOwedPerUser] = useState({});

  const getUserName = async (userId) => {
    const docRef = doc(db, "members", userId);
    const docSnap = await getDoc(docRef);
    // .exists() => make sure doc exists in firestore
    return docSnap.exists() ? docSnap.data().Name : "Unknown User";
  };

  useEffect(() => {
    const fetchExpensesFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(ExpensesListdb);
        const expenses = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          expenseId: doc.id,
        }));

        setStoredExpenses(expenses);
        // console.log(storedExpenses);
      } catch (error) {
        console.error("Error fetching expense list:", error);
      }
    };
    fetchExpensesFromFirestore();
    // console.log(storedExpenses);
  }, []);

  useEffect(() => {
    const AmountsPerUser = async () => {
      // Calculate what each user has paid
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

      // Calculate what each user owes
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
      // console.log(AmountOwedPerUser);
    };

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
