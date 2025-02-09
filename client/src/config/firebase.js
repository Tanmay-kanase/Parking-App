import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAGc8QgiFA-fungwCLYdNDMoLjMvFHBy18",

  authDomain: "parking-app-fdfcf.firebaseapp.com",

  projectId: "parking-app-fdfcf",

  storageBucket: "parking-app-fdfcf.firebasestorage.app",

  messagingSenderId: "543095501152",

  appId: "1:543095501152:web:d2a6c1074414534b3cae05",

  measurementId: "G-163B0WL570",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
