"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface StockItem {
  id: number;
  type: string;
  quantity: number;
  unitPrice: number;
  total: number;
  date: string;
}

export default function StockPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [form, setForm] = useState({
    type: "",
    quantity: "",
    unitPrice: "",
    total: 0,
  });

  const boisTypes = ["2x22", "2x15", "4x8", "5x5", "Volige", "Relav", "Déchets", "Palettes"];

  // Charger le stock
  const fetchStock = async () => {
    try {
      const res = await fetch("/stock/api");
      const data = await res.json();
      setStock(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur lors du chargement du stock:", error);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };

    if (name === "quantity" || name === "unitPrice") {
      const qty = parseFloat(updated.quantity) || 0;
      const price = parseFloat(updated.unitPrice) || 0;
      updated.total = qty * price;
    }

    setForm(updated);
  };

  // Enregistrer / mettre à jour le stock
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type || !form.quantity || !form.unitPrice) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    try {
      await fetch("/stock/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ type: "", quantity: "", unitPrice: "", total: 0 });
      fetchStock();
    } catch (err) {
      console.error("Erreur lors de l'ajout du stock:", err);
    }
  };

  const totalGeneral = stock.reduce((acc, s) => acc + s.total, 0);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
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
          <a href="/productions" className="hover:bg-blue-700 px-3 py-2 rounded">🪚 Productions</a>
          <a href="/sales" className="hover:bg-blue-700 px-3 py-2 rounded">🛒 Ventes</a>
          <a href="/stock" className="bg-blue-700 px-3 py-2 rounded">📦 Stock</a>
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
        {/* HEADER */}
        <header className="bg-blue-800 text-white flex items-center justify-between px-4 py-3 sticky top-0 z-40 shadow">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded hover:bg-blue-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <div className="text-lg font-bold">🪵 ScieriePro</div>
              <div className="text-sm text-blue-200">Gestion du Stock</div>
            </div>
          </div>

          <nav className="hidden lg:flex gap-6 text-sm text-white/90">
            <a href="/dashboard" className="hover:text-white">Accueil</a>
            <a href="/reports" className="hover:text-white">Rapports</a>
            <a href="/settings" className="hover:text-white">Paramètres</a>
            <a href="/users" className="hover:text-white">Utilisateurs</a>
          </nav>
        </header>

        {/* PAGE */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">📦 Gestion du Stock</h1>

          {/* FORMULAIRE */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-5 gap-4 mb-6"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Type de bois</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
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
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Ex: 50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prix unitaire ($)</label>
              <input
                type="number"
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Ex: 120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Total ($)</label>
              <input
                type="text"
                name="total"
                value={form.total.toLocaleString()}
                disabled
                className="w-full border rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg w-full"
              >
                ➕ Ajouter / Mettre à jour
              </button>
            </div>
          </form>

          {/* TABLEAU */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="bg-blue-600 text-white uppercase">
                <tr>
                  <th className="px-6 py-3">Type de bois</th>
                  <th className="px-6 py-3">Quantité</th>
                  <th className="px-6 py-3">Prix unitaire ($)</th>
                  <th className="px-6 py-3">Total ($)</th>
                  <th className="px-6 py-3">Dernière mise à jour</th>
                </tr>
              </thead>
              <tbody>
                {stock.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-400">
                      Aucun stock enregistré.
                    </td>
                  </tr>
                ) : (
                  stock.map((s) => (
                    <tr key={s.id} className="border-b hover:bg-blue-50 transition">
                      <td className="px-6 py-4">{s.type}</td>
                      <td className="px-6 py-4">{s.quantity}</td>
                      <td className="px-6 py-4">${s.unitPrice.toLocaleString()}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        ${s.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">{new Date(s.date).toLocaleDateString("fr-FR")}</td>
                    </tr>
                  ))
                )}
              </tbody>
              {stock.length > 0 && (
                <tfoot className="bg-gray-100 font-semibold">
                  <tr>
                    <td colSpan={3} className="px-6 py-3 text-right">Valeur totale du stock :</td>
                    <td className="px-6 py-3 text-blue-700">${totalGeneral.toLocaleString()}</td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="bg-blue-800 text-white text-center py-3 text-sm mt-auto shadow-inner">
          © {new Date().getFullYear()} ScieriePro — Tous droits réservés.
        </footer>
      </div>
    </div>
  );
}

