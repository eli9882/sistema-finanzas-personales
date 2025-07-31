import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header({ title = "Categorías" }) {
  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-3 border-b">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

      {/* Botón hamburguesa (pantallas pequeñas) */}
      <button
        aria-label="Abrir menú"
        className="lg:hidden text-gray-600 hover:text-primary-600 focus:outline-none"
      >
        <Menu size={24} />
      </button>

      {/* Acciones globales */}
      <div className="hidden lg:flex gap-4">
        <Link
          to="/dashboard"
          className="text-sm font-medium text-primary-600 hover:underline"
        >
          Dashboard
        </Link>
      </div>
    </header>
  );
}
