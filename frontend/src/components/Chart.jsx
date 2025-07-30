import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Chart({ data }) {
  const gastosPorCategoria = data
    .filter((t) => t.type === "Gasto")
    .reduce((acc, curr) => {
      const index = acc.findIndex((item) => item.name === curr.category);
      if (index !== -1) acc[index].value += curr.amount;
      else acc.push({ name: curr.category, value: curr.amount });
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
