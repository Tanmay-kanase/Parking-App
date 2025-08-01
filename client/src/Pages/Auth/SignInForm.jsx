import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import useAuth from "../../context/useAuth";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
const SignInForm = () => {
  const { login, fetchUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const showError = (err) => {
    const message =
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.message ||
      "Something went wrong";
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // reset any previous error
    try {
      await login({ email, password }); // call context login properly
      navigate("/"); // redirect on success
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      showError(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = async (response) => {
    try {
      const { credential } = response;
      const userInfo = jwtDecode(credential);
      const { name, email, sub: googleUserId, picture } = userInfo;

      // Check if user already exists
      const checkRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/email/${email}`
      );

      console.log("Response Checking email exist or not : ", checkRes);

      const isNewUser = !checkRes?.data?.email; // if response is empty or invalid

      let password = "";

      if (isNewUser) {
        password = prompt("Set your password (only once):");
        if (!password) {
          alert("Password is required to continue.");
          return;
        }
      }

      const userData = {
        name,
        email,
        userId: googleUserId,
        photo: picture,
        password, // send only if new
      };

      console.log("checking user Data before hit request ", userData);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/google-login`,
        userData,
        {
          withCredentials: true, // ✅ This is critical
        }
      );
      console.log(res);
      console.log("success");
      await fetchUser();
      console.log("User is fetched proceed to home");
      navigate("/");
    } catch (error) {
      showError(error.message);
      console.error("Google login error:", error);
    }
  };

  const buttonClasses = `w-full text-white bg-[#03C9D7] hover:bg-[#039BAB] focus:ring-4 focus:outline-none 
    focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all 
    duration-200 transform hover:scale-[1.02] hover:shadow-md`;
  const buttonForGFT = `inline-flex w-full justify-center items-center rounded-lg border border-gray-300 bg-white 
    py-2.5 px-4 text-sm font-medium text-gray-500 hover:bg-gray-50 shadow-sm transition-all 
    duration-200 hover:shadow hover:border-gray-400`;
  return (
    <div className="w-full bg-white rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0 border border-gray-100">
      <div className="p-6 space-y-6 md:space-y-7 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-backgroundColor md:text-2xl text-center">
          Welcome Back
          <p className="text-sm font-normal text-gray-500 mt-1">
            Sign in to your account
          </p>
        </h1>

        <form className="space-y-5 md:space-y-6" onSubmit={handleLogin}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
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
              className="bg-[#d5f2ec] border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-brightColor focus:border-brightColor block w-full pl-10 p-3 transition-all duration-200 shadow-sm"
              placeholder="Email address"
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
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#d5f2ec] border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-brightColor focus:border-brightColor block w-full pl-10 p-3 transition-all duration-200 shadow-sm"
              placeholder="Password"
              required
            />
          </div>
          {error && (
            <span className="block text-red-600 text-sm text-center mt-2 animate-pulse">
              {error}
            </span>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  aria-describedby="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded bg-gray-50 "
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="remember"
                  className="text-gray-500  cursor-pointer"
                >
                  Remember me
                </label>
              </div>
            </div>
            <a
              href="#"
              className="text-sm font-medium text-brightColor hover:underline transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <button type="submit" className={buttonClasses} disabled={loading}>
            {loading ? (
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
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="w-full px-4 py-2">
          <GoogleOAuthProvider clientId="526992097258-an7ps4j6qetf8mcjcd0g0d8deok1lmsf.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log("Login Failed")}
            />
          </GoogleOAuthProvider>
        </div>

        <p className="text-sm text-center text-gray-600 mt-4 border-t border-gray-100 pt-4">
          If you don&apos;t have an account, Do Sign Up
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
