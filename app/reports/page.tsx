"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  LineChart as LineIcon,
  BarChart as BarIcon,
  Table as TableIcon,
  PieChart as PieIcon,
} from "lucide-react";

type ReportType =
  | "charges"
  | "depenses"
  | "factures"
  | "productions"
  | "ventes"
  | "stocks";
type PeriodType = "daily" | "weekly" | "monthly" | "yearly";
type ViewType = "bar" | "line" | "pie" | "table";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>("productions");
  const [period, setPeriod] = useState<PeriodType>("weekly");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [view, setView] = useState<ViewType>("bar");
  const [payload, setPayload] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgg = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/reports/api?type=${reportType}&period=${period}&date=${selectedDate}`
        );
        if (!res.ok) throw new Error(`Erreur API ${res.status}`);
        const json = await res.json();
        setPayload(json);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };
    fetchAgg();
  }, [reportType, period, selectedDate]);

  const PercentBadge = ({ value }: { value: number }) => {
    const rounded = Math.round(value * 10) / 10;
    const isUp = rounded > 0;
    const isDown = rounded < 0;
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
          isUp
            ? "bg-green-100 text-green-700"
            : isDown
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {isUp && <ArrowUpRight size={16} />}
        {isDown && <ArrowDownRight size={16} />}
        {Math.abs(rounded)}%
      </motion.div>
    );
  };

  const renderChart = () => {
    if (!payload) return null;

    switch (view) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={payload.data || payload.items}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                dataKey="value"
                data={payload.data || payload.items}
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {(payload.data || payload.items).map((_: any, index: number) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case "table":
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {Object.keys(payload.data?.[0] || payload.items?.[0] || {}).map(
                    (key) => (
                      <th
                        key={key}
                        className="px-4 py-2 text-left font-semibold border-b"
                      >
                        {key.toUpperCase()}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {(payload.data || payload.items || []).map(
                  (row: Record<string, unknown>, i: number) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      {Object.values(row).map((value, j) => (
                        <td
                          key={j}
                          className="px-4 py-2 border-b text-gray-700"
                        >
                          {typeof value === "number"
                            ? value.toLocaleString()
                            : String(value ?? "")}
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        );

      default:
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={payload.data || payload.items}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Tableau de bord — Rapports
          </h1>
          <p className="text-gray-500">
            Visualisez les données selon différents formats
          </p>
        </div>

        <div className="flex gap-2 mt-4 sm:mt-0">
          {[
            { type: "bar", icon: BarIcon, label: "Barres" },
            { type: "line", icon: LineIcon, label: "Lignes" },
            { type: "pie", icon: PieIcon, label: "Camembert" },
            { type: "table", icon: TableIcon, label: "Tableau" },
          ].map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => setView(type as ViewType)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm ${
                view === type
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 🔹 Filtres */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl shadow border border-gray-100">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value as ReportType)}
          className="border p-2 rounded-lg"
        >
          <option value="charges">Charges</option>
          <option value="depenses">Dépenses</option>
          <option value="factures">Factures</option>
          <option value="productions">Productions</option>
          <option value="ventes">Ventes</option>
          <option value="stocks">Stocks</option>
        </select>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as PeriodType)}
          className="border p-2 rounded-lg"
        >
          <option value="daily">Journalière</option>
          <option value="weekly">Hebdomadaire</option>
          <option value="monthly">Mensuelle</option>
          <option value="yearly">Annuelle</option>
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded-lg"
        />
      </div>

      {/* 🔹 Résumé global */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white p-5 rounded-xl shadow border border-gray-100"
        >
          <div className="text-sm text-gray-500">Total période</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">
            {payload
              ? (payload.totalCurrent ?? payload.total ?? 0).toLocaleString()
              : "—"}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white p-5 rounded-xl shadow border border-gray-100"
        >
          <div className="text-sm text-gray-500">Progression</div>
          <div className="mt-2">
            {payload &&
            (payload.percentChange !== undefined ||
              payload.totalPrev !== undefined) ? (
              <PercentBadge
                value={
                  payload.percentChange ??
                  (((payload.total ?? 0) - (payload.totalPrev ?? 0)) /
                    Math.max(1, Math.abs(payload.totalPrev ?? 0))) *
                    100
                }
              />
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white p-5 rounded-xl shadow border border-gray-100"
        >
          <div className="text-sm text-gray-500">Type de rapport</div>
          <div className="text-lg font-semibold capitalize mt-2 text-gray-800">
            {reportType}
          </div>
        </motion.div>
      </div>

      {/* 🔹 Graphique / Tableau */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow border border-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-60 text-gray-500">
            <Loader2 className="animate-spin mr-2" /> Chargement des données...
          </div>
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : (
          renderChart()
        )}
      </motion.div>
    </div>
  );
}
