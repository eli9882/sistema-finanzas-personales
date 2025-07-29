import React from "react";
import { useTransactions } from "../context/TransactionContext";
import DashboardCard from "../components/DashboardCard";
import Chart from "../components/Chart";
import TransactionsTable from "../components/TransactionsTable";

export default function DashboardPage() {
  const { transactions } = useTransactions();

  const ingresos = transactions.filter((t) => t.type === "Ingreso");
  const gastos = transactions.filter((t) => t.type === "Gasto");

  const totalIngresos = ingresos.reduce((sum, t) => sum + t.amount, 0);
  const totalGastos = gastos.reduce((sum, t) => sum + t.amount, 0);
  const totalCaja = totalIngresos - totalGastos;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Bienvenido, Juan!</h2>

      <div className="grid grid-cols-3 gap-4">
        <DashboardCard label="Total en caja actual" value={totalCaja} />
        <DashboardCard label="Ingresos del mes" value={totalIngresos} />
        <DashboardCard label="Gastos del mes" value={totalGastos} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Chart data={transactions} />
        <TransactionsTable transactions={transactions} />
      </div>
    </div>
  );
}