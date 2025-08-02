import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function MovementsPage() {
  return (
    <div className="flex h-screen">
      <Header title="Movimientos" />
      <main className="flex-1 flex flex-col items-center justify-center">
        <p className="text-gray-500">Listado de movimientos pendiente…</p>
      </main>
      <Footer />
    </div>
  );
}
