import { db } from "./firebase";
import React, { useContext, useState } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { MembersContext } from "../contexts/MembersContext";
import { useNavigate } from "react-router-dom";
import { formatDateForDisplay } from "../utilities/dateUtils";
import { AuthContext } from "../contexts/AuthContext";

function MembersList() {
  const navigate = useNavigate();
  const { storedMembers, triggerRefresh } = useContext(MembersContext);
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser.uid);

  console.log(storedMembers);

  const deleteMember = async (item) => {
    await deleteDoc(doc(db, "members", item.memberId));
    console.log("deleted member", item);
  };

  const claimMember = async (item) => {
    await updateDoc(doc(db, "members", item.memberId), {
      linkedUser: currentUser.uid,
    });
    alert("Member claimed!");
  };

  const userHasClaimedMember = storedMembers.some(
    (m) => m.linkedUser === currentUser.uid
  );
  console.log(userHasClaimedMember);
  console.log(currentUser);

  return (
    <div>
      <h6>Members List</h6>
      <div>
        {storedMembers.map((item, index) => (
          <div key={index}>
            <li>
              Name: {item.Name}
              {item.linkedUser === currentUser.uid ? (
                <b> (me!)</b>
              ) : item.linkedUser !== null &&
                item.linkedUser !== currentUser.uid ? (
                <b> claimed!</b>
              ) : !userHasClaimedMember ? (
                <button onClick={() => claimMember(item)}>claim</button>
              ) : null}
            </li>
            <li>Entered flat on: {formatDateForDisplay(item.StartDate)}</li>
            {item.EndDate && (
              <li>Left flat on: {formatDateForDisplay(item.EndDate)}</li>
            )}
            {!item.EndDate && <li>Still lives in flat!</li>}

            <button onClick={() => navigate(`/editmember/${item.memberId}`)}>
              edit
            </button>
            <button onClick={() => deleteMember(item)}>delete</button>
            <hr></hr>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MembersList;
