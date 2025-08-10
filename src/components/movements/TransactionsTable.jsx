import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export default function TransactionsTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-primary-600 text-white">
          <tr>
            <th className="px-4 py-2 text-left w-28">Fecha</th>
            <th className="px-4 py-2 text-left w-24">Tipo</th>
            <th className="px-4 py-2 text-left">Categoría</th>
            <th className="px-4 py-2 text-right w-32">Monto</th>
            <th className="px-4 py-2 text-left">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((t) => (
              <tr key={t.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-2">{t.date}</td>
                <td className="px-4 py-2 flex items-center gap-2">
                  {t.type === "Ingreso" ? (
                    <ArrowUpCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownCircle className="h-4 w-4 text-red-500" />
                  )}
                  {t.type}
                </td>
                <td className="px-4 py-2">{t.category}</td>
                <td className="px-4 py-2 text-right">${t.amount.toFixed(2)}</td>
                <td className="px-4 py-2">{t.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-8 text-center text-gray-500 italic">
                No hay resultados con los filtros aplicados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
