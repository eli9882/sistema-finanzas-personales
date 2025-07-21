export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center items-center bg-white">
        {children}
      </div>
      <div className="hidden md:flex flex-1 items-center justify-center bg-blue-100">
        {/* Imagen ilustrativa */}
        <img
          src="/src/assets/finance-illustration.png"
          alt="Finance Illustration"
          className="max-w-md w-full"
        />
      </div>
    </div>
  );
} 