import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";


export default function ProfilePage() {
  const [show, setShow] = useState(false);

  return (
    <div className="flex h-screen">
      <Header title="Perfil" />
      <main className="flex-1 flex flex-col items-center py-10">
        <form className="w-full max-w-md space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              defaultValue="Juan"
              className="w-full border rounded px-3 py-2 text-sm focus:ring-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Correo</label>
            <input
              type="email"
              defaultValue="juan23@gmail.com"
              className="w-full border rounded px-3 py-2 text-sm focus:ring-primary-500 focus:outline-none"
            />
          </div>
          {["Contraseña", "Repetir Contraseña"].map((label, i) => (
            <div key={label} className="relative">
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                type={show ? "text" : "password"}
                defaultValue="12345678"
                className="w-full border rounded px-3 py-2 text-sm pr-10 focus:ring-primary-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          ))}
          <button className="w-full py-2 rounded text-white bg-primary-600 hover:bg-primary-700">
            Guardar
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
