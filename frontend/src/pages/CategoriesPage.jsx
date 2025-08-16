import React, { useState, useEffect } from "react";
import { useTransactions } from "../context/TransactionContext";
import AddCategoryModal from "../components/AddCategoryModal";
import ConfirmModal from "../components/ConfirmModal";
import { useSnackbar } from "notistack";

export default function CategoriesPage() {
  const { categories, transactions, deleteCategory } = useTransactions();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  //  Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Detectar si es móvil o desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(5); // móvil
      } else {
        setItemsPerPage(10); // desktop
      }
    };
    handleResize(); // ejecutar al inicio
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openAdd = () => {
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (category) => {
  // Verificar si la categoría tiene transacciones
  const hasTransactions = transactions.some(
    (t) => t.categoria === category.id
  );

  if (hasTransactions) {
    enqueueSnackbar(
      `No se puede editar la categoría "${category.nombre}" porque tiene movimientos asociados.`,
      { variant: "warning" }
    );
    return;
  }

  setEditing(category);
  setShowModal(true);
};

  const confirmDelete = (category) => {
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      enqueueSnackbar(`Categoría "${categoryToDelete.nombre}" eliminada`, { variant: "success" });
      setCategoryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setCategoryToDelete(null);
  };

  //  Filtro
  const filtered = categories.filter((c) => {
    const matchSearch = (c.nombre + (c.descripcion || "")).toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" ? true : (c.tipo?.toLowerCase() === filterType.toLowerCase());
    return matchSearch && matchType;
  });

  //  Paginación
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold">Categorías</h2>
        <button
          onClick={openAdd}
          className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Agregar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4">
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Buscar"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border border-gray-300 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Filtro rápido */}
        <div className="relative inline-block text-left">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-1 border border-gray-300 bg-white px-3 py-2 rounded text-sm hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z"
              />
            </svg>
            Filtro
          </button>
          {showFilters && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow z-10">
              {[
                { label: "Todos", value: "all" },
                { label: "Ingreso", value: "ingreso" },
                { label: "Gasto", value: "gasto" },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setFilterType(type.value);
                    setShowFilters(false);
                    setCurrentPage(1);
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    filterType === type.value ? "bg-gray-100" : ""
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vista de Cards en móvil */}
      <div className="grid gap-4 md:hidden">
        {currentItems.length ? (
          currentItems.map((c) => (
            <div key={c.id} className="bg-white shadow rounded p-4">
              <h3 className="font-semibold">{c.nombre}</h3>
              <p className="text-sm text-gray-500">{c.descripcion}</p>
              <div className="mt-2 flex justify-between text-sm">
                {/* 👇 En móvil mostramos el tipo*/}
                <span
                  className={`font-medium ${
                    c.tipo?.trim().toLowerCase() === "ingreso"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {c.tipo ? c.tipo.charAt(0).toUpperCase() + c.tipo.slice(1) : "N/A"}
                </span>

                <div className="space-x-2">
                  <button
                    onClick={() => openEdit(c)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => confirmDelete(c)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">
            No hay categorías encontradas.
          </p>
        )}
      </div>

      {/* Tabla en desktop */}
      <div className="hidden md:block overflow-x-auto mt-4">
        <table className="min-w-[600px] w-full bg-white shadow rounded overflow-hidden text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Descripción</th>
              <th className="p-3">Tipo</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length ? (
              currentItems.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{c.id}</td>
                  <td className="p-3">{c.nombre}</td>
                  <td className="p-3">{c.descripcion}</td>
                  <td className="p-3">
                    <span
  className={`font-medium ${
    c.tipo?.trim().toLowerCase() === "ingreso"
      ? "text-green-600"
      : "text-red-600"
  }`}
>
  {c.tipo ? c.tipo.charAt(0).toUpperCase() + c.tipo.slice(1) : "N/A"}
</span>

                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => openEdit(c)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => confirmDelete(c)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-6 italic">
                  No hay categorías encontradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/*Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <AddCategoryModal
          onClose={() => setShowModal(false)}
          existing={editing}
        />
      )}

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={!!categoryToDelete}
        title="Eliminar categoría"
        message={`¿Seguro que deseas eliminar la categoría "${categoryToDelete?.nombre}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
