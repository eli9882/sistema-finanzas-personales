export default function Footer() {
  return (
    <footer className="w-full flex items-center justify-center py-3 bg-white border-t">
      <span className="text-xs text-gray-500">
        © {new Date().getFullYear()} Finance • Todos los derechos reservados
      </span>
    </footer>
  );
}
