import React, { useEffect } from "react";
import { storage } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { useState } from "react";
import { uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const SignUpForm = () => {
  const [otpVisible, setOtpVisible] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const buttonClasses = `w-full text-white bg-[#03C9D7] hover:bg-[#039BAB] focus:ring-4 focus:outline-none 
    focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all 
    duration-200 transform hover:scale-[1.02] hover:shadow-md`;

  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const { setUser, fetchUser } = useAuth();
  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 5000); // Hide error after 5 seconds
  };

  const handleSendOtp = async () => {
    setIsSending(true);
    try {
      if (!email) {
        setError("Please enter an email before sending OTP.");
        return;
      }
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/send-otp`,
        {
          email: email,
        }
      );
      console.log(res);

      if (res.data.message) {
        setOtpVisible(true);
        setError("");
        alert("OTP sent to your email!");
        setIsSending(false);
      }
    } catch (error) {
      setError("Failed to send OTP. Try again.", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
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
        setOtpVisible(false);
        setError("");
        alert("✅ Email verified successfully!");
      } else {
        setError("❌ Invalid OTP");
      }
    } catch (error) {
      setError("Verification failed.", error);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setError("");

      const formData = new FormData(e.target);
      const fullName = formData.get("fullName");
      const email = formData.get("email");
      const password = formData.get("password");
      const confirmPassword = formData.get("confirmPassword");
      const imageFile = formData.get("profileImage");
      const phone = formData.get("phone");
      const role = formData.get("role");

      console.log("Image file:", imageFile);

      e.preventDefault();

      if (password.length < 8) {
        showError("Password must be at least 8 characters.");
        return;
      }
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(phone)) {
        showError("Mobile number must be exactly 10 digits.");
        return;
      }

      let profileUrl = "";

      try {
        if (imageFile) {
          try {
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
                (error) => reject(error),
                async () => {
                  profileUrl = await getDownloadURL(uploadTask.snapshot.ref);
                  setImageUploading(false);
                  resolve();
                }
              );
            });
            console.log("Image uploaded. URL:", profileUrl);
          } catch (uploadError) {
            console.error("Image upload failed:", uploadError);
          }
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }

      // if (!otpVerified) {
      //   setError("Please verify your email before submitting.");
      //   setLoading(false);
      //   return;
      // }

      console.log("Going to hit the backend");
      console.log({
        name: fullName,
        email,
        phone,
        password,
        photo: profileUrl,
        role,
      });
      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/signup`,
          {
            name: fullName,
            email,
            phone,
            password,
            photo: profileUrl,
            role,
          }
        );
        console.log("Request hitted!!!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        await setUser(JSON.stringify(res.data.user));
        setLoading(false);
        navigate("/");
      } catch (error) {
        console.error("Signup error:", error);
        setError(error.response?.data?.message || "Signup failed.");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full sm:grid-cols-1  max-w-md bg-white rounded-lg shadow-2xl md:mt-0 xl:p-0 border border-gray-200 mx-auto px-4">
      <div className="p-6 space-y-6 md:space-y-7 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-backgroundColor md:text-2xl text-center">
          Create Account
          <p className="text-sm font-normal text-gray-500 mt-1">
            Sign up to get started
          </p>
        </h1>

        <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 md:gap-6">
            {error && (
              <p className="animate-pulse text-red-400 font-semibold text-sm mb-2">
                {error}
              </p>
            )}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
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
                className="bg-[#d5f2ec] border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-brightColor focus:border-brightColor block w-full pl-10 p-3 transition-all duration-200 shadow-sm"
                placeholder="Full name"
                required
              />
            </div>

            <div className="relative">
              <label
                className="text-sm text-gray-600 block mb-1"
                htmlFor="profileImage"
              >
                Profile Image
              </label>
              <input
                type="file"
                name="profileImage"
                id="profileImage"
                accept="image/*"
                className="block w-full text-sm text-gray-900 bg-[#d5f2ec] border border-gray-300 rounded-lg cursor-pointer p-2"
              />
            </div>

            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <p className="text-xs text-gray-500 mt-1">
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}

            <div className="flex bg-[#d5f2ec] border rounded-2xl border-gray-300 justify-between items-center gap-2 ">
              <div className="relative w-full  ">
                <div className="absolute  inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
                  <svg
                    className="w-5 h-5 text-gray-500"
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
                  disabled={otpVerified}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#d5f2ec] border-l-0 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-brightColor focus:border-brightColor block w-full pl-10 p-3"
                  placeholder="Email address"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpVerified || isSending}
                className={`ml-2 text-sm font-medium rounded-lg flex items-center gap-2 ${
                  otpVerified
                    ? "bg-green-500 text-white cursor-default"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {otpVerified ? (
                  "Verified ✅"
                ) : isSending ? (
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
            {otpVisible && !otpVerified && (
              <div className="flex items-center bg-[#d5f2ec] border rounded-2xl border-gray-300 gap-3 mt-3">
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1 bg-[#d5f2ec] text-gray-900 sm:text-sm rounded-lg p-3"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isSending}
                  className="ml-2 text-sm font-medium px-1 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  {isSending ? (
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
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="password"
                name="password"
                id="password"
                className="bg-[#d5f2ec] border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-brightColor focus:border-brightColor block w-full pl-10 p-3 transition-all duration-200 shadow-sm"
                placeholder="Password"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="bg-[#d5f2ec] border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-brightColor focus:border-brightColor block w-full pl-10 p-3 transition-all duration-200 shadow-sm"
                placeholder="Confirm password"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.586a1 1 0 01.707.293l2.414 2.414a1 1 0 010 1.414L10.414 8a1 1 0 000 1.414l4.172 4.172a1 1 0 001.414 0l1.879-1.879a1 1 0 011.414 0l2.414 2.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-1c-8.837 0-16-7.163-16-16V5z"
                  />
                </svg>
              </div>
              <input
                type="number"
                name="phone"
                id="phone"
                className="bg-[#d5f2ec] border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-brightColor focus:border-brightColor block w-full pl-10 p-3 transition-all duration-200 shadow-sm"
                placeholder="phone"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A4 4 0 017.757 16h8.486a4 4 0 012.636 1.804M15 11a3 3 0 10-6 0 3 3 0 006 0z"
                  />
                </svg>
              </div>
              <select
                name="role"
                id="role"
                className="bg-[#d5f2ec] border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-brightColor focus:border-brightColor block w-full pl-9 pr-3 py-3  transition-all duration-200 shadow-sm"
                required
              >
                <option value="" disabled selected>
                  Select role
                </option>
                <option value="user">User</option>
                <option value="parking_owner">Parking Owner</option>
              </select>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                aria-describedby="terms"
                type="checkbox"
                className="w-4 h-4  rounded bg-gray-50 "
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="terms"
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="text-brightColor hover:text-brightColor font-medium"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-brightColor hover:text-brightColor font-medium"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className={buttonClasses}
            disabled={loading || imageUploading}
          >
            {imageUploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin text-white"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Uploading Image...
              </span>
            ) : loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin text-white"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Registering User...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4 border-t border-gray-100 pt-4">
          Already have an account?{" "}
          <a href="get-started" className="text-black none">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
