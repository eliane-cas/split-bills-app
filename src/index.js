import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import App from "./App";
import { ExpensesProvider } from "./contexts/ExpensesContext";
import { MembersProvider } from "./contexts/MembersContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ExpensesProvider>
      <MembersProvider>
        <App />
      </MembersProvider>
    </ExpensesProvider>
  </React.StrictMode>
);
