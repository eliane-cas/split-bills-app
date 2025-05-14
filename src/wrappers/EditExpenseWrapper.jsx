import React from "react";
import { useParams } from "react-router-dom";
import { ExpensesProvider } from "../contexts/ExpensesContext";
import { MembersProvider } from "../contexts/MembersContext";
import EditExpense from "../components/EditExpense";

const EditExpenseWrapper = () => {
  const { groupId } = useParams();

  return (
    <ExpensesProvider activeGroupId={groupId}>
      <MembersProvider activeGroupId={groupId}>
        <EditExpense />
      </MembersProvider>
    </ExpensesProvider>
  );
};

export default EditExpenseWrapper;
