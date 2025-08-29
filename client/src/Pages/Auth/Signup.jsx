import React, { useState } from "react";
import { storage } from "../../config/firebase"; // Assuming this path is correct
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Assuming this path is correct

const Signup = () => {
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
      if (res.data.message) {
        setOtpVisible(true);
        showMessage("OTP sent to your email!");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-4 font-inter dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-100 mx-auto p-6 md:p-8 transform transition-all duration-300 hover:scale-[1.005] dark:bg-gray-800 dark:border-gray-700">
        <div className="space-y-6 md:space-y-7">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-4xl text-center dark:text-white">
            Create Your Account
            <p className="text-base font-medium text-gray-500 mt-2 dark:text-gray-400">
              Join us to get started on your journey!
            </p>
          </h1>

          <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
            {/* Error and Message Display */}
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md animate-fade-in-down transition-all duration-300 dark:bg-red-950 dark:border-red-700 dark:text-red-300">
                <p className="font-semibold text-sm">{error}</p>
              </div>
            )}
            {message && (
              <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-md animate-fade-in-down transition-all duration-300 dark:bg-green-950 dark:border-green-700 dark:text-green-300">
                <p className="font-semibold text-sm">{message}</p>
              </div>
            )}

            {/* Full Name Input */}
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

            {/* Profile Image Input */}
            <div className="relative">
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300"
              >
                Profile Image (Optional)
              </label>
              <input
                type="file"
                name="profileImage"
                id="profileImage"
                accept="image/*"
                className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:file:bg-blue-900 dark:file:text-blue-300 dark:hover:file:bg-blue-800"
              />
            </div>

            {/* Upload Progress Bar */}
            {imageUploading && uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <p className="text-xs text-gray-600 mt-1 text-center dark:text-gray-400">
                  {uploadProgress}% Uploaded
                </p>
              </div>
            )}

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

            {/* OTP Input and Verify Button */}
            {otpVisible && !otpVerified && (
              <div className="flex flex-col sm:flex-row bg-gray-50 border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:focus-within:ring-blue-600 dark:focus-within:border-blue-600">
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-grow bg-transparent text-gray-900 sm:text-sm block w-full p-3 placeholder-gray-400 focus:outline-none dark:text-white dark:placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp || isSendingOtp} // Disable if sending or verifying
                  className={`flex-shrink-0 px-4 py-3 sm:py-0 sm:h-auto sm:w-auto text-sm font-medium rounded-r-lg sm:rounded-l-none sm:rounded-r-lg transition-all duration-300
                    ${
                      isVerifyingOtp
                        ? "bg-gray-400 text-white cursor-not-allowed opacity-80 dark:bg-gray-600 dark:opacity-90"
                        : "bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    } flex items-center justify-center gap-2`}
                >
                  {isVerifyingOtp ? (
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

            {/* Password Input */}
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
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="password"
                name="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3 shadow-sm transition-all duration-200 placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="Password"
                required
              />
            </div>

            {/* Confirm Password Input */}
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
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3 shadow-sm transition-all duration-200 placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="Confirm Password"
                required
              />
            </div>

            {/* Phone Number Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400 dark:text-gray-500"
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
                type="tel" // Changed to tel for semantic correctness
                name="phone"
                id="phone"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3 shadow-sm transition-all duration-200 placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="Phone Number (e.g., 1234567890)"
                required
              />
            </div>

            {/* Role Select */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400 dark:text-gray-500"
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
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-3 shadow-sm transition-all duration-200 appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" // appearance-none to remove default arrow
                required
              >
                <option value="" disabled selected className="text-gray-400">
                  Select Your Role
                </option>
                <option value="user">User</option>
                <option value="parking_owner">Parking Owner</option>
              </select>
              {/* Custom arrow for select */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="terms"
                  className="text-gray-600 hover:text-gray-800 cursor-pointer dark:text-gray-400 dark:hover:text-gray-300"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:underline font-medium transition-colors duration-200 dark:text-blue-400 dark:hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:underline font-medium transition-colors duration-200 dark:text-blue-400 dark:hover:underline"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-lg px-6 py-3.5 text-center transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              disabled={
                loading || imageUploading || isSendingOtp || isVerifyingOtp
              }
            >
              {imageUploading ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin text-white"
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
                  Uploading Image... ({uploadProgress}%)
                </>
              ) : loading ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin text-white"
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
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-sm text-center text-gray-600 mt-4 pt-4 border-t border-gray-200 dark:text-gray-400 dark:border-gray-700">
            Already have an account?{" "}
            <a
              href="get-started"
              className="text-blue-600 hover:underline font-semibold transition-colors duration-200 dark:text-blue-400 dark:hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
