import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import CategoriesPage from "./pages/CategoriesPage";
import DashboardPage from "./pages/DashboardPage";
import MovementsPage from "./pages/MovementsPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* este wrapper gana flex‑1 y permite que el área de páginas
          crezca hasta el borde derecho de la ventana  */}
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<CategoriesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/movimientos" element={<MovementsPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
