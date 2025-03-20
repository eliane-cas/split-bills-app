import "./css/App.css";
import Expenses from "./components/Expenses";
import Members from "./components/Members";
import Split from "./components/Split";
import AddExpense from "./components/addExpense";
import ExpensesList from "./components/ExpensesList";

function App() {
  return (
    <div className="App">
      <header>Split Bills Apps</header>
      <Members />
      <Expenses />
      <ExpensesList />
      <AddExpense />
      <Split />
    </div>
  );
}

export default App;
