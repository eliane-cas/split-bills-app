import "./css/App.css";

import Home from "./pages/Home";
import EditMember from "./components/EditMember";
import EditExpense from "./components/EditExpense";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editmember/:firebaseId" element={<EditMember />} />
          <Route path="/editexpense/:firebaseId" element={<EditExpense />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
