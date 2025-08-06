import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  Car,
  ParkingCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { storage } from "../../config/firebase"; // Assuming firebase config is here
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // Assuming AuthContext is correctly set up

const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Assuming setUser is available from AuthContext

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "user", // Default role
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0); // 0: too short, 1: weak, 2: medium, 3: strong

  // OTP and Email Verification States
  const [otpVisible, setOtpVisible] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false); // Renamed from isSending to avoid conflict

  // Image Upload States
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUploading, setImageUploading] = useState(false);

  // General Loading and Error States
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState(""); // Renamed from error to avoid conflict

  // Utility function to display general errors
  const showError = (msg) => {
    setGeneralError(msg);
    setTimeout(() => setGeneralError(""), 5000); // Hide error after 5 seconds
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  // Logic to check password strength
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
  };

  // Get color for password strength indicator
  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-300";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength >= 3) return "bg-green-500";
  };

  // Validate form data before submission
  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle sending OTP
  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    try {
      if (!formData.email) {
        showError("Please enter an email before sending OTP.");
        return;
      }
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/send-otp`,
        { email: formData.email }
      );

      if (res.data.message) {
        setOtpVisible(true);
        showError(""); // Clear previous errors
        alert("OTP sent to your email!");
      }
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to send OTP. Try again."
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle verifying OTP
  const handleVerifyOtp = async () => {
    setLoading(true); // Use general loading for OTP verification as well
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/verify-otp`,
        { email: formData.email, otp }
      );
      if (res.data.verified) {
        setOtpVerified(true);
        setOtpVisible(false);
        showError(""); // Clear previous errors
        alert("✅ Email verified successfully!");
      } else {
        showError("❌ Invalid OTP");
      }
    } catch (error) {
      showError(error.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (Signup)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError("");

    if (!validateForm()) {
      setLoading(false);
      showError("Please correct the errors in the form.");
      return;
    }

    if (!otpVerified) {
      setLoading(false);
      showError("Please verify your email before submitting.");
      return;
    }

    let profileUrl = "";
    const imageFile = e.target.profileImage.files[0]; // Get file from event target

    try {
      if (imageFile) {
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
            (error) => {
              setImageUploading(false);
              reject(error);
            },
            async () => {
              profileUrl = await getDownloadURL(uploadTask.snapshot.ref);
              setImageUploading(false);
              resolve();
            }
          );
        });
        console.log("Image uploaded. URL:", profileUrl);
      }
    } catch (uploadError) {
      console.error("Image upload failed:", uploadError);
      showError("Failed to upload profile image.");
      setLoading(false);
      setImageUploading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/signup`,
        {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          photo: profileUrl,
          role: formData.role,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user); // Update AuthContext
      alert("Account created successfully!");
      navigate("/"); // Redirect to home or dashboard
    } catch (error) {
      console.error("Signup error:", error);
      showError(error.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex w-1/2 p-10 flex-col justify-between relative overflow-hidden h-screen">
        <div
          className="absolute top-0 left-0 w-[60%] h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('/a-signup-page-background-image-for-a-sma_gN6HnwfDSH2fEQQ_RqfhDw_pz-tHHK4QLmju4WStH9J4Q.jpg')`,
          }}
        ></div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12 max-h-screen overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl p-8 sm:p-10"
        >
          {/* Mobile-only Header */}
          <div className="flex lg:hidden items-center justify-center space-x-2 mb-6">
            <ParkingCircle className="text-yellow-500" size={32} />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              SmartPark
            </h1>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 text-center">
            Create Your Account
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            Start your stress-free parking journey.
          </p>

          <motion.form onSubmit={handleSubmit} className="space-y-6">
            {generalError && (
              <p className="animate-pulse text-red-500 font-semibold text-sm text-center">
                {generalError}
              </p>
            )}
            {/* Grid for input fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {/* Full Name */}
              <div>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Full Name"
                    required
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-2 text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              {/* Email with OTP */}
              <div>
                <div className="relative flex items-center">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={otpVerified || isSendingOtp}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Email Address"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpVerified || isSendingOtp || !formData.email}
                    className={`ml-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                      ${
                        otpVerified
                          ? "bg-green-500 text-white cursor-default"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }
                    `}
                  >
                    {otpVerified ? (
                      "Verified ✅"
                    ) : isSendingOtp ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
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
                      </span>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="mt-2 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  ></div>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="tel" // Changed to tel for phone numbers
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Phone Number"
                    required
                  />
                </div>
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-4 pr-12 py-3 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 appearance-none"
                  >
                    <option value="user">User</option>
                    <option value="parking_owner">Parking Owner</option>
                  </select>
                  <Car
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>
            </div>{" "}
            {/* End of Grid */}
            {/* OTP visible outside the grid to maintain its full-width behavior */}
            {otpVisible && !otpVerified && (
              <div className="relative flex items-center">
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-200 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading} // Use general loading state
                  className="absolute right-2 px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
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
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </div>
            )}
            {/* Profile Image Upload (kept outside grid for full width) */}
            <div>
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Profile Image (Optional)
              </label>
              <input
                type="file"
                name="profileImage"
                id="profileImage"
                accept="image/*"
                className="block w-full text-sm text-gray-900 bg-gray-200 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer p-2"
              />
              {uploadProgress > 0 && imageUploading && (
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
            </div>
            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="terms"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-300"
              disabled={loading || imageUploading || !otpVerified}
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
                "Sign Up"
              )}
            </motion.button>
            <div className="relative flex items-center justify-center my-6">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              <span className="absolute bg-gray-50 dark:bg-gray-800 px-3 text-gray-500 dark:text-gray-400 text-sm">
                Or continue with
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 transition duration-200"
              onClick={() => {
                // Replace alert with a custom modal or message box in a real app
                console.log("Google Sign-up coming soon!");
              }}
            >
              <img
                src="https://www.svgrepo.com/show/353526/google-icon.svg"
                alt="Google icon"
                className="h-5 w-5"
              />
              Google
            </motion.button>
          </motion.form>

          <p className="mt-8 text-center text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-yellow-600 hover:text-yellow-700 font-semibold transition-colors duration-200 focus:outline-none"
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
