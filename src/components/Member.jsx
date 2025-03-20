import React from "react";

const Member = () => {
  const member1 = {
    name: "Eliane",
    startDate: "01-09-2022",
    endDate: "",
  };
  const member2 = {
    name: "Stef",
    startDate: "01-09-2022",
    endDate: "",
  };
  const member3 = {
    name: "Ixchel",
    startDate: "01-09-2022",
    endDate: "",
  };

  const members = [member1, member2, member3];

  return (
    <>
      {members.map((member) => {
        <div>
          <h2>{member.name}</h2>
          <li>{member.startDate}</li>
          <li>{member.endDate}</li>
        </div>;
      })}
    </>
  );
};

export default Member;
