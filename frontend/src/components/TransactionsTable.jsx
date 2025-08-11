import React from "react";

export default function TransactionsTable({ transactions = [] }) {
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
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500 italic">
                No hay movimientos.
              </td>
            </tr>
          ) : (
            transactions.map((t) => {
              const montoNum = Number(t?.monto);
              const montoFormateado =
                !isNaN(montoNum) && t.monto != null
                  ? montoNum.toLocaleString()
                  : "0";

              return (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2">{t.fecha}</td>
                  <td className="px-3 py-2">{t.tipo}</td>
                  <td className="px-3 py-2">{t.categoria}</td>
                  <td className="px-3 py-2">{t.descripcion}</td>
                  <td className="px-3 py-2 text-right">₡{montoFormateado}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
