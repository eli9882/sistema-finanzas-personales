import React, { useState, useEffect } from "react";
import { useTransactions } from "../context/TransactionContext";

export default function AddTransactionModal({ onClose, existing = null }) {
  const { addTransaction, editTransaction, categories } = useTransactions();

  const [form, setForm] = useState({
    date: "",
    type: "Ingreso",
    category: "",
    amount: "",
    description: "",
  });

  useEffect(() => {
    if (existing) {
      setForm({
        date: existing.fecha || "",
        type: existing.tipo || "Ingreso",
        category: existing.categoria?.toString() || "",
        amount: existing.monto?.toString() || "",
        description: existing.descripcion || "",
      });
    }
  }, [existing]);


  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const transaction = {
      tipo: form.type,
      monto: parseFloat(form.amount),
      fecha: form.date,
      descripcion: form.description,
      categoria: Number(form.category),  // <-- aquí
    };

    if (existing) {
      editTransaction(transaction);
    } else {
      addTransaction(transaction);
    }

    onClose();
  };

  const filteredCategories = (categories || []).filter(
    (cat) => (cat.tipo || "").toLowerCase() === (form.type || "").toLowerCase()
  );


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {existing ? "Editar movimiento" : "Agregar movimiento"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium">Fecha</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium">Tipo</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Ingreso">Ingreso</option>
              <option value="Gasto">Gasto</option>
            </select>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium">Categoría</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Selecciona una categoría</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Monto */}
          <div>
            <label className="block text-sm font-medium">Monto</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium">Descripción</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {existing ? "Guardar cambios" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
