const API_URL = "http://localhost:8080/api/auth";

export const signup = async (userData) => {
    const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem("token", data.token);
    }
    return data;
};

export const googleSignup = async (googleData) => {
    const response = await fetch(`${API_URL}/google-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(googleData),
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem("token", data.token);
    }
    return data;
};

export const getToken = () => localStorage.getItem("token");

export const logout = () => {
    localStorage.removeItem("token");
};
