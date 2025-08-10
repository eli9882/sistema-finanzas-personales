import { Calendar, Filter } from "lucide-react";

export default function FiltersBar({ filters, onChange, categories }) {
  const set = (field, value) => onChange(prev => ({ ...prev, [field]: value }));

  return (
    <div className="mb-4 border rounded p-4">
      <div className="flex items-center gap-3 mb-3">
        <Filter className="h-4 w-4 text-gray-500" />
        <h3 className="font-medium">Filtros</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Fecha inicio */}
        <div>
          <label className="block text-sm font-medium mb-1">Desde</label>
          <div className="relative">
            <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={filters.start}
              onChange={e => set("start", e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Fecha fin */}
        <div>
          <label className="block text-sm font-medium mb-1">Hasta</label>
          <div className="relative">
            <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={filters.end}
              onChange={e => set("end", e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select
            value={filters.type}
            onChange={e => set("type", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option>Todos</option>
            <option>Ingreso</option>
            <option>Gasto</option>
          </select>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select
            value={filters.category}
            onChange={e => set("category", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {categories.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
