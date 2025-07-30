import React from 'react'

import { createContext, useContext, useState } from "react";
import sampleTransactions from "../data/sampleTransactions";

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(sampleTransactions);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, { ...transaction, id: Date.now() }]);
  };

  const editTransaction = (updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TransactionContext.Provider
      value={{ transactions, addTransaction, editTransaction, deleteTransaction }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);
