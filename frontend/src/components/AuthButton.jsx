export default function AuthButton({ children, ...props }) {
  return (
    <button
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition"
      {...props}
    >
      {children}
    </button>
  );
} 