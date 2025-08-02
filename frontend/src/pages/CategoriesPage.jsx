import React, { useState } from "react";
import { useTransactions } from "../context/TransactionContext";
import AddTransactionModal from "../components/AddCategoryModal";

export default function CategoriesPage() {
  const { transactions, deleteTransaction } = useTransactions();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (transaction) => {
    setEditing(transaction);
    setShowModal(true);
  };

  const filtered = transactions.filter((t) => {
    const matchSearch =
      (t.name + t.description)
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchType =
      filterType === "all" ? true : t.type.toLowerCase() === filterType.toLowerCase();

    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categorias</h2>
        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Agregar Categoria
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
        {/* Campo de búsqueda */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {/* Ícono de lupa */}
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

        {/* Botón filtro rápido */}
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
                { label: "Trabajo", value: "trabajo" },
                { label: "Gasolina", value: "gasolina" },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setFilterType(type.value);
                    setShowFilters(false);
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

      {/* Tabla */}
      <table className="w-full bg-white shadow rounded overflow-hidden text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">id</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Descripción</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length ? (
            filtered.map((t) => (
              <tr key={t.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{t.id}</td>
                <td className="p-3">{t.name}</td>
                <td className="p-3">{t.description}</td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => openEdit(t)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteTransaction(t.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center text-gray-500 py-6 italic">
                No hay categorias encontrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          existing={editing}
        />
      )}
    </div>
  );
}
