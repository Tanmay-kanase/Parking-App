import { createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";

const token = localStorage.getItem("token");

const initialState = {
  user: token ? jwtDecode(token) : null, // Decode token if available
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
        state.user = jwtDecode(action.payload); // Decode user
      } catch (error) {
        console.error("Error decoding token:", error);
        state.user = null;
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
