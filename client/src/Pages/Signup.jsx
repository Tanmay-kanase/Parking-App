import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, UserCheck } from "lucide-react";
import { FaUser, FaLock, FaKey } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // Send OTP

  const sendOtp = async () => {
    try {
      if (!formData.email) {
        setError("Please enter an email before sending OTP.");
        return;
      }
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/send-otp`,
        {
          email: formData.email,
        }
      );
      console.log(res);

      if (res.data.message) {
        setOtpSent(true);
        setError("");
        alert("OTP sent to your email!");
      }
    } catch (err) {
      setError("Failed to send OTP. Try again.");
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/verify-otp`,
        {
          email: formData.email,
          otp,
        }
      );
      if (res.data.verified) {
        setIsVerified(true);
        setError("");
        alert("✅ Email verified successfully!");
      } else {
        setError("❌ Invalid OTP");
      }
    } catch (err) {
      setError("Verification failed.");
    }
  };

  console.log(otpSent);
  console.log(isVerified);
  console.log(otp);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { confirmPassword, ...userData } = formData; // remove confirmPassword

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/signup`,
        userData
      );
      if (response.data.userId) {
        localStorage.setItem("userId", response.data.userId);
        console.log("User registered with ID:", response.data.userId);
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      setError(
        error.response?.data?.error || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br bg-[#faf5d7]">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-96 text-center">
        <h2 className="text-3xl font-bold text-gray-800 flex justify-center items-center gap-2 mb-6">
          <UserCheck className="text-yellow-500" /> Sign Up
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-500">
            <FaUser className="text-gray-500" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full ml-2 outline-none bg-transparent"
              required
            />
          </div>

          {/* Email Input */}
          <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-500">
            <Mail className="text-gray-500" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full ml-2 outline-none bg-transparent"
              required
            />
          </div>

          {/* Send OTP Button */}
          {!otpSent && (
            <button
              type="button"
              onClick={sendOtp}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md"
            >
              Send OTP to Email
            </button>
          )}

          {/* OTP Input and Verify Button */}
          {otpSent && !isVerified && (
            <>
              <div className="flex items-center border rounded-md px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-yellow-500">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full outline-none bg-transparent"
                  required
                />
              </div>
              <button
                type="button"
                onClick={verifyOtp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 mt-2 rounded-md"
              >
                Verify OTP
              </button>
            </>
          )}

          {/* Phone Input */}
          <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-500">
            <Phone className="text-gray-500" />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full ml-2 outline-none bg-transparent"
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-500">
            <FaKey className="text-gray-500" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full ml-2 outline-none bg-transparent"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-500 mt-4">
            <FaKey className="text-gray-500" />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full ml-2 outline-none bg-transparent"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-500">
            <FaLock className="text-gray-500" />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full ml-2 outline-none bg-transparent cursor-pointer"
            >
              <option value="customer">Customer</option>
              <option value="parking host">Parking Host</option>
            </select>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={!isVerified}
            className={`w-full text-white font-bold py-2 rounded-md transition flex justify-center items-center gap-2 ${
              isVerified
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <UserCheck /> Sign Up
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-4 text-gray-700 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-yellow-600 font-semibold hover:underline"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
