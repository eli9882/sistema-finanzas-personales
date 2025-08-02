import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import MovementsPage from "./pages/MovementsPage";
import CategoriesPage from "./pages/CategoriesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import CheckEmailPage from "./pages/CheckEmailPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PasswordSuccessPage from "./pages/PasswordSuccessPage";
import ProfilePage from "./pages/ProfilePage";
import { TransactionProvider } from "./context/TransactionContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import loginImage from "./assets/finanzas.jpg";
import AuthLayout from "./components/AuthLayout";



// 🔐 Componente para proteger rutas privadas
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          } />

        <Route path="/register" element={
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          } />

        <Route path="/forgot-password" element={
          <AuthLayout>
            <ForgotPasswordPage />
          </AuthLayout>
        } />

          <Route path="/check-email" element={
            <AuthLayout>
              <CheckEmailPage />
            </AuthLayout>
          } />

          <Route path="/reset-password" element={
            <AuthLayout>
              <ResetPasswordPage />
            </AuthLayout>
          } />

          <Route path="/password-success" element={
            <AuthLayout>
              <PasswordSuccessPage />
            </AuthLayout>
          } />


        <Route path="/*" element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              <main className="flex-1 bg-gray-50 min-h-screen p-6">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/movimientos" element={<MovementsPage />} />
                  <Route path="/categorias" element={<CategoriesPage />} />
                  <Route path="/perfil" element={<ProfilePage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
