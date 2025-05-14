import React from "react";
import { useParams } from "react-router-dom";
import { ExpensesProvider } from "../contexts/ExpensesContext";
import { MembersProvider } from "../contexts/MembersContext";
import GroupHomePage from "../components/GroupHomePage";

const GroupHomePageWrapper = () => {
  const { groupId } = useParams();

  return (
    <ExpensesProvider activeGroupId={groupId}>
      <MembersProvider activeGroupId={groupId}>
        <GroupHomePage groupId={groupId} />
      </MembersProvider>
    </ExpensesProvider>
  );
};

export default GroupHomePageWrapper;
