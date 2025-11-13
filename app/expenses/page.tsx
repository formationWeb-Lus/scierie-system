"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface Expense {
  id: number;
  date: string;
  categorie: string;
  montant: number;
}

export default function ExpensePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({
    date: "",
    categorie: "",
    otherCategorie: "",
    montant: "",
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/expenses/api");
      const data = await res.json();
      setExpenses(data);
    } catch {
      setExpenses([]);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const categorieFinale =
      form.categorie === "Autre" ? form.otherCategorie : form.categorie;

    if (!form.date || !categorieFinale || !form.montant) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    setLoading(true);
    try {
      await fetch("/expenses/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: form.date,
          categorie: categorieFinale,
          montant: parseFloat(form.montant),
        }),
      });

      setForm({ date: "", categorie: "", otherCategorie: "", montant: "" });
      fetchExpenses();
    } catch {
      alert("Erreur lors de l’enregistrement !");
    } finally {
      setLoading(false);
    }
  };

  const totalGeneral = expenses.reduce((acc, exp) => acc + exp.montant, 0);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ✅ Menu latéral */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full bg-blue-800 text-white w-64 transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 z-50`}
      >
        <div className="p-4 text-2xl font-bold border-b border-blue-600">
          🪵 Scierie
        </div>
        <nav className="flex flex-col p-4 space-y-2 text-sm">
          <a href="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">📊 Tableau de bord</a>
          <a href="/charges" className="hover:bg-blue-700 px-3 py-2 rounded">💰 Charges</a>
          <a href="/expenses" className="bg-blue-700 px-3 py-2 rounded">💸 Dépenses</a>
          <a href="/invoices" className="hover:bg-blue-700 px-3 py-2 rounded">🧾 Factures</a>
          <a href="/productions" className="hover:bg-blue-700 px-3 py-2 rounded">🪚 Productions</a>
          <a href="/sales" className="hover:bg-blue-700 px-3 py-2 rounded">🛒 Ventes</a>
          <a href="/stock" className="hover:bg-blue-700 px-3 py-2 rounded">📦 Stock</a>
          <a href="/reports" className="hover:bg-blue-700 px-3 py-2 rounded">📈 Rapports</a>
          <a href="/parametres" className="hover:bg-blue-700 px-3 py-2 rounded">⚙️ Paramètres</a>
          <a href="/utilisateurs" className="hover:bg-blue-700 px-3 py-2 rounded">👤 Utilisateurs</a>
        </nav>
      </aside>

      {/* ✅ Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* ✅ En-tête */}
        <header className="bg-blue-700 text-white flex items-center justify-between px-4 py-3 lg:py-4">
          <div className="flex items-center space-x-2">
            <button
              className="lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-lg font-semibold">💼 Gestion des Dépenses</h1>
          </div>

          {/* Menu horizontal (desktop) */}
          <nav className="hidden lg:flex space-x-6 text-sm">
            <a href="/dashboard" className="hover:underline">Accueil</a>
            <a href="/reports" className="hover:underline">Rapports</a>
            <a href="/parametres" className="hover:underline">Paramètres</a>
          </nav>
        </header>

        {/* ✅ Contenu */}
        <main className="flex-1 p-4 sm:p-6">
          {/* Formulaire */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
          >
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
            />
            <select
              name="categorie"
              value={form.categorie}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">-- Catégorie --</option>
              <option value="Carburant">Carburant</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Salaire">Salaire</option>
              <option value="Transport">Transport</option>
              <option value="Autre">Autre</option>
            </select>
            {form.categorie === "Autre" && (
              <input
                type="text"
                name="otherCategorie"
                value={form.otherCategorie}
                onChange={handleChange}
                placeholder="Autre catégorie"
                className="border rounded px-3 py-2 text-sm col-span-1 sm:col-span-2"
              />
            )}
            <input
              type="number"
              name="montant"
              value={form.montant}
              onChange={handleChange}
              placeholder="Montant ($)"
              className="border rounded px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              {loading ? "Enregistrement..." : "💾 Ajouter"}
            </button>
          </form>

          {/* Tableau */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-xs sm:text-sm text-left text-gray-600">
              <thead className="bg-blue-600 text-white uppercase">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Catégorie</th>
                  <th className="px-4 py-2 text-right">Montant ($)</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-3 text-gray-400">
                      Aucune dépense enregistrée.
                    </td>
                  </tr>
                ) : (
                  expenses.map((exp) => (
                    <tr key={exp.id} className="border-b hover:bg-blue-50">
                      <td className="px-4 py-2">{new Date(exp.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{exp.categorie}</td>
                      <td className="px-4 py-2 text-right font-semibold">${exp.montant.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
              {expenses.length > 0 && (
                <tfoot className="bg-gray-100 font-semibold">
                  <tr>
                    <td colSpan={2} className="text-right px-4 py-2">
                      Total :
                    </td>
                    <td className="px-4 py-2 text-green-700 text-right">
                      ${totalGeneral.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </main>

        {/* ✅ Pied de page */}
        <footer className="bg-blue-700 text-white text-center py-3 text-sm">
          © {new Date().getFullYear()} Scierie - Tous droits réservés.
        </footer>
      </div>
    </div>
  );
}
