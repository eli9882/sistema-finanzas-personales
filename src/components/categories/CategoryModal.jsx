// src/components/categories/CategoryModal.jsx
import { useEffect, useMemo, useState } from "react";

export default function CategoryModal({
  mode = "create",          // "create" | "edit"
  data = null,              // { id, name, description }
  onClose,
  onCreate,                 // (cat) => boolean | Promise<boolean>
  onUpdate,                 // (cat) => boolean | Promise<boolean>
  validateName,             // (name, excludeId?) => boolean (true si YA existe)
}) {
  const isEdit = mode === "edit";

  const [name, setName] = useState(data?.name ?? "");
  const [description, setDescription] = useState(data?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [errName, setErrName] = useState("");

  const trimmed = (s) => s.trim().replace(/\s+/g, " ");
  const nameNorm = useMemo(() => trimmed(name), [name]);

  // Validación reactiva de nombre
  useEffect(() => {
    if (!nameNorm) {
      setErrName("El nombre es obligatorio.");
      return;
    }
    // validamos contra el padre; si devuelve true => YA existe
    if (validateName && validateName(nameNorm, data?.id)) {
      setErrName("Ya existe una categoría con ese nombre.");
      return;
    }
    setErrName("");
  }, [nameNorm, validateName, data?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errName || !nameNorm || saving) return;

    const payload = {
      id: data?.id ?? Date.now().toString(),
      name: nameNorm,
      description: trimmed(description),
    };

    try {
      setSaving(true);
      const result = isEdit ? onUpdate?.(payload) : onCreate?.(payload);
      const ok = await Promise.resolve(result); // <- soporta sync/async

      if (!ok) {
        setErrName("Ya existe una categoría con ese nombre.");
        return;
      }
      onClose?.(); // <- se cierra SOLO si ok === true
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[620px] max-w-[92vw] rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Editar Categoría" : "Crear Categoría"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded border px-3 py-2 outline-none focus:ring ${
                errName
                  ? "border-red-500 ring-red-200"
                  : "border-gray-300 ring-blue-200 focus:border-blue-500"
              }`}
              placeholder="Ej. Trabajo"
              autoFocus
            />
            {errName && <p className="mt-1 text-sm text-red-600">{errName}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded border border-gray-300 px-3 py-2 outline-none ring-blue-200 focus:border-blue-500 focus:ring"
              placeholder="Ej. Salario"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!!errName || !nameNorm || saving}
              className={`rounded px-4 py-2 text-sm text-white ${
                !!errName || !nameNorm || saving
                  ? "cursor-not-allowed bg-blue-300"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}