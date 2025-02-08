import Home from "./Pages/Home";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "./Pages/Signup";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
