import React, { useState } from "react";
import { storage } from "../../config/firebase"; // Assuming this path is correct
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Assuming this path is correct

export default function Demo() {
  // State variables
  const [otpVisible, setOtpVisible] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false); // Renamed for clarity
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false); // New state for OTP verification loading
  const [email, setEmail] = useState("");
  const [error, setError] = useState(""); // For general error messages
  const [message, setMessage] = useState(""); // For success/info messages (replaces alerts)

  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false); // For user registration loading
  const [imageUploading, setImageUploading] = useState(false); // For image upload loading

  const { setUser } = useAuth(); // fetchUser is not used in the provided snippet
  const navigate = useNavigate();

  // Function to display error message temporarily
  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 5000); // Hide error after 5 seconds
  };

  // Function to display success/info message temporarily
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000); // Hide message after 5 seconds
  };

  // Handle sending OTP
  const handleSendOtp = async () => {
    if (!email) {
      showError("Please enter an email address.");
      return;
    }
    setIsSendingOtp(true);
    setError("");
    setMessage("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/send-otp`,
        {
          email: email,
        }
      );
      console.log("opt sent", res.otp);
      console.log("opt sent", res.data.otp);
      if (res.data.message) {
        setOtpVisible(true);
        showMessage(`OTP sent to your email! ${res.data.otp}`);
      }
    } catch (err) {
      showError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle verifying OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      showError("Please enter the OTP.");
      return;
    }
    setIsVerifyingOtp(true);
    setError("");
    setMessage("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/verify-otp`,
        {
          email: email,
          otp,
        }
      );
      if (res.data.verified) {
        setOtpVerified(true);
        setOtpVisible(false); // Hide OTP input after verification
        showMessage("✅ Email verified successfully!");
      } else {
        showError("❌ Invalid OTP. Please try again.");
      }
    } catch (err) {
      showError(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle form submission (user signup)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true); // Start loading for registration

    const formData = new FormData(e.target);
    const fullName = formData.get("fullName");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const imageFile = formData.get("profileImage");
    const phone = formData.get("phone");
    const role = formData.get("role");

    // Basic client-side validations
    if (password.length < 8) {
      showError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      setLoading(false);
      return;
    }
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(phone)) {
      showError("Mobile number must be exactly 10 digits.");
      setLoading(false);
      return;
    }

    if (!otpVerified) {
      showError("Please verify your email before creating an account.");
      setLoading(false);
      return;
    }

    let profileUrl = "";

    try {
      if (imageFile && imageFile.name) {
        // Check if a file is actually selected
        setImageUploading(true);
        const imageRef = ref(
          storage,
          `profiles/${Date.now()}-${imageFile.name}`
        );
        const uploadTask = uploadBytesResumable(imageRef, imageFile);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(Math.round(progress));
            },
            (err) => {
              setImageUploading(false);
              reject(err);
            },
            async () => {
              profileUrl = await getDownloadURL(uploadTask.snapshot.ref);
              setImageUploading(false);
              resolve();
            }
          );
        });
      }
    } catch (uploadError) {
      console.error("Image upload failed:", uploadError);
      showError("Failed to upload profile image. Please try again.");
      setImageUploading(false);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/signup`,
        {
          name: fullName,
          email: email, // Use submittedEmail
          phone,
          password,
          photo: profileUrl,
          role,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      await setUser(response.data.user);
      showMessage("Account created successfully! Redirecting...");
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);
      showError(err.response?.data?.message || "Account creation failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    // Main Container
    <div className="container grid grid-cols-1 md:grid-cols-6">
      <div className="bg-red-500 md:col-span-2` grid-cols-1">
        <h6 className="text-4xl p-2 hidden md:block">
          Welocme To Our Smart Parking Application{" "}
        </h6>
        <div className="flex flex-col p-4 items-center gap-4">
          <input
            type="file"
            name="profileImage"
            id="profileImage"
            accept="image/*"
            placeholder=""
            className="rounded-full border w-50 h-50"
          />
          <label>Profile Image</label>
        </div>
      </div>

      <div className="bg-blue-500 md:col-span-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400 dark:text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            name="fullName"
            id="fullName"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3 shadow-sm transition-all duration-200 placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            placeholder="Full Name"
            required
          />
        </div>

        {/* Email Input with OTP functionality */}
        <div className="flex flex-col sm:flex-row bg-gray-50 border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:focus-within:ring-blue-600 dark:focus-within:border-blue-600">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400 dark:text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
            </div>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              disabled={otpVerified || isSendingOtp || isVerifyingOtp}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-gray-900 sm:text-sm block w-full pl-10 pr-3 py-3 placeholder-gray-400 focus:outline-none dark:text-white dark:placeholder-gray-400"
              placeholder="Email Address"
              required
            />
          </div>

          <button
            type="button"
            onClick={handleSendOtp}
            disabled={otpVerified || isSendingOtp || isVerifyingOtp}
            className={`flex-shrink-0 px-4 py-3 sm:py-0 sm:h-auto sm:w-auto text-sm font-medium rounded-r-lg sm:rounded-l-none sm:rounded-r-lg transition-all duration-300
                  ${
                    otpVerified
                      ? "bg-green-600 text-white cursor-not-allowed opacity-80 dark:bg-green-800 dark:opacity-90"
                      : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  } flex items-center justify-center gap-2`}
          >
            {otpVerified ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                Verified
              </>
            ) : isSendingOtp ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  ></path>
                </svg>
                Sending...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </div>
      </div>
      <div className="bg-blue-500">helo</div>
    </div>
  );
}
