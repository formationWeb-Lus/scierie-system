"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface Production {
  id: number;
  typeBois: string;
  quantity: number;
  unitPrice: number;
  total: number;
  date: string;
}

export default function ProductionsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productions, setProductions] = useState<Production[]>([]);
  const [form, setForm] = useState({
    typeBois: "",
    quantity: "",
    unitPrice: "",
  });

  const boisTypes = [
    "2x22",
    "2x15",
    "4x8",
    "5x5",
    "Volige",
    "Relav",
    "Déchets",
    "Palettes",
  ];

  // Charger les productions
  const fetchProductions = async () => {
    try {
      const res = await fetch("/productions/api");
      const data = await res.json();
      setProductions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur lors du chargement des productions :", err);
      setProductions([]);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, []);

  // Gérer formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Ajouter une production
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.typeBois || !form.quantity || !form.unitPrice) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    try {
      await fetch("/productions/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ typeBois: "", quantity: "", unitPrice: "" });
      fetchProductions();
    } catch (err) {
      console.error("Erreur POST production:", err);
      alert("Erreur lors de l'enregistrement.");
    }
  };

  const totalGeneral = productions.reduce((acc, p) => acc + (p.total || 0), 0);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR (vertical, bleu) */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full bg-blue-800 text-white w-64 transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 z-50`}
      >
        <div className="p-4 text-2xl font-bold border-b border-blue-700">🪵 Scierie</div>

        <nav className="flex flex-col p-4 space-y-2 text-sm">
          <a href="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">📊 Tableau de bord</a>
          <a href="/charges" className="hover:bg-blue-700 px-3 py-2 rounded">💰 Charges</a>
          <a href="/expenses" className="hover:bg-blue-700 px-3 py-2 rounded">💸 Dépenses</a>
          <a href="/invoices" className="hover:bg-blue-700 px-3 py-2 rounded">🧾 Factures</a>
          <a href="/productions" className="bg-blue-700 px-3 py-2 rounded">🪚 Productions</a>
          <a href="/sales" className="hover:bg-blue-700 px-3 py-2 rounded">🛒 Ventes</a>
          <a href="/stock" className="hover:bg-blue-700 px-3 py-2 rounded">📦 Stock</a>
          <a href="/reports" className="hover:bg-blue-700 px-3 py-2 rounded">📊 Rapports</a>
          <a href="/settings" className="hover:bg-blue-700 px-3 py-2 rounded">⚙️ Paramètres</a>
          <a href="/users" className="hover:bg-blue-700 px-3 py-2 rounded">👤 Utilisateurs</a>
        </nav>

        <div className="mt-auto px-4 py-4 text-xs text-blue-200 border-t border-blue-700">
          © {new Date().getFullYear()} ScieriePro
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 flex flex-col">
        {/* HEADER (bleu) */}
        <header className="bg-blue-800 text-white flex items-center justify-between px-4 py-3 sticky top-0 z-40 shadow">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded hover:bg-blue-700 transition"
              onClick={() => setMenuOpen((s) => !s)}
              aria-label="Ouvrir le menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <div className="text-lg font-bold">🪵 ScieriePro</div>
              <div className="text-sm text-blue-200">Gestion de la Production</div>
            </div>
          </div>

          {/* menu horizontal (desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm text-white/90">
            <a href="/dashboard" className="hover:text-white">Accueil</a>
            <a href="/reports" className="hover:text-white">Rapports</a>
            <a href="/settings" className="hover:text-white">Paramètres</a>
            <a href="/users" className="hover:text-white">Utilisateurs</a>
          </nav>
        </header>

        {/* MOBILE overlay menu (slide-in) */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          >
            <div className="absolute inset-0 bg-black/40" />
            <aside
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-0 w-64 h-full bg-blue-800 text-white p-4 shadow-lg animate-slideIn"
            >
              <div className="mb-4">
                <div className="text-2xl font-bold">🪵 Scierie</div>
                <div className="text-xs text-blue-200 mt-1">Menu</div>
              </div>

              <nav className="flex flex-col gap-2">
                <a href="/dashboard" className="px-3 py-2 rounded hover:bg-blue-700">📊 Tableau de bord</a>
                <a href="/charges" className="px-3 py-2 rounded hover:bg-blue-700">💰 Charges</a>
                <a href="/expenses" className="px-3 py-2 rounded hover:bg-blue-700">💸 Dépenses</a>
                <a href="/invoices" className="px-3 py-2 rounded hover:bg-blue-700">🧾 Factures</a>
                <a href="/productions" className="px-3 py-2 rounded bg-blue-700">🪚 Productions</a>
                <a href="/sales" className="px-3 py-2 rounded hover:bg-blue-700">🛒 Ventes</a>
                <a href="/stock" className="px-3 py-2 rounded hover:bg-blue-700">📦 Stock</a>
                <a href="/reports" className="px-3 py-2 rounded hover:bg-blue-700">📊 Rapports</a>
                <a href="/settings" className="px-3 py-2 rounded hover:bg-blue-700">⚙️ Paramètres</a>
                <a href="/users" className="px-3 py-2 rounded hover:bg-blue-700">👤 Utilisateurs</a>
              </nav>
            </aside>
          </div>
        )}

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">🪚 Gestion de la Production</h1>

          {/* Formulaire */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 lg:p-6 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Type de bois</label>
              <select
                name="typeBois"
                value={form.typeBois}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">-- Sélectionner --</option>
                {boisTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Quantité</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Ex: 10"
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prix unitaire ($)</label>
              <input
                type="number"
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
                placeholder="Ex: 100"
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md w-full"
              >
                ➕ Ajouter
              </button>
            </div>
          </form>

          {/* Tableau */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="bg-blue-600 text-white uppercase">
                <tr>
                  <th className="px-6 py-3">Type de bois</th>
                  <th className="px-6 py-3">Quantité</th>
                  <th className="px-6 py-3">Prix unitaire ($)</th>
                  <th className="px-6 py-3">Total ($)</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {productions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-3 text-gray-400">Aucune production enregistrée.</td>
                  </tr>
                ) : (
                  productions.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-blue-50">
                      <td className="px-6 py-3">{p.typeBois}</td>
                      <td className="px-6 py-3">{p.quantity}</td>
                      <td className="px-6 py-3">${p.unitPrice.toLocaleString()}</td>
                      <td className="px-6 py-3 font-semibold text-gray-900">${p.total.toLocaleString()}</td>
                      <td className="px-6 py-3">{new Date(p.date).toLocaleDateString("fr-FR")}</td>
                    </tr>
                  ))
                )}
              </tbody>
              {productions.length > 0 && (
                <tfoot className="bg-gray-100 font-semibold">
                  <tr>
                    <td colSpan={3} className="px-6 py-3 text-right">Total général :</td>
                    <td className="px-6 py-3 text-blue-700">${totalGeneral.toLocaleString()}</td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </main>

        {/* FOOTER (bleu) */}
        <footer className="bg-blue-800 text-white text-center py-3 text-sm mt-auto shadow-inner">
          © {new Date().getFullYear()} ScieriePro — Tous droits réservés.
        </footer>
      </div>
    </div>
  );
}

