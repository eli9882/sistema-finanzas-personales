import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // --- CATEGORÍAS ---
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/categories/`,
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

  const createCategory = async (categoryData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/categories/`,
        categoryData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setCategories((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error al crear categoría", error);
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/categories/${id}/`,
        categoryData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? response.data : cat))
      );
    } catch (error) {
      console.error("Error al actualizar categoría", error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/categories/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      setTransactions((prev) => prev.filter((t) => t.categoria !== id));
    } catch (error) {
      console.error("Error al eliminar categoría", error);
    }
  };

  // --- TRANSACCIONES ---
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/events/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error al cargar transacciones", error);
    }
  };

  const addTransaction = async (transactionData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/events/`,
        transactionData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setTransactions((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error al agregar transacción", error);
    }
  };

  const editTransaction = async (transactionData) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/events/${transactionData.id}/`,
        transactionData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setTransactions((prev) =>
        prev.map((t) => (t.id === transactionData.id ? response.data : t))
      );
    } catch (error) {
      console.error("Error al editar transacción", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/events/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error al eliminar transacción", error);
    }
  };

  // --- VALIDACIONES ---
  // Verificación para saber si se puede agregar una transacción (por tipo)
  const canAddTransaction = (type = null) => {
    if (!type) {
      return categories.length > 0;
    }
    return categories.some((cat) => cat.tipo?.toLowerCase() === type.toLowerCase());
  };

  // --- CARGA INICIAL ---
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchCategories();
    fetchTransactions();
  }, [isAuthenticated, token]);

  return (
    <TransactionContext.Provider
      value={{
        categories,
        transactions,
        createCategory,
        updateCategory,
        deleteCategory,
        addTransaction,
        editTransaction,
        deleteTransaction,
        canAddTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);
