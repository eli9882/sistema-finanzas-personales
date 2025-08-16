import React, { useState, useEffect } from "react";
import { useTransactions } from "../context/TransactionContext";
import AddTransactionModal from "../components/AddTransactionModal";
import ConfirmModal from "../components/ConfirmModal";
import { useSnackbar } from "notistack";


export default function MovementsPage() {
  const { transactions, deleteTransaction, canAddTransaction, categories } = useTransactions();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const { enqueueSnackbar } = useSnackbar();


  //  Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 5 : 10);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openAdd = () => {
    if (!canAddTransaction()) {
      enqueueSnackbar(
        "Debes crear al menos una categoría antes de agregar un movimiento.",
        { variant: "error", autoHideDuration: 4000 }
      );
      return;
    }
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (transaction) => {
    setEditing(transaction);
    setShowModal(true);
  };

  const filtered = transactions.filter((t) => {
    const categoryName = categories.find(cat => cat.id === t.categoria)?.nombre || "";
    const combined = (categoryName + " " + t.descripcion + " " + t.tipo + " " + t.fecha + " " + t.monto).toLowerCase();
    const matchSearch = combined.includes(search.toLowerCase());
    const matchType = filterType === "all" ? true : t.tipo.toLowerCase() === filterType.toLowerCase();
    return matchSearch && matchType;
  });

  // Paginación
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-0">
      {/* Alerta */}
      {alertMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Atención: </strong>
          <span className="block sm:inline">{alertMessage}</span>
          <button onClick={() => setAlertMessage(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3" aria-label="Cerrar alerta">
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Cerrar</title>
              <path d="M14.348 5.652a1 1 0 10-1.414-1.414L10 7.172 7.066 4.238A1 1 0 105.652 5.652L8.586 8.586 5.652 11.52a1 1 0 101.414 1.414L10 9.828l2.934 2.934a1 1 0 001.414-1.414L11.414 8.586l2.934-2.934z" />
            </svg>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold">Movimientos</h2>
        <button onClick={openAdd} className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded">
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
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full border border-gray-300 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="relative inline-block text-left">
          <button type="button" onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-1 border border-gray-300 bg-white px-3 py-2 rounded text-sm hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filtro
          </button>
          {showFilters && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow z-10">
              {["all", "ingreso", "gasto"].map((type) => (
                <button
                  key={type}
                  onClick={() => { setFilterType(type); setShowFilters(false); setCurrentPage(1); }}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${filterType === type ? "bg-gray-100" : ""}`}>
                  {type === "all" ? "Todos" : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vista de Cards en móvil */}
<div className="grid gap-4 md:hidden">
  {currentItems.length ? (
    currentItems.map((t) => (
      <div key={t.id} className="bg-white shadow rounded p-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-semibold">{categories.find(cat => cat.id === t.categoria)?.nombre || t.categoria}</h3>
          <span className={`font-medium ${t.tipo?.toLowerCase() === "ingreso" ? "text-green-600" : "text-red-600"}`}>
            {t.tipo ? t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1) : "N/A"}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-1">{t.descripcion}</p>
        <p className="text-xs text-gray-400 mb-2">Fecha: {t.fecha}</p>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-gray-600">₡{!isNaN(Number(t.monto)) ? Number(t.monto).toLocaleString() : "0"}</span>
          <div className="space-x-2">
            <button onClick={() => openEdit(t)} className="text-blue-600 hover:underline">Editar</button>
            <button onClick={() => setTransactionToDelete(t)} className="text-red-600 hover:underline">Eliminar</button>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center text-gray-500 italic">No hay movimientos encontrados.</p>
  )}
</div>


      {/* Tabla en desktop */}
      <div className="hidden md:block overflow-x-auto mt-4">
        <table className="min-w-[600px] w-full bg-white shadow rounded overflow-hidden text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Fecha</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Descripción</th>
              <th className="p-3 text-right">Monto</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length ? (
              currentItems.map((t) => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{t.fecha}</td>
                  <td className="p-3">
                    <span className={`font-medium ${t.tipo?.toLowerCase() === "ingreso" ? "text-green-600" : "text-red-600"}`}>
                      {t.tipo ? t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1) : "N/A"}
                    </span>
                  </td>
                  <td className="p-3">{categories.find(cat => cat.id === t.categoria)?.nombre || t.categoria}</td>
                  <td className="p-3">{t.descripcion}</td>
                  <td className="p-3 text-right">₡{!isNaN(Number(t.monto)) ? Number(t.monto).toLocaleString() : "0"}</td>
                  <td className="p-3 text-center space-x-2">
                    <button onClick={() => openEdit(t)} className="text-sm text-blue-600 hover:underline">Editar</button>
                    <button onClick={() => setTransactionToDelete(t)} className="text-sm text-red-600 hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-6 italic">No hay movimientos encontrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >Anterior</button>
          <span className="text-sm">Página {currentPage} de {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >Siguiente</button>
        </div>
      )}

      {/* Modales */}
      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} existing={editing} />}
      <ConfirmModal
        isOpen={!!transactionToDelete}
        title="Confirmar eliminación"
        message="¿Estás seguro que quieres eliminar este movimiento?"
        onCancel={() => setTransactionToDelete(null)}
        onConfirm={() => {
          deleteTransaction(transactionToDelete.id);
          setTransactionToDelete(null);
          enqueueSnackbar("Movimiento eliminado correctamente.", { variant: "success" });
        }}
      />
    </div>
  );
}
