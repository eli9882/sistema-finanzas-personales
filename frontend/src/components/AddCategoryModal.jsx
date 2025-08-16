import React, { useState, useEffect } from "react";
import { useTransactions } from "../context/TransactionContext";
import { useSnackbar } from "notistack";

export default function AddCategoryModal({ onClose, existing = null }) {
  const { createCategory, updateCategory } = useTransactions();
  const { enqueueSnackbar } = useSnackbar();

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

    const category = {
      nombre: form.name,
      descripcion: form.description,
      tipo: form.type,
    };

      try {
      if (existing) {
        updateCategory(existing.id, category);
        enqueueSnackbar(`Categoría "${category.nombre}" actualizada correctamente.`, { variant: "success" });
      } else {
        createCategory(category);
        enqueueSnackbar(`Categoría "${category.nombre}" creada correctamente.`, { variant: "success" });
      }
      onClose();
    } catch (error) {
      enqueueSnackbar("Ocurrió un error. Intenta de nuevo.", { variant: "error" });
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md sm:rounded-lg rounded-md shadow-lg p-4 sm:p-6 mx-4 sm:mx-auto space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">
          {existing ? "Editar categoría" : "Agregar categoría"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm sm:text-base"
              required
              disabled={existing?.readonlyTipo}
            >
              <option value="Ingreso">Ingreso</option>
              <option value="Gasto">Gasto</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 border rounded text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-blue-400 text-white rounded text-sm sm:text-base"
            >
              {existing ? "Guardar" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
