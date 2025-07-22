import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

  authDomain: "parking-app-fdfcf.firebaseapp.com",

  projectId: "parking-app-fdfcf",

  storageBucket: "parking-app-fdfcf.firebasestorage.app",

  messagingSenderId: "543095501152",

  appId: "1:543095501152:web:d2a6c1074414534b3cae05",

  measurementId: "G-163B0WL570",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
