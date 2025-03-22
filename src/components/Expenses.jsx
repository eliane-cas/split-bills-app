import React from "react";
import AddExpense from "./addExpense";
import ExpensesList from "./ExpensesList";

const Expenses = () => {
  return (
    <div>
      Expenses
      <AddExpense />
      <ExpensesList />
    </div>
  );
};

export default Expenses;
