import { createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";

const token = localStorage.getItem("token");

const initialState = {
  user: token ? jwtDecode(token) : null, // Decode token if available
  userId: token ? jwtDecode(token).sub : null, // Extract userId
  token: token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload); // Save token

      try {
        const decoded = jwtDecode(action.payload);
        state.user = decoded;
        state.userId = decoded.sub; // Store userId from JWT
      } catch (error) {
        console.error("Error decoding token:", error);
        state.user = null;
        state.userId = null;
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.userId = null;
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
