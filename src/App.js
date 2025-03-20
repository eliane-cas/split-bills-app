import "./css/App.css";
import Expenses from "./components/Expenses";
import Members from "./components/Members";
import Split from "./components/Split";

function App() {
  return (
    <div className="App">
      <header>Split Bills App</header>
      <Members />
      <Expenses />
      <Split />
    </div>
  );
}

export default App;
