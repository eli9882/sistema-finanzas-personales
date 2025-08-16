import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "notistack";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth() || {};
  const { enqueueSnackbar } = useSnackbar();

   const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
       enqueueSnackbar("Las contraseñas no coinciden", { variant: "error" });
      return;
    }

    if (register) {
    const success = await register(name, email, password);  // <-- importante usar await
    if (success) {
      navigate("/");  // o "/dashboard" si así lo deseas
    } else {
       enqueueSnackbar("Error en el registro", { variant: "error" });
    }
  } else {
    enqueueSnackbar("Función de registro no implementada", { variant: "error" });
  }
  };

  return (
    <div className="bg-white px-10 py-20 rounded-3xl border-2 border-white max-w-md mx-auto">

      <h1 className="text-3xl font-semibold text-center mb-8">Crea tu cuenta Finance</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-lg font-medium">Nombre</label>
          <input
            type="text"
            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
            placeholder="Ingrese su Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-lg font-medium">Correo</label>
          <input
            type="email"
            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
            placeholder="Ingrese su Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-lg font-medium">Contraseña</label>
          <input
            type="password"
            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
            placeholder="Ingrese su Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="text-lg font-medium">Repetir Contraseña</label>
          <input
            type="password"
            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
            placeholder="Repita su Contraseña"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-blue-400 text-white text-lg font-bold active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all"
        >
          Registrarse
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-base text-gray-600">¿Ya tienes una cuenta? </span>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-blue-400 font-medium hover:text-black transition-colors"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}
