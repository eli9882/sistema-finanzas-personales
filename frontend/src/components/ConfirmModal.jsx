import React from "react";

export default function ConfirmModal({
  isOpen,
  title = "Confirmar acción",
  message = "¿Estás seguro?",
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
        <p className="mb-6 text-sm text-gray-700 text-center">{message}</p>
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 text-sm"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
          >
            Sí
          </button>
        </div>
      </div>
    </div>
  );
}
