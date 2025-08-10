import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CategoryModal from "../components/categories/CategoryModal";
import MainContainer from "../components/layout/MainContainer";

// ID de usuario actual (mock). Sustituye por el id real de tu auth/JWT.
const currentUserId = "user-1";

// Normalizador para comparar nombres
const normalize = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");

const initialData = [
  { id: "001", userId: currentUserId, name: "Trabajo", description: "Salario" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialData);
  const [filter, setFilter] = useState("");
  const [modal, setModal] = useState({ open: false, mode: "create", data: null });

  // ¿Nombre ya existe para este usuario? (excluye un id opcional)
  const isNameTaken = (name, excludeId = null) =>
    categories.some(
      (c) =>
        c.userId === currentUserId &&
        normalize(c.name) === normalize(name) &&
        c.id !== excludeId
    );

  // Lista que se muestra (solo del usuario actual)
  const filtered = categories
    .filter((c) => c.userId === currentUserId)
    .filter((c) =>
      (c.name + c.description).toLowerCase().includes(filter.toLowerCase())
    );

  const handleCreate = (newCat) => {
    if (isNameTaken(newCat.name)) return false; // bloquea duplicado
    setCategories((prev) => [
      ...prev,
      { ...newCat, id: Date.now().toString(), userId: currentUserId },
    ]);
    return true;
  };

  const handleUpdate = (cat) => {
    if (isNameTaken(cat.name, cat.id)) return false; // bloquea duplicado
    setCategories((prev) => prev.map((c) => (c.id === cat.id ? { ...c, ...cat } : c)));
    return true;
  };

  const handleDelete = (id) =>
    setCategories((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="flex flex-col h-screen">
      <Header title="Categorías" />

      {/* ---------- contenido FULL-WIDTH ---------- */}
      <MainContainer max={false}>
        {/* Barra superior */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <button
            onClick={() => setModal({ open: true, mode: "create", data: null })}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium px-5 py-2 rounded"
          >
            <Plus size={16} /> Agregar
          </button>
        </div>

        {/* Tabla */}
        <div className="border rounded overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead className="bg-primary-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left w-20">Id</th>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Descripción</th>
                <th className="px-4 py-2 text-center w-24">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((cat) => (
                  <tr key={cat.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-2">{cat.id}</td>
                    <td className="px-4 py-2">{cat.name}</td>
                    <td className="px-4 py-2">{cat.description}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        title="Editar"
                        className="inline-flex text-primary-600 hover:text-primary-800 mr-2"
                        onClick={() => setModal({ open: true, mode: "edit", data: cat })}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        title="Eliminar"
                        className="inline-flex text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500 italic">
                    No hay categorías
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </MainContainer>

      <Footer />

      {/* Modal */}
      {modal.open && (
        <CategoryModal
          mode={modal.mode}
          data={modal.data}
          onClose={() => setModal({ open: false })}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
           validateName={isNameTaken}
        />
      )}
    </div>
  );
}