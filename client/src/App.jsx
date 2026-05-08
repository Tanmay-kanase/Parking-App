import React, { useEffect, useState, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";

// 1. KEEP STATIC IMPORTS for core layout, wrappers, and initial load components
import Navbar from "./components/Navbar";
import SkeletonLoader from "./components/SkeletonLoader";
import ProtectedRoute from "./components/ProtectedRoutes";
import { useAuth } from "./context/AuthContext";
import SearchParkings from "./Pages/Parking_Service/showparkingsbylocation";

// 2. USE LAZY IMPORTS for your page/route components
const Home = lazy(() => import("./Pages/Home"));
const ParkingSpots = lazy(() => import("./Pages/parkings/Parking_Spots"));
const Profile = lazy(() => import("./Pages/Profile/Profile"));
const ParkingSlots = lazy(() => import("./Pages/parkings/parking_slots"));
const EditProfile = lazy(() => import("./Pages/Profile/editprofile"));
const ParkingHistory = lazy(() => import("./Pages/parkings/parkhistoy"));
const Payments = lazy(() => import("./Pages/Bookings/Payments"));
const Bookings = lazy(() => import("./Pages/Bookings/Booking"));
const DoBookings = lazy(() => import("./Pages/Bookings/dobooking"));
const UploadParkingSpots = lazy(
  () => import("./Pages/Parking_Service/upload_parking"),
);
const UploadParkingLocations = lazy(
  () => import("./Pages/Parking_Service/uploadparkinglocations"),
);
const ShowParkings = lazy(() => import("./Pages/Parking_Service/showparkings"));
const Shownearbyparkings = lazy(
  () => import("./Pages/Parking_Service/shownearbyparkings"),
);
const Verify = lazy(() => import("./Pages/Parking_Service/verify"));
const Admin = lazy(() => import("./Pages/Admin/Admin"));
const Signup = lazy(() => import("./Pages/Auth/Signup"));
const Signin = lazy(() => import("./Pages/Auth/Signin"));
const SystemArchitecture = lazy(
  () => import("./Pages/Architecture/SystemArchitecture"),
);
const Demo = lazy(() => import("./Pages/Auth/Demo"));
const PaymentsPage = lazy(() => import("./Pages/Paments/Payments"));

function App() {
  const { user, loading } = useAuth();

  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [darkMode]);

  if (loading) {
    return (
      <>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <SkeletonLoader />
      </>
    );
  }

  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* 3. WRAP ROUTES IN SUSPENSE with your fallback UI */}
      <Suspense fallback={<SkeletonLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/parking-spots" element={<ParkingSpots />} />
          <Route path="/parking-slots" element={<ParkingSlots />} />
          <Route path="/park-history" element={<ParkingHistory />} />
          <Route path="/show-parkings" element={<ShowParkings />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/arch" element={<SystemArchitecture />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/searchParking" element={<SearchParkings />} />

          {/* Protected Routes - Any Authenticated User */}
          <Route
            path="/verify"
            element={
              <ProtectedRoute allowedRoles={["admin", "parking_owner"]}>
                <Verify />
              </ProtectedRoute>
            }
          />
          <Route
            path="/show-parkings-nearby"
            element={
              <ProtectedRoute allowedRoles={["admin", "user", "parking_owner"]}>
                <Shownearbyparkings />
              </ProtectedRoute>
            }
          />
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
            path="/payments"
            element={
              <ProtectedRoute allowedRoles={["parking_owner", "admin"]}>
                <PaymentsPage />
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
      </Suspense>
    </>
  );
}

export default App;
