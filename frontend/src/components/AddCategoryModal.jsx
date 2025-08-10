import React, { useState, useEffect } from "react";
import { useTransactions } from "../context/TransactionContext";

export default function AddCategoryModal({ onClose, existing = null }) {
  const { createCategory, updateCategory } = useTransactions();

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "Ingreso",
  });

  useEffect(() => {
  if (existing) {
    setForm({
      name: existing.nombre || "",
      description: existing.descripcion || "",
      type: existing.tipo || "Ingreso",
    });
  }
}, [existing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  // Prepara el objeto con los campos que espera tu backend
  const category = {
    nombre: form.name,
    descripcion: form.description,
    tipo: form.type,
  };

  if (existing) {
    updateCategory(existing.id, category);
  } else {
    createCategory(category);
  }

  onClose();
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {existing ? "Editar categoría" : "Agregar categoría"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Descripción</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Tipo</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="Ingreso">Ingreso</option>
              <option value="Gasto">Gasto</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              {existing ? "Guardar cambios" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
