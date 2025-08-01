import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/token/`, {
        email,
        password,
      });

      const { token } = response.data;
      setUser({ email });
      setToken(token);
      localStorage.setItem("token", token); // Guarda el token
      return true;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const isAuthenticated = !!token;


const register = async (name, email, password) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/user/create/`,
      {
        name,
        email,
        password,
      }
    );

    if (response.status === 201) {
      return await login(email, password);
    }

    return false;
  } catch (error) {
    console.error("Error de registro:", error.response?.data || error.message);
    return false;
  }
};

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, register}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
