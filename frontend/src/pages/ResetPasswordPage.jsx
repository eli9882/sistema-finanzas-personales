import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token"); // Captura el token de la URL
  const email = localStorage.getItem("resetEmail"); // Email guardado desde ForgotPasswordPage

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      enqueueSnackbar("Token inválido o faltante.", { variant: "error" });
      return;
    }

    if (!email) {
      enqueueSnackbar("No se encontró el correo. Intenta iniciar el proceso nuevamente.", { variant: "error" });
      return;
    }

    if (password !== confirmPassword) {
      enqueueSnackbar("Las contraseñas no coinciden.", { variant: "error" });
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/password-reset/confirm/`,
        { email, password, token },
        { headers: { "Content-Type": "application/json" } }
      );

      enqueueSnackbar("Contraseña restablecida con éxito.", { variant: "success" });
      localStorage.removeItem("resetEmail");
      navigate("/password-success");
    } catch (error) {
      console.error("Error al restablecer:", error.response?.data || error.message);
      enqueueSnackbar("Hubo un error. Intenta nuevamente.", { variant: "error" });
    }

    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="bg-white px-10 py-20 rounded-3xl border-2 border-white max-w-md mx-auto">
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

      <h1 className="text-3xl font-semibold text-center mb-4">Crear nueva contraseña</h1>
      <p className="text-center text-gray-600 mb-8">
        Introduzca su nueva contraseña a continuación para completar el proceso de restablecimiento.
      </p>

      <form onSubmit={handleSubmit}>
        <label className="block text-lg font-medium mb-2">Nueva contraseña</label>
        <input
          type="password"
          placeholder="Ingrese su nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border-2 border-gray-100 rounded-xl p-4 mb-4 bg-transparent"
        />

        <label className="block text-lg font-medium mb-2">Repetir nueva contraseña</label>
        <input
          type="password"
          placeholder="Confirme su nueva contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
