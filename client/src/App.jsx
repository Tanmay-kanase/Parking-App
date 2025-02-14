import Home from "./Pages/Home";
import { Routes, Route } from "react-router-dom";
import Signup from "./Pages/Signup";
import Navbar from "./components/Navbar";
import Login from "./Pages/Login";
import Footer from "./components/Footer";
import Contact_Footer from "./components/Contact_Footer";
import ParkingSpots from "./Pages/Parking_Spots";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/parking-spots" element={<ParkingSpots />} />
      </Routes>
      <Footer />
      <Contact_Footer />
      
    </>
  );
}

export default App;
