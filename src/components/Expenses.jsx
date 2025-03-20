import React from "react";
import AddExpense from "./addExpense";
import ExpensesList from "./ExpensesList";

const Expenses = () => {
  const expenses = [100, 75, 43, 500];

  return (
    <div>
      Expenses
      <AddExpense />
      <ExpensesList />
    </div>
  );
};

export default Expenses;
