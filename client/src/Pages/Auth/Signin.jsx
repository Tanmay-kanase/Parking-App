import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // Changed from useAuth to useAuth based on your SignUpForm
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Signin = () => {
  const { login, setUser } = useAuth(); // fetchUser is not directly used here
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // For local login loading
  const [error, setError] = useState(""); // For general error messages
  const [message, setMessage] = useState(""); // For success/info messages

  const navigate = useNavigate();

  const showError = (msg) => toast.error(msg);
  const showMessage = (msg) => toast.success(msg);

  // Handle traditional email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset previous error
    setMessage("");
    try {
      await login({ email, password }); // Call context login
      showMessage("Login successful! Redirecting...");
      navigate("/"); // Redirect on success
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      showError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth success
  const handleSuccess = async (response) => {
    setError(""); // Reset previous error
    setMessage("");
    let password;
    try {
      const { credential } = response;
      const userInfo = jwtDecode(credential);
      const { name, email: googleEmail, sub: googleUserId, picture } = userInfo;
      console.log(userInfo);

      // Check if user already exists
      const checkRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/email/${googleEmail}`
      );

      const isNewUser = !checkRes?.data?.email;

      if (isNewUser) {
        password = prompt("Set your password (only once):");
        if (!password) {
          alert("Password is required to continue.");
          return;
        }
      }

      const userData = {
        name,
        email: googleEmail, // use the correct variable
        userId: googleUserId,
        photo: picture,
        password, // only for new users
      };

      console.log("checking user Data before hit request ", userData);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/google-login`,
        userData
      );
      console.log(res);
      console.log("success");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      await setUser(res.data.user);
      console.log("User is fetched proceed to home");
      navigate("/");
    } catch (error) {
      showError(error.message);
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-4 font-inter dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-100 mx-auto p-6 md:p-8 transform transition-all duration-300 hover:scale-[1.005] dark:bg-gray-800 dark:border-gray-700">
        <div className="space-y-6 md:space-y-7">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-4xl text-center dark:text-white">
            Welcome Back
            <p className="text-base font-medium text-gray-500 mt-2 dark:text-gray-400">
              Sign in to your account
            </p>
          </h1>

          <form className="space-y-5 md:space-y-6" onSubmit={handleLogin}>
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

            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400 dark:text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
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
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3 shadow-sm transition-all duration-200 placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="Email Address"
                required
              />
            </div>

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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3 shadow-sm transition-all duration-200 placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="remember"
                    className="text-gray-600 cursor-pointer dark:text-gray-400"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:underline transition-colors duration-200 dark:text-blue-400 dark:hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-lg px-6 py-3.5 text-center transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              disabled={loading}
            >
              {loading ? (
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500 font-medium dark:bg-gray-800 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login Button */}
          <div className="w-full">
            <GoogleOAuthProvider clientId="526992097258-an7ps4j6qetf8mcjcd0g0d8deok1lmsf.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() =>
                  showError("Google login failed. Please try again.")
                }
                text="continue_with"
                size="large"
                width="100%"
              />
            </GoogleOAuthProvider>
          </div>

          <p className="text-sm text-center text-gray-600 mt-4 pt-4 border-t border-gray-200 dark:text-gray-400 dark:border-gray-700">
            Don&apos;t have an account?{" "}
            <a
              href="signup"
              className="text-blue-600 hover:underline font-semibold transition-colors duration-200 dark:text-blue-400 dark:hover:underline"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default Signin;
