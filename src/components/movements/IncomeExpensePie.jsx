import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#22c55e", "#298981"]; // Ingreso, Gasto

export default function IncomeExpensePie({ totals }) {
  const data = [
    { name: "Ingresos", value: totals.inc },
    { name: "Gastos",   value: totals.exp },
  ];

  const total = totals.inc + totals.exp;

  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie dataKey="value" data={data} innerRadius={50} outerRadius={70}>
            {data.map((entry, idx) => (
              <Cell key={entry.name} fill={COLORS[idx]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, "Monto"]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center text-sm text-gray-500">
        Total filtrado: <strong>${total.toFixed(2)}</strong>
      </div>
    </div>
  );
}
