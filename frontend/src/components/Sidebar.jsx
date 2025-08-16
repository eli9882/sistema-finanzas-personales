import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaExchangeAlt,
  FaTags,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import financeLogo from "../assets/finance-logo.png";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const current = location.pathname;

  const linkStyle = (path) =>
    `flex items-center justify-center md:justify-start gap-2 w-full py-2 px-3 rounded hover:bg-blue-500 ${
      current === path ? "bg-blue-500" : ""
    }`;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-16 md:w-64 bg-blue-400 text-white flex flex-col justify-between transition-all duration-300">
      <div>
          {/* Logo */}
        <div className="flex items-center justify-center p-4">
          <img
            src={financeLogo}
            alt="Finance Logo"
            className="h-9 w-auto md:h-11"
          />
        </div>
        {/* Título solo visible en desktop */}
        <div className="text-center text-2xl font-bold hidden md:block">Finance</div>

        {/* En móvil agregamos pt-4 para que el Dashboard no quede pegado arriba */}
        <nav className="space-y-2 px-2 md:px-4 pt-4 md:pt-0">
          <Link to="/" className={linkStyle("/")}>
            <FaChartPie />
            <span className="hidden md:inline">Dashboard</span>
          </Link>
          <Link to="/movimientos" className={linkStyle("/movimientos")}>
            <FaExchangeAlt />
            <span className="hidden md:inline">Movimientos</span>
          </Link>
          <Link to="/categorias" className={linkStyle("/categorias")}>
            <FaTags />
            <span className="hidden md:inline">Categorías</span>
          </Link>
        </nav>
      </div>

      {/* Footer con perfil y logout */}
      <div className="p-2 md:p-4 flex flex-col gap-2 border-t border-blue-400">
        <Link to="/perfil" className={linkStyle("/perfil")}>
        <FaUser />
        <span className="hidden md:inline">{user?.name || "Invitado"}</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center md:justify-start gap-2 text-sm text-white hover:text-red-300"
        >
          <FaSignOutAlt />
          <span className="hidden md:inline">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
