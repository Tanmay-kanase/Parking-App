import { createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

const initialState = {
  user: token ? jwtDecode(token) : null, // Decode token if available
  userId: userId || null, // Get userId from localStorage
  token: token || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.user = jwtDecode(action.payload.token);

      localStorage.setItem("token", action.payload.token); // Save token
      localStorage.setItem("userId", action.payload.userId); // Store userId
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.userId = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
