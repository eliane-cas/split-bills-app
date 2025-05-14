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
import EditMemberWrapper from "./wrappers/EditMemberWrapper";
import EditExpenseWrapper from "./wrappers/EditExpenseWrapper";
import EditExpense from "./components/EditExpense";
import SignUpLoginInPage from "./pages/Login";
import MyGroups from "./components/MyGroups";
import CreateGroup from "./components/CreateGroup";
import JoinGroup from "./components/JoinGroup";
import GroupHomePage from "./components/GroupHomePage";
import EditGroup from "./components/EditGroup";
import GroupHomePageWrapper from "./wrappers/GroupHomePageWrapper";

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
          <Route path="/" element={<Home />} />
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
            path="/groups/:groupId"
            element={
              <PrivateRoute>
                <GroupHomePageWrapper />
              </PrivateRoute>
            }
          />
          <Route
            path="/groups/:groupId/editmember/:firebaseId"
            element={
              <PrivateRoute>
                <EditMemberWrapper />
              </PrivateRoute>
            }
          />
          <Route
            path="/groups/:groupId/editexpense/:firebaseId"
            element={
              <PrivateRoute>
                <EditExpenseWrapper />
              </PrivateRoute>
            }
          />
          <Route
            path="/editgroup/:groupId"
            element={
              <PrivateRoute>
                <EditGroup />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
