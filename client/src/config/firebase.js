import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-9967e.firebaseapp.com",
  projectId: "mern-estate-9967e",
  storageBucket: "mern-estate-9967e.appspot.com",
  messagingSenderId: "527361866180",
  appId: "1:527361866180:web:4f045909ee5b0cd85c0c91",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
