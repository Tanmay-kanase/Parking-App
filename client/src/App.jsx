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
import EditProfile from "./Pages/editprofile";
import HowItWorks from "./components/Howitworks";
import ParkingHistory from "./Pages/parkhistoy";
import Payments from "./Pages/Payments";
import Bookings from "./Pages/Booking";
import DoBookings from "./Pages/dobooking";
import MyBookings from "./Pages/Booking";

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
        <Route path="/edit-profile/:userId" element={<EditProfile />} />
        <Route path="/park-history" element={<ParkingHistory />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/booking" element={<Bookings />} />
        <Route path="/do-booking" element={<DoBookings />} />
        <Route path="/mybookings" element={<MyBookings />} />
      </Routes>
      <HowItWorks />
      <Footer />
      <Contact_Footer />
    </>
  );
}

export default App;
