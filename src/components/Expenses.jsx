import React from "react";

const Expenses = () => {
  const expenses = [100, 75, 43, 500];

  return (
    <div>
      Expenses
      <ul>
        {expenses.map((expense) => {
          <li>{expense}</li>;
        })}
      </ul>
    </div>
  );
};

export default Expenses;
