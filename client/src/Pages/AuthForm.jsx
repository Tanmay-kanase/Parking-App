import { useDispatch } from "react-redux";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { loginSuccess } from "../redux/authSlice";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";

function AuthForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/home"); // Redirect to login page
  };
  const handleSuccess = async (response) => {
    const { credential } = response;
    console.log("JWT Token:", credential);

    try {
      // Decode the JWT token
      const decodedToken = jwtDecode(credential);
      console.log("Decoded User:", decodedToken);

      // Store token in Redux
      dispatch(loginSuccess(credential));

      alert("Login successful!");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.GOOGLE_CLIENT_ID}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log("Login Failed")}
        />
      </GoogleOAuthProvider>
      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </>
  );
}

export default AuthForm;

// const handleGoogleSignup = async () => {
//   try {
//     const result = await signInWithPopup(auth, provider);
//     console.log(result);

//     const user = result.user;

//     const userData = {
//       username: user.displayName,
//       email: user.email,
//       profilePhoto: user.photoURL,
//       providerId: user.providerId,
//     };
//     console.log(userData);

//     await axios.post("http://localhost:8080/api/users/signup", userData);
//     alert("Signup Successful!");
//   } catch (error) {
//     console.log("Google Signup Error:", error.message);
//   }
// };

// const handleSuccess = async (response) => {
//   const { credential } = response;
//   console.log("JWT Token:", credential);

//   try {
//     // Dynamically import jwt-decode
//     const { default: jwtDecode } = await import("jwt-decode");

//     // Decode JWT token
//     const decodedToken = jwtDecode.default(credential);
//     const userEmail = decodedToken.email;
//     console.log("Decoded Email:", userEmail);

//     // Send request with email
//     const res = await axios.get(
//       `http://localhost:8080/api/auth/users/${userEmail}`
//     );
//     console.log("User Data:", res.data);
//   } catch (error) {
//     console.error("Login failed", error);
//   }
// };
