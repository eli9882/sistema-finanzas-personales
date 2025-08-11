import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar token y usuario al iniciar la app
  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");
    if (tokenGuardado) {
      setToken(tokenGuardado);
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/user/me/`, {
          headers: { Authorization: `Token ${tokenGuardado}` }
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          setUser(null);
        });
    }
    setLoading(false);
  }, []);

  // Configurar axios cuando cambia el token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async (email, password) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/user/token/`,
      { email, password }
    );

    const { token } = response.data;
    setToken(token);
    localStorage.setItem("token", token);

    // Cargar datos del usuario
    const userRes = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/user/me/`,
      { headers: { Authorization: `Token ${token}` } }
    );
    setUser(userRes.data);

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

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/create/`,
        { name, email, password }
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

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ user, setUser, token, login, logout, isAuthenticated, register, loading }}
    >
      {children}
    </AuthContext.Provider>

  );
};

export const useAuth = () => useContext(AuthContext);
