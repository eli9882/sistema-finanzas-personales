import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import MovementsPage from "./pages/MovementsPage";
import CategoriesPage from "./pages/CategoriesPage";
import { TransactionProvider } from "./context/TransactionContext";

export default function App() {
  return (
    <TransactionProvider>
      <BrowserRouter>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 bg-gray-50 min-h-screen p-6">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/movimientos" element={<MovementsPage />} />
              <Route path="/categorias" element={<CategoriesPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TransactionProvider>
  );
}
