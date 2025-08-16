import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function Chart({ data, categories }) {
  const gastosPorCategoria = data
    .filter(t => t.tipo === "Gasto")
    .reduce((acc, curr) => {
      const categoryName =
        categories.find(cat => cat.id === curr.categoria)?.nombre || "Sin categoría";
      const montoNum = Number(curr.monto) || 0;
      const existing = acc.find(item => item.name === categoryName);

      if (existing) {
        existing.value += montoNum;
      } else {
        acc.push({ name: categoryName, value: montoNum });
      }
      return acc;
    }, []);

  if (gastosPorCategoria.length === 0) return <p>No hay gastos para mostrar</p>;

  const COLORS = ["#f87171", "#fb923c", "#facc15", "#4ade80", "#60a5fa", "#c084fc"];

  return (
    <div className="bg-white p-4 shadow rounded h-80 sm:h-96 flex flex-col">
      <h2 className="text-base sm:text-lg font-semibold mb-2">
        Distribución de gastos
      </h2>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gastosPorCategoria}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="70%"
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) / 2;
                const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

                return (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={12}
                    fontWeight="bold"
                  >
                    {(percent * 100).toFixed(0)}%
                  </text>
                );
              }}
            >
              {gastosPorCategoria.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₡${value.toLocaleString()}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
        {gastosPorCategoria.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            {entry.name}
          </div>
        ))}
      </div>
    </div>
  );
}
