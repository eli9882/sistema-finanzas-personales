import React from "react";
import { useTransactions } from "../context/TransactionContext";
import DashboardCard from "../components/DashboardCard";
import Chart from "../components/Chart";
import TransactionsTable from "../components/TransactionsTable";

export default function DashboardPage() {
  const { transactions, categories } = useTransactions();

  const ingresos = transactions.filter((t) => t.tipo === "Ingreso");
  const gastos = transactions.filter((t) => t.tipo === "Gasto");

  const safeParseMonto = (monto) => {
    if (!monto) return 0;
    const cleaned = monto.toString().replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const totalIngresos = ingresos.reduce((sum, t) => sum + safeParseMonto(t.monto), 0);
  const totalGastos = gastos.reduce((sum, t) => sum + safeParseMonto(t.monto), 0);
  const totalCaja = totalIngresos - totalGastos;

  const formatCurrency = (value) => {
    return value.toLocaleString("es-CR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">Bienvenido!</h2>

      {/* Cards: en móvil 1 col, en sm 2 cols, en lg 3 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard label="Total en caja actual" value={formatCurrency(totalCaja)} />
        <DashboardCard label="Ingresos del mes" value={formatCurrency(totalIngresos)} />
        <DashboardCard label="Gastos del mes" value={formatCurrency(totalGastos)} />
      </div>

      {/* Gráfica + Tabla: en móvil stack, en lg lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Chart data={transactions} categories={categories} />
        <TransactionsTable transactions={transactions} />
      </div>
    </div>
  );
}
