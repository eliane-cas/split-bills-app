import "./css/App.css";

import React, { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

// Components
import Home from "./pages/Home";
import EditMember from "./components/EditMember";
import EditExpense from "./components/EditExpense";
import SignUpLoginInPage from "./pages/Login";
// import JoinCreateGroup from "./components/JoinCreateGroup";
import MyGroups from "./components/MyGroups";
import CreateGroup from "./components/CreateGroup";
import JoinGroup from "./components/JoinGroup";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? children : <Navigate to="/signuplogin" />;
};

function App() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/signuplogin" element={<SignUpLoginInPage />} />

          {/* PRIVATE ROUTES */}
          <Route
            path="/mygroups"
            element={
              <PrivateRoute>
                <MyGroups />
              </PrivateRoute>
            }
          />
          <Route
            path="/joingroup"
            element={
              <PrivateRoute>
                <JoinGroup />
              </PrivateRoute>
            }
          />
          <Route
            path="/creategroup"
            element={
              <PrivateRoute>
                <CreateGroup />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/editmember/:firebaseId"
            element={
              <PrivateRoute>
                <EditMember />
              </PrivateRoute>
            }
          />
          <Route
            path="/editexpense/:firebaseId"
            element={
              <PrivateRoute>
                <EditExpense />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
