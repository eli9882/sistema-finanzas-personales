import { NavLink } from "react-router-dom";
import { Home, ListOrdered, LayoutDashboard, User } from "lucide-react";
import logo from "../../assets/logo.svg";       // asegúrate de tener tu logo aquí

const nav = [
  { label: "Dashboard",   path: "/dashboard",   icon: Home },
  { label: "Movimientos", path: "/movimientos", icon: ListOrdered },
  { label: "Categorías",  path: "/",            icon: LayoutDashboard },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-56 bg-primary-600 text-white">
      {/* Logo */}
      <div className="flex items-center justify-center h-20">
        <img src={logo} alt="Finance logo" className="h-12 w-auto" />
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 space-y-2">
        {nav.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded text-sm font-medium
               ${isActive ? "bg-white/30" : "hover:bg-white/20"}`
            }
          >
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>

      {/* Perfil */}
      <div className="flex items-center gap-3 px-4 py-4 border-t border-white/20">
        <User size={20} />
        <span className="text-sm">Juan</span>
      </div>
    </aside>
  );
}
