import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChartPie, FaExchangeAlt, FaTags, FaUser } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const current = location.pathname;

  const linkStyle = (path) =>
    `flex items-center gap-2 w-full py-2 px-3 rounded hover:bg-blue-700 ${
      current === path ? "bg-blue-700" : ""
    }`;

  return (
    <aside className="w-64 bg-blue-600 text-white flex flex-col justify-between">
      <div>
        <div className="p-6 text-2xl font-bold">Finance</div>
        <nav className="space-y-2 px-4">
          <Link to="/" className={linkStyle("/")}>
            <FaChartPie /> Dashboard
          </Link>
          <Link to="/movimientos" className={linkStyle("/movimientos")}>
            <FaExchangeAlt /> Movimientos
          </Link>
          <Link to="/categorias" className={linkStyle("/categorias")}>
            <FaTags /> Categorías
          </Link>
        </nav>
      </div>
      <div className="p-4 flex items-center gap-2 border-t border-blue-500">
        <FaUser />
        <span>Juan</span>
      </div>
    </aside>
  );
}