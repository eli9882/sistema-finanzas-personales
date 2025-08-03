import React from "react";
import loginImage from "../assets/finanzas.jpg";

export default function AuthLayout({ children }) {
  return (
    <div className="flex w-full h-screen">
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        {children}
      </div>
      <div className="hidden lg:flex h-full w-1/2 items-center justify-center bg-gray-200">
        <img
          src={loginImage}
          alt="Imagen de finanzas"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
