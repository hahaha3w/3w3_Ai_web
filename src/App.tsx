import { Outlet } from "react-router";
import "./App.css";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className="flex flex-col gap-3 justify-start w-full h-full">
      <NavBar></NavBar>
      <Outlet></Outlet>
    </div>
  );
}

export default App;
