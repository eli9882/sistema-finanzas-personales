import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; // importante

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth(); // accedemos al token
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/categories/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error al cargar categorías", error);
    }
  };

  // Nueva función para crear categoría
  const createCategory = async (categoryData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/categories/`,
        categoryData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      // Agrega la nueva categoría al estado
      setCategories((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error al crear categoría", error);
    }
  };

  // Nueva función para actualizar categoría
  const updateCategory = async (id, categoryData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/categories/${id}/`,
        categoryData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      // Actualiza la categoría en el estado
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? response.data : cat))
      );
    } catch (error) {
      console.error("Error al actualizar categoría", error);
    }
  };

  const deleteCategory = async (id) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/categories/${id}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    // Actualizar el estado para remover la categoría eliminada
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  } catch (error) {
    console.error("Error al eliminar categoría", error);
  }
};

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchCategories();
  }, [isAuthenticated, token]);

  return (
    <TransactionContext.Provider
      value={{
        categories,
        transactions,
        deleteCategory, 
        createCategory,
        updateCategory,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);