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

import {
  Home,
  Settings,
  Package,
  Factory,
  ShoppingCart,
  DollarSign,
  FileText,
  BarChart2,
  User,
} from "lucide-react";

function MenuLink({
  href,
  icon,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center space-x-2 p-2 rounded hover:bg-blue-200 transition"
    >
      {icon}
      <span>{text}</span>
    </a>
  );
}

export default function BeneficePage() {
  const [benefice, setBenefice] = useState(0);
  const [graphData, setGraphData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBenefice();
    fetchGraphData();
  }, []);

  async function fetchBenefice() {
    try {
      const res = await fetch("/benefice/api");
      const data = await res.json();
      setBenefice(data.benefice || 0);
    } catch (err) {
      console.error("Erreur fetchBenefice:", err);
    }
  }

  async function fetchGraphData() {
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

      const dates = Array.from(datesSet).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );

      const data = dates.map((date) => {
        const totalProduction = productions
          .filter((p: any) => new Date(p.date).toLocaleDateString() === date)
          .reduce((sum: number, p: any) => sum + p.total, 0);

        const totalCharges = charges
          .filter((c: any) => new Date(c.date).toLocaleDateString() === date)
          .reduce((sum: number, c: any) => sum + c.prix, 0);

        const totalDepenses = depenses
          .filter((d: any) => new Date(d.date).toLocaleDateString() === date)
          .reduce((sum: number, d: any) => sum + d.montant, 0);

        return {
          date,
          production: totalProduction,
          charges: totalCharges,
          depenses: totalDepenses,
          benefice: totalProduction - totalCharges - totalDepenses,
        };
      });

      setGraphData(data);
    } catch (err) {
      console.error("Erreur fetchGraphData:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-200 text-lg bg-blue-100">
        Chargement du bénéfice...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-blue-100">
      {/* 🔹 HEADER */}
      <header className="bg-blue-800 text-white shadow-md p-4 text-center text-lg font-bold">
        💰 Bénéfice de la scierie
      </header>

      <div className="flex flex-1">
        {/* 🔹 Menu de navigation */}
        <aside className="w-64 bg-blue-700 text-white shadow-md p-4">
          <nav className="flex flex-col space-y-2 text-sm">
            <MenuLink href="/" icon={<Home size={16} />} text="Accueil" />
            <MenuLink href="/charges" icon={<Settings size={16} />} text="Charges" />
            <MenuLink href="/stock" icon={<Package size={16} />} text="Stock" />
            <MenuLink href="/productions" icon={<Factory size={16} />} text="Production" />
            <MenuLink href="/sales" icon={<ShoppingCart size={16} />} text="Ventes" />
            <MenuLink href="/expenses" icon={<DollarSign size={16} />} text="Dépenses" />
            <MenuLink href="/invoices" icon={<FileText size={16} />} text="Factures" />
            <MenuLink href="/benefice" icon={<DollarSign size={16} />} text="Bénéfice" />
            <MenuLink href="/reports" icon={<BarChart2 size={16} />} text="Rapports" />
            <MenuLink href="/parametres" icon={<Settings size={16} />} text="Paramètres" />
            <MenuLink href="/utilisateurs" icon={<User size={16} />} text="Utilisateurs" />
          </nav>
        </aside>

        {/* 🔹 Contenu principal */}
        <main className="flex-1 p-6 space-y-6">
          {/* Carte bénéfice actuel */}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-600">
              Bénéfice actuel
            </h2>
            <p className="text-3xl sm:text-4xl font-bold text-green-600 mt-2">
              {benefice.toLocaleString("fr-FR", { style: "currency", currency: "CDF" })}
            </p>
          </div>

          {/* Graphique */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-600 mb-4">
              Évolution du bénéfice
            </h2>
            <div className="w-full h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData}>
                  <Line type="monotone" dataKey="benefice" stroke="#16a34a" strokeWidth={2} />
                  <CartesianGrid stroke="#eee" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) =>
                      Number(value).toLocaleString("fr-FR", { style: "currency", currency: "CDF" })
                    }
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tableau récapitulatif */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-600 mb-4">
              Détail par date
            </h2>
            <table className="min-w-full text-left text-sm text-gray-700">
              <thead className="bg-blue-800 text-white uppercase">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Production</th>
                  <th className="px-3 py-2">Charges</th>
                  <th className="px-3 py-2">Dépenses</th>
                  <th className="px-3 py-2">Bénéfice</th>
                </tr>
              </thead>
              <tbody>
                {graphData.map((row, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2">{row.date}</td>
                    <td className="px-3 py-2">
                      {row.production.toLocaleString("fr-FR", { style: "currency", currency: "CDF" })}
                    </td>
                    <td className="px-3 py-2">
                      {row.charges.toLocaleString("fr-FR", { style: "currency", currency: "CDF" })}
                    </td>
                    <td className="px-3 py-2">
                      {row.depenses.toLocaleString("fr-FR", { style: "currency", currency: "CDF" })}
                    </td>
                    <td className="px-3 py-2 font-bold text-green-600">
                      {row.benefice.toLocaleString("fr-FR", { style: "currency", currency: "CDF" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* 🔹 FOOTER */}
      <footer className="bg-blue-800 text-white text-center py-4 mt-6">
        © {new Date().getFullYear()} ScieriePro – Gestion complète de scierie. Développé avec ❤️ par WebAcademy.
      </footer>
    </div>
  );
}
