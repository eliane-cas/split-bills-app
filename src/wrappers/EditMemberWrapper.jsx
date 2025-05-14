import React from "react";
import { useParams } from "react-router-dom";
import { ExpensesProvider } from "../contexts/ExpensesContext";
import { MembersProvider } from "../contexts/MembersContext";
import EditMember from "../components/EditMember";

const EditMemberWrapper = () => {
  const { groupId } = useParams();

  return (
    <ExpensesProvider activeGroupId={groupId}>
      <MembersProvider activeGroupId={groupId}>
        <EditMember />
      </MembersProvider>
    </ExpensesProvider>
  );
};

export default EditMemberWrapper;
