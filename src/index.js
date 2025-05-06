import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import App from "./App";
import { ExpensesProvider } from "./contexts/ExpensesContext";
import { MembersProvider } from "./contexts/MembersContext";
import { AuthProvider } from "./contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ExpensesProvider>
        <MembersProvider>
          <App />
        </MembersProvider>
      </ExpensesProvider>
    </AuthProvider>
  </React.StrictMode>
);
