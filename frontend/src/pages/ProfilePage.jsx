import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function ProfilePage() {
  const { user, setUser, token, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "" // Vacía para no mostrar contraseña
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const dataToUpdate = {
      name: formData.name,
      email: formData.email,
    };
    if (formData.password.trim() !== "") {
      dataToUpdate.password = formData.password;
    }
    await axios.patch(
  `${import.meta.env.VITE_API_BASE_URL}/user/me/`,
  dataToUpdate,
  {
    headers: { Authorization: `Token ${token}` },
  }
);

// Actualiza el usuario en el contexto para que Sidebar y otros componentes se refresquen
setUser((prev) => ({
  ...prev,
  name: formData.name,
  email: formData.email,
}));

alert("Datos actualizados correctamente");
setFormData((f) => ({ ...f, password: "" }));

  } catch (error) {
    alert(
      "Error al actualizar: " +
        (error.response?.data?.detail ||
          JSON.stringify(error.response?.data) ||
          error.message)
    );
  }
};

  const handleDeactivate = async () => {
  if (!window.confirm("¿Seguro que quieres desactivar tu cuenta?")) return;

  try {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/user/deactivate/`,
      {},
      {
        headers: { Authorization: `Token ${token}` },
      }
    );
    alert("Cuenta desactivada. Se cerrará sesión.");
    logout();
  } catch (error) {
    alert(
      "Error al desactivar: " +
        (error.response?.data?.detail ||
          JSON.stringify(error.response?.data) ||
          error.message)
    );
  }
};
  // Obtener iniciales para avatar
  const getInitials = (name) => {
  if (!name || name.trim() === "") return "";

  const names = name.trim().split(" ").filter(n => n !== "");
  if (names.length === 0) return "";

  if (names.length === 1) return names[0][0].toUpperCase();

  return (names[0][0] + names[1][0]).toUpperCase();
};


  if (loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mb-4">
          <span className="text-white text-5xl font-bold select-none">
            {getInitials(user?.name || "")}
          </span>
        </div>

      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Tu nombre"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="tuemail@ejemplo.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nueva contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
        >
          Guardar cambios
        </button>
      </form>

      <hr className="my-8 border-gray-300" />

      <button
        onClick={handleDeactivate}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
      >
        Desactivar cuenta
      </button>
    </div>
  );
}
