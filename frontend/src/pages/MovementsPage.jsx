import React, { useState } from "react";
import { useTransactions } from "../context/TransactionContext";
import AddTransactionModal from "../components/AddTransactionModal";

export default function MovementsPage() {
  const { transactions, deleteTransaction } = useTransactions();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (transaction) => {
    setEditing(transaction);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Movimientos</h2>
        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Agregar movimiento
        </button>
      </div>

      <table className="w-full bg-white shadow rounded overflow-hidden text-sm">
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
          {transactions.map((t) => (
            <tr key={t.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{t.date}</td>
              <td className="p-3">{t.type}</td>
              <td className="p-3">{t.category}</td>
              <td className="p-3">{t.description}</td>
              <td className="p-3 text-right">₡{t.amount.toLocaleString()}</td>
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
          ))}
        </tbody>
      </table>

      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          existing={editing}
        />
      )}
    </div>
  );
}
