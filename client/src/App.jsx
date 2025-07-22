import Home from "./Pages/Home";
import { Routes, Route } from "react-router-dom";
import Signup from "./Pages/Auth/Signup";
import Navbar from "./components/Navbar";
import Login from "./Pages/Auth/Login";
import Footer from "./components/Footer";
import Contact_Footer from "./components/Contact_Footer";
import ParkingSpots from "./Pages/parkings/Parking_Spots";
import Profile from "./Pages/Profile/Profile";
import ParkingSlots from "./Pages/parkings/parking_slots";
import EditProfile from "./Pages/Profile/editprofile";
import HowItWorks from "./components/Howitworks";
import ParkingHistory from "./Pages/parkings/parkhistoy";
import Payments from "./Pages/Bookings/Payments";
import Bookings from "./Pages/Bookings/Booking";
import DoBookings from "./Pages/Bookings/dobooking";
//import MyBookings from "./Pages/Booking";
import UploadParkingSpots from "./Pages/Parking_Service/upload_parking";
import UploadParkingLocations from "./Pages/Parking_Service/uploadparkinglocations";
import ShowParkings from "./Pages/Parking_Service/showparkings";
import Shownearbyparkings from "./Pages/Parking_Service/shownearbyparkings";
import Verify from "./Pages/Parking_Service/verify";
import MyBookings from "./Pages/Bookings/Booking";
import SlidingLoginSignup from "./Pages/Auth/SlidingLoginSignup";

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
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/park-history" element={<ParkingHistory />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/booking" element={<Bookings />} />
        <Route path="/do-booking" element={<DoBookings />} />
        <Route path="/mybookings" element={<MyBookings />} />
        <Route path="/upload-parking-slots" element={<UploadParkingSpots />} />
        <Route path="/dobooking" element={<DoBookings />} />
        <Route path="/show-parkings-nearby" element={<Shownearbyparkings />} />
        <Route
          path="/upload-parking-location"
          element={<UploadParkingLocations />}
        />
        <Route path="/show-parkings" element={<ShowParkings />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/get-started" element={<SlidingLoginSignup />} />
      </Routes>
      <HowItWorks />
      <Footer />
      <Contact_Footer />
    </>
  );
}

export default App;
