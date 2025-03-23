import Home from "./Pages/Home";
import { Routes, Route } from "react-router-dom";
import Signup from "./Pages/Signup";
import Navbar from "./components/Navbar";
import Login from "./Pages/Login";
import Footer from "./components/Footer";
import Contact_Footer from "./components/Contact_Footer";
import ParkingSpots from "./Pages/Parking_Spots";
import Profile from "./Pages/Profile";
import ParkingSlots from "./Pages/parking_slots";
import ParkingSlots3 from "./Pages/demo";
import EditProfile from "./Pages/editprofile";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/parking-spots" element={<ParkingSpots />} />
        <Route path="/parking-slots" element={<ParkingSlots />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/parkingslot" element={<ParkingSlots3 />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
      <Footer />
      <Contact_Footer />
    </>
  );
}

export default App;
