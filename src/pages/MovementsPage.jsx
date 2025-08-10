import { useMemo, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import MainContainer from "../components/layout/MainContainer";
import FiltersBar from "../components/movements/FiltersBar";
import IncomeExpensePie from "../components/movements/IncomeExpensePie";
import TransactionsTable from "../components/movements/TransactionsTable";

/** Datos de ejemplo. SE CAMBIAN AL CONECTAR EL BACKEND*/
// Datos de ejemplo completos
const INITIAL_TX = [
  // Ingresos
  { id: 1,  date: "2025-07-01", type: "Ingreso", category: "Salario",    amount: 1200, description: "Pago quincena" },
  { id: 2,  date: "2025-07-03", type: "Ingreso", category: "Freelance",  amount: 450,  description: "Proyecto web" },
  { id: 3,  date: "2025-07-05", type: "Ingreso", category: "Inversiones",amount: 200,  description: "Dividendos" },
  { id: 4,  date: "2025-07-10", type: "Ingreso", category: "Venta",      amount: 150,  description: "Venta de bicicleta" },
  { id: 5,  date: "2025-07-15", type: "Ingreso", category: "Regalo",     amount: 100,  description: "Cumpleaños" },
  
  // Gastos - Transporte
  { id: 6,  date: "2025-07-02", type: "Gasto", category: "Transporte", amount: 25, description: "Taxi" },
  { id: 7,  date: "2025-07-06", type: "Gasto", category: "Transporte", amount: 50, description: "Gasolina" },
  
  // Gastos - Comida
  { id: 8,  date: "2025-07-04", type: "Gasto", category: "Comida", amount: 15, description: "Desayuno" },
  { id: 9,  date: "2025-07-07", type: "Gasto", category: "Comida", amount: 40, description: "Cena con amigos" },

  // Gastos - Servicios
  { id: 10, date: "2025-07-08", type: "Gasto", category: "Servicios", amount: 60, description: "Internet" },
  { id: 11, date: "2025-07-09", type: "Gasto", category: "Servicios", amount: 35, description: "Electricidad" },

  // Gastos - Ocio
  { id: 12, date: "2025-07-12", type: "Gasto", category: "Ocio", amount: 80, description: "Concierto" },
  { id: 13, date: "2025-07-14", type: "Gasto", category: "Ocio", amount: 25, description: "Cine" },

  // Gastos - Educación
  { id: 14, date: "2025-07-11", type: "Gasto", category: "Educación", amount: 120, description: "Curso online" },
  { id: 15, date: "2025-07-16", type: "Gasto", category: "Educación", amount: 30, description: "Libros" },

  // Gastos - Salud
  { id: 16, date: "2025-07-13", type: "Gasto", category: "Salud", amount: 45, description: "Medicinas" },
  { id: 17, date: "2025-07-17", type: "Gasto", category: "Salud", amount: 90, description: "Consulta médica" },
];


export default function MovementsPage() {
  const [tx] = useState(INITIAL_TX);

  // Filtros controlados
  const [filters, setFilters] = useState({
    start: "",   // yyyy-mm-dd
    end:   "",
    type:  "Todos", // Todos | Ingreso | Gasto
    category: "Todas", // Todas o una existente
  });

  // Derivar categorías únicas para el select
  const categories = useMemo(() => {
    const set = new Set(tx.map(t => t.category));
    return ["Todas", ...Array.from(set)];
  }, [tx]);

  // Filtrado reactivo
  const filtered = useMemo(() => {
    return tx.filter(t => {
      const d = new Date(t.date);
      const okStart = filters.start ? d >= new Date(filters.start) : true;
      const okEnd   = filters.end   ? d <= new Date(filters.end)   : true;
      const okType  = filters.type === "Todos" ? true : t.type === filters.type;
      const okCat   = filters.category === "Todas" ? true : t.category === filters.category;
      return okStart && okEnd && okType && okCat;
    });
  }, [tx, filters]);

  // Totales para la gráfica
  const totals = useMemo(() => {
    const inc = filtered.filter(t => t.type === "Ingreso").reduce((a,b)=>a+b.amount,0);
    const exp = filtered.filter(t => t.type === "Gasto").reduce((a,b)=>a+b.amount,0);
    return { inc, exp };
  }, [filtered]);

  return (
    <div className="flex flex-col h-screen">
      <Header title="Movimientos" />

      <MainContainer max={false}>
        {/* Filtros */}
        <FiltersBar
          filters={filters}
          onChange={setFilters}
          categories={categories}
        />

        {/* Gráfica + Tabla */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-3">Proporción Ingresos/Gastos</h3>
            <IncomeExpensePie totals={totals} />
          </div>

          <div className="lg:col-span-2 border rounded">
            <TransactionsTable rows={filtered} />
          </div>
        </div>
      </MainContainer>

      <Footer />
    </div>
  );
}
