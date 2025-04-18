import { useDispatch } from "react-redux";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { loginSuccess } from "../redux/authSlice";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        loginData
      );
      if (response.data.userId) {
        localStorage.setItem("userId", response.data.userId);
        console.log("User logged in with ID:", response.data.userId);
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  const handleSuccess = async (response) => {
    try {
      const { credential } = response;
      const decodedToken = jwtDecode(credential);
      console.log("Decoded User:", decodedToken);

      const userInfo = JSON.parse(atob(credential.split(".")[1]));
      const { name, email, sub: googleUserId, picture } = userInfo;

      const userData = { name, email, userId: googleUserId, photo: picture };
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/google-signup`,
        userData
      );

      console.log("User logged in:", data);
      localStorage.setItem("userId", data.userId);

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#faf5d7]">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-black text-center mb-6">
          Welcome Back
        </h2>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            placeholder="Enter your email"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            placeholder="Enter your password"
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-md transition"
        >
          Sign In
        </button>

        {/* Forgot Password & Signup */}
        <div className="text-center mt-4">
          <a href="#" className="text-sm text-yellow-500 hover:underline">
            Forgot Password?
          </a>
        </div>

        {/* Google Login */}
        <div className="w-full px-4 py-2">
          <GoogleOAuthProvider clientId="543095501152-ijjcpgtomrp7lsmc7rba2mpujmtirh24.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log("Login Failed")}
            />
          </GoogleOAuthProvider>
        </div>

        {/* Signup Link */}
        <div className="text-center mt-2 text-gray-600">
          <p>Don't have an account?</p>
          <a
            href="signup"
            className="text-yellow-500 font-semibold hover:underline"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
