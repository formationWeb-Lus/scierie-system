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
import { Menu, X } from "lucide-react"; // icônes pour menu

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        const dashboardData = await res.json();

        // Récupérer le bénéfice
        const beneficeRes = await fetch("/benefice/api");
        const beneficeData = await beneficeRes.json();

        dashboardData.resume.totalBenefice = beneficeData.benefice || 0;

        setData(dashboardData);
      } catch (err) {
        console.error("Erreur chargement dashboard :", err);
      }
    }

    fetchDashboard();
  }, []);

  if (!data)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Chargement du tableau de bord...
      </div>
    );

  const { resume, ventes, productions, stocks, depenses, charges } = data;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 🔹 HEADER */}
      <header className="bg-blue-800 text-white shadow-md sticky top-0 z-50">
        <div className="flex justify-between items-center p-4">
          <button
            className="lg:hidden p-2 rounded hover:bg-blue-700 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center w-full lg:w-auto">
            🪵 Système de Gestion de Scierie – Tableau de Bord
          </h1>
        </div>
        <nav
          className={`bg-blue-700 lg:flex lg:justify-center lg:space-x-8 text-sm font-medium transition-all duration-300 overflow-hidden ${
            menuOpen ? "max-h-64 py-2" : "max-h-0 lg:max-h-none"
          }`}
        >
          <ul className="flex flex-col lg:flex-row lg:items-center text-center space-y-2 lg:space-y-0 lg:space-x-6">
            <li><a href="/" className="block px-3 py-1 hover:text-yellow-300">🏠 Accueil</a></li>
            <li><a href="/charges" className="block px-3 py-1 hover:text-yellow-300">💸 Charges</a></li>
            <li><a href="/stock" className="block px-3 py-1 hover:text-yellow-300">📦 Stock</a></li>
            <li><a href="/productions" className="block px-3 py-1 hover:text-yellow-300">🪚 Productions</a></li>
            <li><a href="/depenses" className="block px-3 py-1 hover:text-yellow-300">💸 Dépenses</a></li>
            <li><a href="/sales" className="block px-3 py-1 hover:text-yellow-300">🛒 Ventes</a></li>
            <li><a href="/benefice" className="block px-3 py-1 hover:text-yellow-300">💰 Bénéfice</a></li>
            <li><a href="/charges" className="block px-3 py-1 hover:text-yellow-300">⚙️ Charges</a></li>
          </ul>
        </nav>
      </header>

      {/* 🔹 CONTENU PRINCIPAL */}
      <main className="flex-grow p-3 sm:p-4 md:p-6 lg:p-8 space-y-6 sm:space-y-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center sm:text-left">
          📊 Tableau de Bord Général
        </h2>

        {/* Cartes résumé */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          <Card title="Valeur du Stock" value={resume.totalStock} color="blue" />
          <Card title="Ventes totales" value={resume.totalVentes} color="green" />
          <Card title="Dépenses totales" value={resume.totalDepenses} color="red" />
          <Card title="Charges totales" value={resume.totalCharges} color="orange" />
          <Card title="Bénéfice" value={resume.totalBenefice} color="teal" />
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <Graph title="Évolution des ventes" data={ventes} dataKey="total" />
          <Graph title="Production récente" data={productions} dataKey="total" />
        </div>

        {/* Graphique bénéfice */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-600 mb-4">
            💰 Évolution du Bénéfice
          </h2>
          <BeneficeGraph />
        </div>

        {/* Tableaux récents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <RecentTable title="📦 Derniers stocks" data={stocks} columns={["type", "quantity", "total"]} />
          <RecentTable title="🪚 Dernières productions" data={productions} columns={["typeBois", "quantity", "total"]} />
          <RecentTable title="💰 Dépenses récentes" data={depenses} columns={["categorie", "montant"]} />
          <RecentTable title="🚛 Charges récentes" data={charges} columns={["fournisseur", "prix"]} />
        </div>
      </main>

      {/* 🔹 FOOTER */}
      <footer className="bg-blue-900 text-gray-200 py-4 text-center text-sm mt-6">
        © {new Date().getFullYear()} ScieriePro – Gestion complète de scierie.
        <br />
        Développé avec ❤️ par l’équipe WebAcademy.
      </footer>
    </div>
  );
}

/* === COMPOSANTS === */

function Card({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className={`bg-${color}-100 border-l-4 border-${color}-600 p-3 sm:p-4 rounded-lg shadow hover:shadow-md transition-transform duration-200 hover:scale-[1.02]`}>
      <p className="text-xs sm:text-sm text-gray-600">{title}</p>
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mt-1">
        {value.toLocaleString("fr-CD", { style: "currency", currency: "CDF", minimumFractionDigits: 2 })}
      </h2>
    </div>
  );
}

function Graph({ title, data, dataKey }: { title: string; data: any[]; dataKey: string }) {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow overflow-hidden">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <div className="w-full h-[220px] sm:h-[280px] md:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey={dataKey} stroke="#2563eb" strokeWidth={2} />
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString()} />
            <YAxis />
            <Tooltip formatter={(value) => Number(value).toLocaleString("fr-CD", { style: "currency", currency: "CDF", minimumFractionDigits: 2 })} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// 🔹 Graphique Bénéfice
function BeneficeGraph() {
  const [graphData, setGraphData] = useState<any[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const [productionsRes, chargesRes, depensesRes] = await Promise.all([
          fetch("/productions/api"),
          fetch("/charges/api"),
          fetch("/expenses/api"),
        ]);

        const [productions, charges, depenses] = await Promise.all([
          productionsRes.json(),
          chargesRes.json(),
          depensesRes.json(),
        ]);

        const datesSet = new Set<string>();
        productions.forEach((p: any) => datesSet.add(new Date(p.date).toLocaleDateString()));
        charges.forEach((c: any) => datesSet.add(new Date(c.date).toLocaleDateString()));
        depenses.forEach((d: any) => datesSet.add(new Date(d.date).toLocaleDateString()));

        const dates = Array.from(datesSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        const data = dates.map((date) => {
          const totalProduction = productions.filter((p: any) => new Date(p.date).toLocaleDateString() === date).reduce((sum: number, p: any) => sum + p.total, 0);
          const totalCharges = charges.filter((c: any) => new Date(c.date).toLocaleDateString() === date).reduce((sum: number, c: any) => sum + c.prix, 0);
          const totalDepenses = depenses.filter((d: any) => new Date(d.date).toLocaleDateString() === date).reduce((sum: number, d: any) => sum + d.montant, 0);
          return { date, benefice: totalProduction - totalCharges - totalDepenses };
        });

        setGraphData(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="w-full h-[300px] sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={graphData}>
          <Line type="monotone" dataKey="benefice" stroke="#16a34a" strokeWidth={2} />
          <CartesianGrid stroke="#eee" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => Number(value).toLocaleString("fr-CD", { style: "currency", currency: "CDF", minimumFractionDigits: 2 })} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function RecentTable({ title, data, columns }: { title: string; data: any[]; columns: string[] }) {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow overflow-x-auto">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <table className="min-w-full text-xs sm:text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-800 uppercase">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-2 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-3 text-gray-400">
                Aucune donnée disponible.
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col} className="px-2 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap max-w-[100px] sm:max-w-[150px] truncate">
                    {typeof (item as any)[col] === "number"
                      ? Number((item as any)[col]).toLocaleString("fr-CD", { style: "currency", currency: "CDF", minimumFractionDigits: 2 })
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

