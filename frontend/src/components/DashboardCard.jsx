import React from "react";

export default function DashboardCard({ label, value }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-xl font-semibold text-blue-600">₡{value.toLocaleString()}</p>
    </div>
  );
}
