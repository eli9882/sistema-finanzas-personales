import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/password-reset/`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("resetEmail", email);  // Guardar para CheckEmailPage
      navigate("/check-email");
    } catch (error) {
      console.error("Error en recuperación:", error.response?.data || error.message);
      alert("Hubo un error. Intenta nuevamente.");
    }

    setEmail("");
  };


  return (
    <div className="bg-white px-10 py-20 rounded-3xl border-2 border-white max-w-md mx-auto">
          {/* Botón regresar */}
      <button
        onClick={() => navigate("/login")}
        className="absolute top-6 left-6 text-blue-400 hover:text-blue-600 font-bold flex items-center gap-1"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>

      </button>
      <h1 className="text-3xl font-semibold text-center mb-4">Olvidé mi contraseña</h1>
      <p className="text-center text-gray-600 mb-8">
        No te preocupes, ingresa tu correo y te enviaremos un enlace para restablecerla.
      </p>

      <form onSubmit={handleSubmit}>
        <label className="block text-lg font-medium mb-2">Correo</label>
        <input
          type="email"
          placeholder="Ingrese su correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border-2 border-gray-100 rounded-xl p-4 mb-6 bg-transparent"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-blue-400 text-white text-lg font-bold active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all"
        >
          Enviar
        </button>

      </form>
    </div>

  );
}
