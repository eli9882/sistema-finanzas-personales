import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CheckEmailPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Cargar email al iniciar
  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      navigate("/forgot-password");
    }
  }, [navigate]);

  // Función para leer contador de reenvíos y fecha
  const getResendData = () => {
    const data = localStorage.getItem("resendData");
    if (!data) return { count: 0, date: null };

    try {
      return JSON.parse(data);
    } catch {
      return { count: 0, date: null };
    }
  };

  // Guardar contador y fecha en localStorage
  const setResendData = (count, date) => {
    localStorage.setItem("resendData", JSON.stringify({ count, date }));
  };

  const handleResend = async () => {
    setMessage("");
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    let { count, date } = getResendData();

    // Si la fecha guardada no es hoy, reinicia contador
    if (date !== today) {
      count = 0;
      date = today;
    }

    if (count >= 3) {
      setMessage("Has alcanzado el límite de 3 reenvíos por día. Intenta mañana.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/password-reset/`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      setMessage("Se ha reenviado el enlace de recuperación.");
      count += 1;
      setResendData(count, date);

      // Opcional: limpiar email si ya no lo necesitas
      // localStorage.removeItem("resetEmail");
    } catch (error) {
      setMessage("No se pudo reenviar el correo. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white px-10 py-20 rounded-3xl border-2 border-white max-w-md mx-auto text-center">
      <h1 className="text-3xl font-semibold mb-6">Revisa tu correo</h1>
      <p className="text-gray-600 mb-4">
        Te enviamos un enlace para restablecer la contraseña a:
      </p>
      <p className="text-blue-500 font-medium mb-6">{email}</p>

      {message && (
        <p className="text-sm mb-4 text-gray-700">{message}</p>
      )}

      <button
        onClick={handleResend}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-blue-400 text-white font-bold hover:bg-blue-500 transition"
      >
        {loading ? "Reenviando..." : "Reenviar correo"}
      </button>

      <button
        onClick={() => navigate("/login")}
        className="mt-6 text-sm text-gray-500 underline hover:text-blue-500"
      >
        Volver al inicio de sesión
      </button>
    </div>
  );
}
