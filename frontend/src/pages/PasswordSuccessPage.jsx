import React from "react";
import { useNavigate } from "react-router-dom";

export default function PasswordSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white px-10 py-20 rounded-3xl border-2 border-white max-w-md mx-auto text-center">
      <svg
        className="mx-auto mb-6 w-16 h-16 text-green-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>

      <h1 className="text-2xl font-semibold mb-6">Tu contraseña se ha restablecido correctamente.</h1>
      <p className="text-gray-600 mb-10">
        Ahora puedes iniciar sesión con tu nueva contraseña.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="w-full py-3 rounded-xl bg-blue-400 text-white text-lg font-bold active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all"
      >
        Volver al inicio de sesión
      </button>
    </div>
  );
}
