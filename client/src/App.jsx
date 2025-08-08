import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Navbar from "./components/Navbar";
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
import UploadParkingSpots from "./Pages/Parking_Service/upload_parking";
import UploadParkingLocations from "./Pages/Parking_Service/uploadparkinglocations";
import ShowParkings from "./Pages/Parking_Service/showparkings";
import Shownearbyparkings from "./Pages/Parking_Service/shownearbyparkings";
import Verify from "./Pages/Parking_Service/verify";
import Admin from "./Pages/Admin/Admin";
import SkeletonLoader from "./components/SkeletonLoader";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";
import Signup from "./Pages/Auth/Signup";
import Signin from "./Pages/Auth/Signin";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        <Navbar />
        <SkeletonLoader />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/parking-spots" element={<ParkingSpots />} />
        <Route path="/parking-slots" element={<ParkingSlots />} />
        <Route path="/park-history" element={<ParkingHistory />} />
        <Route path="/show-parkings" element={<ShowParkings />} />
        <Route path="/show-parkings-nearby" element={<Shownearbyparkings />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="signup" element={<Signup />} />

        {/* Protected Routes - Any Authenticated User */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["admin", "user", "parking_owner"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute allowedRoles={["admin", "user", "parking_owner"]}>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - User Only */}
        <Route
          path="/booking"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Bookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/do-booking"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <DoBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mybookings"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Bookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Payments />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Parking Owner and Admin */}
        <Route
          path="/upload-parking-location"
          element={
            <ProtectedRoute allowedRoles={["parking_owner", "admin"]}>
              <UploadParkingLocations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-parking-slots"
          element={
            <ProtectedRoute allowedRoles={["parking_owner", "admin"]}>
              <UploadParkingSpots />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Admin Only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
      <HowItWorks />
      <Footer />
      <Contact_Footer />
    </>
  );
}

export default App;
