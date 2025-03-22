import Expenses from "../components/Expenses";
import Members from "../components/Members";
import Split from "../components/Split";

import React from "react";

function Home() {
  return (
    <div>
      <header>Split Bills App</header>
      <Members />
      <Expenses />
      <Split />
    </div>
  );
}

export default Home;
