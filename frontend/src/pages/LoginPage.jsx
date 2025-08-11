import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import loginImagelogo from "../assets/finance-logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
  e.preventDefault();
  const success = await login(email, password);
  if (success) {
    navigate("/");
  } else {
    alert("Credenciales incorrectas");
  }
};

  return (
   <div className="bg-white px-10 py-20 rounded-3xl border-2 border-white">
    {/* Logo */}
      <img
        src={loginImagelogo}
        alt="Logo Finance"
        className="h-16 w-auto mx-auto mb-6"
      />
      <h1 className="text-4xl font-semibold">Bienvenido a Finance</h1>
      <div className="mt-8">
        <div>
          <label className="text-lg font-medium">Correo</label>
          <input
            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
            placeholder="Ingrese su Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-lg font-medium">Contraseña</label>
          <input
            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
            placeholder="Ingrese su Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mt-8 flex justify-center items-center">
          <button type="button"
  onClick={() => navigate("/forgot-password")} className="font-medium text-base text-blue-400 hover:text-black transition-colors">¿Olvido su Contraseña?</button>
        </div>
        <div className="mt-8 flex flex-col gap-y-4">
          <button type="button"
            onClick={handleSubmit} className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-3 rounded-xl bg-blue-400 text-white text-lg font-bold">Iniciar Sesión</button>
        </div>
        <div className="mt-6 text-center">
          <span className="text-base text-gray-600">¿Aún no estás registrado? </span>
          <button type="button"
            onClick={() => navigate("/register")} className="text-blue-400 font-medium hover:text-black transition-colors">
            Regístrate
          </button>
        </div>
      </div>
   </div>
  )
}


