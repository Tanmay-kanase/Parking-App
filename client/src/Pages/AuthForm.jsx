import { useState } from "react";
import { auth, provider, signInWithPopup } from "../config/firebase.js"; // Import Firebase config
import axios from "axios"; // For API call
import { motion } from "framer-motion";

function AuthForm({ isSignUp = false }) {
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    profilePic: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePic: e.target.files[0] });
  };
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);

      const user = result.user;


      const userData = {
        username: user.displayName,
        email: user.email,
        profilePhoto: user.photoURL,
        providerId: user.providerId,
      };
      console.log(userData);



      await axios.post("http://localhost:8080/api/users/signup", userData);
      alert("Signup Successful!");
    } catch (error) {
      console.log("Google Signup Error:", error.message);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f8f6e9] px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-[#111] text-white shadow-xl rounded-xl p-10 w-full max-w-xl transform transition duration-300 hover:scale-[1.02]"
      >
        <h2 className="text-4xl font-extrabold text-yellow-400 text-center mb-6">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>

        {isSignUp && (
          <div className="mb-5 text-center">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Profile Photo
            </label>
            <div className="relative flex items-center justify-center">
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-28 h-28 rounded-full border-4 border-yellow-400 flex items-center justify-center bg-gray-800 overflow-hidden shadow-lg"
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400">Upload</span>
                )}
              </motion.div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        )}

        <div className="mb-5 relative">
          <label className="absolute left-3 top-3 text-gray-500 transition-all duration-300 transform -translate-y-3 scale-90 peer-placeholder-shown:translate-y-3 peer-placeholder-shown:scale-100">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 mt-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 peer"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6 relative">
          <label className="absolute left-3 top-3 text-gray-500 transition-all duration-300 transform -translate-y-3 scale-90 peer-placeholder-shown:translate-y-3 peer-placeholder-shown:scale-100">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 mt-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 peer"
            placeholder="Enter your password"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition duration-300 text-lg shadow-md"
        >
          {isSignUp ? "Sign Up" : "Login"}
        </motion.button>

        <div className="mt-5 flex items-center">
          <hr className="w-full border-gray-600" />
          <span className="px-3 text-gray-400">OR</span>
          <hr className="w-full border-gray-600" />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="w-full mt-5 py-3 bg-white text-black flex items-center justify-center gap-3 border border-gray-300 rounded-lg hover:bg-gray-200 transition duration-300 shadow-md"
          onClick={handleGoogleSignup}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google"
            className="h-6"
          />
          Continue with Google
        </motion.button>

        <p className="mt-5 text-center text-gray-400 text-lg">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <a href="#" className="text-yellow-400 hover:underline">
            {isSignUp ? "Login" : "Sign Up"}
          </a>
        </p>
      </motion.div>
    </div>
  );
}

export default AuthForm;
