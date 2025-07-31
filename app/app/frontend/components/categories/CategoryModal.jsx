import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import clsx from "clsx";

export default function CategoryModal({
  mode = "create",
  data,
  onClose,
  onCreate,
  onUpdate,
}) {
  const isEdit = mode === "edit";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  /* Cargar datos al abrir en modo edición */
  useEffect(() => {
    if (isEdit && data) {
      setName(data.name);
      setDescription(data.description);
    }
  }, [isEdit, data]);

  /* Validación muy básica (solo front‑end) */
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    const payload = { id: data?.id, name: name.trim(), description };
    isEdit ? onUpdate(payload) : onCreate(payload);
    onClose(); // cerrar
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded shadow-lg w-full max-w-lg">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Editar Categoría" : "Crear Categoría"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulario */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              className={clsx(
                "w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1",
                error
                  ? "border-red-600 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary-500",
              )}
            />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded"
          >
            <Plus size={16} /> Guardar
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-sm font-medium px-4 py-2 rounded"
          >
            <X size={16} /> Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
