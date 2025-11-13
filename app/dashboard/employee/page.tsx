"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function HomePage() {
  const [data, setData] = useState<any>(null);

  // 🔹 Charger les données globales du tableau de bord
  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Erreur chargement dashboard :", err));
  }, []);

  if (!data)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Chargement du tableau de bord...
      </div>
    );

  const { resume, ventes, productions, stocks, depenses, charges } = data;

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-gray-50 min-h-screen">
      {/* Titre principal */}
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 text-center sm:text-left">
        📊 Tableau de Bord Général
      </h1>

      {/* 🔹 Cartes résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card title="Valeur du Stock" value={resume.totalStock} color="blue" />
        <Card title="Ventes totales" value={resume.totalVentes} color="green" />
        <Card title="Dépenses totales" value={resume.totalDepenses} color="red" />
        <Card title="Charges totales" value={resume.totalCharges} color="orange" />
      </div>

      {/* 🔹 Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <Graph title="Évolution des ventes" data={ventes} dataKey="total" />
        <Graph title="Production récente" data={productions} dataKey="total" />
      </div>

      {/* 🔹 Tableaux récents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <RecentTable
          title="📦 Derniers stocks"
          data={stocks}
          columns={["type", "quantity", "total"]}
        />
        <RecentTable
          title="🪚 Dernières productions"
          data={productions}
          columns={["typeBois", "quantity", "total"]}
        />
        <RecentTable
          title="💰 Dépenses récentes"
          data={depenses}
          columns={["categorie", "montant"]}
        />
        <RecentTable
          title="🚛 Charges récentes"
          data={charges}
          columns={["fournisseur", "prix"]}
        />
      </div>
    </div>
  );
}

// 🔹 Carte de résumé
function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className={`bg-${color}-100 border-l-4 border-${color}-600 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow hover:shadow-md transition-transform duration-200 hover:scale-[1.02]`}
    >
      <p className="text-xs sm:text-sm text-gray-600">{title}</p>
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mt-1">
        {value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
        })}
      </h2>
    </div>
  );
}

// 🔹 Graphique linéaire
function Graph({
  title,
  data,
  dataKey,
}: {
  title: string;
  data: any[];
  dataKey: string;
}) {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow overflow-hidden">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
        {title}
      </h3>
      <div className="w-full h-[220px] sm:h-[280px] md:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#2563eb"
              strokeWidth={2}
            />
            <CartesianGrid stroke="#eee" />
            <XAxis
              dataKey="date"
              tickFormatter={(v) => new Date(v).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip
              formatter={(value) =>
                `$${Number(value).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}`
              }
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// 🔹 Tableau récapitulatif
function RecentTable({
  title,
  data,
  columns,
}: {
  title: string;
  data: any[];
  columns: string[];
}) {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow overflow-x-auto">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 text-gray-800">
        {title}
      </h3>
      <table className="min-w-full text-xs sm:text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-800 uppercase">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-2 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-3 text-gray-400"
              >
                Aucune donnée disponible.
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                {columns.map((col) => (
                  <td
                    key={col}
                    className="px-2 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap max-w-[100px] sm:max-w-[150px] truncate"
                  >
                    {typeof (item as any)[col] === "number"
                      ? `$${Number((item as any)[col]).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}`
                      : (item as any)[col]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

