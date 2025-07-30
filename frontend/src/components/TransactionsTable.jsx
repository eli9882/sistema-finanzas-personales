import React from "react";

export default function TransactionsTable({ transactions }) {
  return (
    <div className="bg-white p-4 shadow rounded overflow-x-auto">
      <h2 className="text-lg font-semibold mb-2">Últimos movimientos</h2>
      <table className="min-w-full text-sm text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2">Fecha</th>
            <th className="px-3 py-2">Tipo</th>
            <th className="px-3 py-2">Categoría</th>
            <th className="px-3 py-2">Descripción</th>
            <th className="px-3 py-2">Monto</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-t hover:bg-gray-50">
              <td className="px-3 py-2">{t.date}</td>
              <td className="px-3 py-2">{t.type}</td>
              <td className="px-3 py-2">{t.category}</td>
              <td className="px-3 py-2">{t.description}</td>
              <td className="px-3 py-2 text-right">₡{t.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
