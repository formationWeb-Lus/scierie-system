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
    id: 0,
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
      setExpenses(Array.isArray(data) ? data : []);
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
    const categorieFinale = form.categorie === "Autre" ? form.otherCategorie : form.categorie;

    if (!form.date || !categorieFinale || !form.montant) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    setLoading(true);
    try {
      const method = form.id ? "PUT" : "POST";
      await fetch("/expenses/api" + (form.id ? "" : ""), {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id || undefined,
          date: form.date,
          categorie: categorieFinale,
          montant: parseFloat(form.montant),
        }),
      });

      setForm({ id: 0, date: "", categorie: "", otherCategorie: "", montant: "" });
      fetchExpenses();
    } catch {
      alert("Erreur lors de l’enregistrement !");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp: Expense) => {
    setForm({
      id: exp.id,
      date: exp.date,
      categorie: exp.categorie,
      otherCategorie: "",
      montant: exp.montant.toString(),
    });
    setMenuOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette dépense ?")) return;
    try {
      await fetch(`/expenses/api?id=${id}`, { method: "DELETE" });
      fetchExpenses();
    } catch {
      alert("Erreur lors de la suppression !");
    }
  };

  const totalGeneral = expenses.reduce((acc, exp) => acc + exp.montant, 0);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full bg-blue-800 text-white w-56 transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 z-50`}
      >
        <div className="p-4 text-xl font-bold border-b border-blue-700 flex justify-between items-center">
          🪵 Scierie
          <button className="lg:hidden p-1 rounded hover:bg-blue-700" onClick={() => setMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-2 text-sm">
          <a href="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">📊 Dashboard</a>
          <a href="/charges" className="hover:bg-blue-700 px-3 py-2 rounded">💰 Charges</a>
          <a href="/expenses" className="bg-blue-700 px-3 py-2 rounded">💸 Dépenses</a>
          <a href="/invoices" className="hover:bg-blue-700 px-3 py-2 rounded">🧾 Factures</a>
          <a href="/productions" className="hover:bg-blue-700 px-3 py-2 rounded">🪚 Prod.</a>
          <a href="/sales" className="hover:bg-blue-700 px-3 py-2 rounded">🛒 Ventes</a>
          <a href="/stock" className="hover:bg-blue-700 px-3 py-2 rounded">📦 Stock</a>
          <a href="/reports" className="hover:bg-blue-700 px-3 py-2 rounded">📊 Rapports</a>
          <a href="/settings" className="hover:bg-blue-700 px-3 py-2 rounded">⚙️ Param.</a>
          <a href="/users" className="hover:bg-blue-700 px-3 py-2 rounded">👤 Users</a>
        </nav>

        <div className="mt-auto px-4 py-4 text-xs text-blue-200 border-t border-blue-700">
          © {new Date().getFullYear()} ScieriePro
        </div>
      </aside>

      {/* CONTENU */}
      <div className="flex-1 flex flex-col">
        <header className="bg-blue-800 text-white flex items-center justify-between px-4 py-3 sticky top-0 z-40 shadow">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded hover:bg-blue-700" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <div className="text-lg font-bold">🪵 ScieriePro</div>
              <div className="text-sm text-blue-200">Gestion Dépenses</div>
            </div>
          </div>

          <nav className="hidden lg:flex gap-4 text-sm text-white/90">
            <a href="/dashboard" className="hover:text-white">Accueil</a>
            <a href="/charges" className="hover:text-white">Charges</a>
            <a href="/stock" className="hover:text-white">Stock</a>
            <a href="/productions" className="hover:text-white">Productions</a>
            <a href="/sales" className="hover:text-white">Ventes</a>
            <a href="/invoices" className="hover:text-white">Factures</a>
            <a href="/depenses" className="hover:text-white">Dépenses</a>
            <a href="/benefice" className="hover:text-white">Bénéfice</a>
            <a href="/reports" className="hover:text-white">Rapports</a>
            <a href="/settings" className="hover:text-white">Paramètres</a>
            <a href="/users" className="hover:text-white">Utilisateurs</a>
          </nav>
        </header>

        {/* MAIN */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">💼 Dépenses</h1>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-6 gap-3 mb-4 sm:mb-6">
            <input type="date" name="date" value={form.date} onChange={handleChange} className="border rounded px-2 py-1 w-full text-sm" />
            <select name="categorie" value={form.categorie} onChange={handleChange} className="border rounded px-2 py-1 w-full text-sm">
              <option value="">-- Catégorie --</option>
              <option value="Carburant">Carburant.</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Salaire">Salaire</option>
              <option value="Transport">Transport</option>
              <option value="Autre">Autre</option>
            </select>
            {form.categorie === "Autre" && (
              <input type="text" name="otherCategorie" value={form.otherCategorie} onChange={handleChange} placeholder="Autre" className="border rounded px-2 py-1 w-full md:col-span-2 text-sm" />
            )}
            <input type="number" name="montant" value={form.montant} onChange={handleChange} placeholder="Montant FC" className="border rounded px-2 py-1 w-full text-sm" />
            <button type="submit" disabled={loading} className="bg-blue-700 hover:bg-blue-800 text-white rounded px-3 py-1 font-medium w-full text-sm">
              {loading ? "..." : form.id ? "✏️ Modifier" : "💾 Ajouter"}
            </button>
          </form>

          {/* TABLE */}
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-blue-600 text-white uppercase text-xs sm:text-sm">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Cat.</th>
                  <th className="px-3 py-2 text-right">Montant</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-400 text-xs sm:text-sm">
                      Aucune dépense.
                    </td>
                  </tr>
                ) : (
                  expenses.map((exp) => (
                    <tr key={exp.id} className="border-b hover:bg-blue-50">
                      <td className="px-3 py-2 text-xs sm:text-sm">{new Date(exp.date).toLocaleDateString("fr-FR")}</td>
                      <td className="px-3 py-2 text-xs sm:text-sm">{exp.categorie}</td>
                      <td className="px-3 py-2 text-right text-xs sm:text-sm font-semibold">{exp.montant.toLocaleString("fr-FR")} FC</td>
                      <td className="px-3 py-2 flex gap-1 sm:gap-2">
                        <button onClick={() => handleEdit(exp)} className="px-2 py-1 bg-yellow-500 text-white rounded text-xs sm:text-sm">✏️</button>
                        <button onClick={() => handleDelete(exp.id)} className="px-2 py-1 bg-red-600 text-white rounded text-xs sm:text-sm">🗑️</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {expenses.length > 0 && (
                <tfoot className="bg-gray-100 font-semibold text-xs sm:text-sm">
                  <tr>
                    <td colSpan={2} className="text-right px-3 py-2">Total :</td>
                    <td className="px-3 py-2 text-blue-700 text-right">{totalGeneral.toLocaleString("fr-FR")} FC</td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </main>

        <footer className="bg-blue-800 text-white text-center py-2 text-xs sm:text-sm mt-auto shadow-inner">
          © {new Date().getFullYear()} ScieriePro
        </footer>
      </div>
    </div>
  );
}
