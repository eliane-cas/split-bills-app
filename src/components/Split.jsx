import React, { useState, useEffect, useContext } from "react";
import SplittingFunction from "./SplittingFunction";

import { ExpensesContext } from "../contexts/ExpensesContext";
import { MembersContext } from "../contexts/MembersContext";
import { useNavigate } from "react-router-dom";

const Split = () => {
  const { storedExpenses, triggerRefresh } = useContext(ExpensesContext);
  const { members } = useContext(MembersContext);

  const [amountPaidPerUser, setAmountPaidPerUser] = useState({});
  const [amountOwedPerUser, setAmountOwedPerUser] = useState({});
  const [totalPerUser, setTotalPerUser] = useState({});

  const getUserName = (userId) => {
    const member = members.find((m) => m.id === userId);
    return member ? member.Name : "Unknown User";
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

      Object.entries(localAmountPaidPerUser).map(async ([userId, paid]) => {
        const memberName = await getUserName(userId);
        localAmountPaidPerUser[memberName] = +paid.toFixed(2);
        delete localAmountPaidPerUser[userId];
      });
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

      Object.entries(localAmountOwedPerUser).map(async ([userId, paid]) => {
        const memberName = await getUserName(userId);
        localAmountOwedPerUser[memberName] = +paid.toFixed(2);
        delete localAmountOwedPerUser[userId];
      });
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
  }, [storedExpenses, members]);

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
