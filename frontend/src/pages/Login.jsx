import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import Logo from "../components/Logo";
import InputField from "../components/InputField";
import AuthButton from "../components/AuthButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        <Logo />
        <h2 className="text-2xl font-bold mb-6 text-center">Bienvenido a Finance</h2>
        <form>
          <InputField
            label="Correo"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Ingrese su correo"
          />
          <InputField
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
          />
          <div className="mb-4 text-right">
            <a href="#" className="text-blue-500 text-sm hover:underline">
              ¿Olvidó su contraseña?
            </a>
          </div>
          <AuthButton>Iniciar sesión</AuthButton>
        </form>
        <div className="mt-4 text-center text-sm">
          ¿Aún no estás registrado?{" "}
          <a href="#" className="text-blue-500 font-semibold hover:underline">
            Regístrate
          </a>
        </div>
      </div>
    </AuthLayout>
  );
} 