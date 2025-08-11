import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Chart({ data, categories }) {
  // Agrupar gastos por categoría (por nombre)
  const gastosPorCategoria = data
    .filter((t) => t.tipo === "Gasto")
    .reduce((acc, curr) => {
      // Obtener nombre de categoría por id
      const categoryName = categories.find(cat => cat.id === curr.categoria)?.nombre || "Sin categoría";

      // Buscar si ya está en acc
      const index = acc.findIndex((item) => item.name === categoryName);
      const montoNum = Number(curr.monto) || 0;

      if (index !== -1) {
        acc[index].value += montoNum;
      } else {
        acc.push({ name: categoryName, value: montoNum });
      }
      return acc;
    }, []);

  const COLORS = ["#f87171", "#fb923c", "#facc15", "#4ade80", "#60a5fa", "#c084fc"];

  return (
    <div className="bg-white p-4 shadow rounded h-80">
      <h2 className="text-lg font-semibold mb-2">Distribución de gastos</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={gastosPorCategoria}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {gastosPorCategoria.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
