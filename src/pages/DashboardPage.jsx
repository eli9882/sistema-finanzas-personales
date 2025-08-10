import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function DashboardPage() {
  return (
    <div className="flex h-screen">
      <Header title="Dashboard" />
      {/* Contenido en blanco por ahora */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <p className="text-gray-500">Dashboard en construcción…</p>
      </main>
      <Footer />
    </div>
  );
}
