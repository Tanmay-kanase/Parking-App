import React from "react";
import { storage } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { useState } from "react";
import { uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
const SignUpForm = () => {
  const [otpVisible, setOtpVisible] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const buttonClasses = `w-full text-white bg-[#03C9D7] hover:bg-[#039BAB] focus:ring-4 focus:outline-none 
    focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all 
    duration-200 transform hover:scale-[1.02] hover:shadow-md`;
  // const buttonForGFT = `inline-flex w-full justify-center items-center rounded-lg border border-gray-300 bg-white
  //   py-2.5 px-4 text-sm font-medium text-gray-500 hover:bg-gray-50 shadow-sm transition-all
  //   duration-200 hover:shadow hover:border-gray-400`;
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  // const handleSendOtp = async () => {
  //   if (!email) return alert("Enter email first");
  //   try {
  //     await api.post(`/api/users/otp/send`, { email });
  //     setOtpVisible(true);
  //   } catch (err) {
  //     alert("Failed to send OTP");
  //   }
  // };

  const handleSendOtp = async () => {
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
      }
    } catch (error) {
      setError("Failed to send OTP. Try again.", error);
    }
  };

  // const handleVerifyOtp = async () => {
  //   if (!email) return alert("Enter email first");
  //   setVerifying(true);
  //   try {
  //     await api.post(`/api/users/otp/verify`, {
  //       email,
  //       otp,
  //     });
  //     setOtpVerified(true);
  //     setOtpVisible(false);
  //   } catch (err) {
  //     alert("Invalid OTP");
  //   }
  //   setVerifying(false);
  // };

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

  // const handleSubmit = async (e) => {
  //   setLoading(true);

  //   console.log("Handle submit called");

  //   e.preventDefault();

  //   const formData = new FormData(e.target);
  //   const fullName = formData.get("fullName");
  //   const email = formData.get("email");
  //   const password = formData.get("password");
  //   const confirmPassword = formData.get("confirmPassword");
  //   const imageFile = formData.get("profileImage");
  //   console.log("Image file:", imageFile);

  //   if (password !== confirmPassword) {
  //     alert("Passwords do not match");
  //     return;
  //   }

  //   let profileUrl = "";

  //   if (imageFile) {
  //     try {
  //       setImageUploading(true);
  //       const imageRef = ref(
  //         storage,
  //         `profiles/${Date.now()}-${imageFile.name}`
  //       );
  //       const uploadTask = uploadBytesResumable(imageRef, imageFile);

  //       await new Promise((resolve, reject) => {
  //         uploadTask.on(
  //           "state_changed",
  //           (snapshot) => {
  //             const progress =
  //               (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //             setUploadProgress(Math.round(progress));
  //           },
  //           (error) => reject(error),
  //           async () => {
  //             profileUrl = await getDownloadURL(uploadTask.snapshot.ref);
  //             setImageUploading(false);
  //             resolve();
  //           }
  //         );
  //       });
  //       console.log("Image uploaded. URL:", profileUrl);
  //     } catch (uploadError) {
  //       console.error("Image upload failed:", uploadError);
  //     }
  //   }

  //   console.log(fullName, email, password, profileUrl);

  //   try {
  //     const res = await api.post("/api/users/register", {
  //       name: fullName,
  //       email,
  //       password,
  //       profileUrl,
  //     });

  //     console.log("User registered:", res.data);
  //     alert("Registration successful!");
  //     setLoading(false);
  //     setUploadProgress(0);
  //     localStorage.setItem("token", res.data.token);
  //     localStorage.setItem("user", JSON.stringify(res.data.user));
  //     navigate("/");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Registration failed.");
  //     setLoading(false);
  //     setUploadProgress(0);
  //   }
  // };

  const handleSubmit = async (e) => {
    setLoading(true);
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

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    let profileUrl = "fgdgfg";

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

    if (!otpVerified) {
      setError("Please verify your email before submitting.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/signup`,
        {
          name: fullName,
          email,
          phone,
          password,
          profileUrl,
          role,
        }
      );
      console.log(response);
      if (response.data.userId) {
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("token", response.data.token);
        console.log("User registered with ID:", response.data.userId);
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      setLoading(false);
      setError(
        error.response?.data?.message || error.message || "Signup failed."
      );
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-2xl md:mt-0 xl:p-0 border border-gray-200 mx-auto">
      <div className="p-6 space-y-6 md:space-y-7 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-backgroundColor md:text-2xl text-center">
          Create Account
          <p className="text-sm font-normal text-gray-500 mt-1">
            Sign up to get started
          </p>
        </h1>

        <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-5 md:gap-6">
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
                required
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

            <div className="flex justify-between items-center gap-2 ">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#d5f2ec] border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-brightColor focus:border-brightColor block w-full pl-10 p-3"
                  placeholder="Email address"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpVerified}
                className={`ml-2 text-sm font-medium px-3 py-2 rounded-lg ${
                  otpVerified
                    ? "bg-green-500 text-white cursor-default"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {otpVerified ? "Verified ✅" : "Send OTP"}
              </button>
            </div>
            {otpVisible && (
              <div className="flex items-center gap-3 mt-3">
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1 bg-[#d5f2ec] border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-3"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={verifying}
                  className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  {verifying ? (
                    <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mx-auto" />
                  ) : (
                    "Verify"
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
                <option value="Parking_Owner">Parking Owner</option>
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

        {/* <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or sign up with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
         
          <button type="button" className={buttonForGFT}>
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
          </button>

         
          <button type="button" className={buttonForGFT}>
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          
          <button type="button" className={buttonForGFT}>
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
            </svg>
          </button>
        </div> */}

        <p className="text-sm text-center text-gray-600 mt-4 border-t border-gray-100 pt-4">
          Already have an account? Sign in
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
