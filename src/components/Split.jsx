import React, { useState, useEffect, useContext } from "react";
import SplittingFunction from "./SplittingFunction";

import { ExpensesContext } from "../contexts/ExpensesContext";
import { MembersContext } from "../contexts/MembersContext";
import { useNavigate } from "react-router-dom";

const Split = () => {
  const { storedExpenses, triggerRefresh } = useContext(ExpensesContext);
  const { storedMembers } = useContext(MembersContext);

  const [amountPaidPerUser, setAmountPaidPerUser] = useState({});
  const [amountOwedPerUser, setAmountOwedPerUser] = useState({});
  const [totalPerUser, setTotalPerUser] = useState({});

  const getUserName = (userId) => {
    const member = storedMembers.find((m) => m.memberId === userId);
    console.log("getUserName called for:", userId, "Found member:", member);

    return member ? member.Name : "Unknown User";
  };

  console.log("stored storedMembers", storedMembers);
  console.log(" expenses", storedExpenses);

  // CALCULATE AMOUNTS PER USER
  useEffect(() => {
    if (!storedMembers || !storedExpenses) return;
    if (storedMembers.length === 0 || storedExpenses.length === 0) return;

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

      const paidWithNames = {};
      for (const [userId, paid] of Object.entries(localAmountPaidPerUser)) {
        const memberName = getUserName(userId);
        paidWithNames[memberName] = +paid.toFixed(2);
      }

      setAmountPaidPerUser(paidWithNames);

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

      const owedWithNames = {};
      for (const [userId, owed] of Object.entries(localAmountOwedPerUser)) {
        const memberName = getUserName(userId);
        owedWithNames[memberName] = +owed.toFixed(2);
      }

      setAmountOwedPerUser(owedWithNames);

      // get all users
      const allUsers = new Set([
        ...Object.keys(paidWithNames),
        ...Object.keys(owedWithNames),
      ]);

      // 3. Calculate total for each user
      const localTotalPerUser = {};
      allUsers.forEach((user) => {
        const paid = paidWithNames[user] || 0;
        const owed = owedWithNames[user] || 0;
        localTotalPerUser[user] = +(paid - owed).toFixed(2);
      });

      setTotalPerUser(localTotalPerUser);
      console.log("totals", localTotalPerUser);
    };
    AmountsPerUser();
  }, [storedExpenses, storedMembers]);

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
