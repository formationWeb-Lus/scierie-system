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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    type: "",
    quantity: "",
    unitPrice: "",
    total: 0,
  });

  const boisTypes = ["2x22", "2x15", "4x8", "5x5", "Volige", "Relav", "Déchets", "Palettes"];

  const formatCDF = (value: number) =>
    value.toLocaleString("fr-FR", { style: "currency", currency: "CDF", minimumFractionDigits: 0 });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type || !form.quantity || !form.unitPrice) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId ? { id: editingId, ...form } : form;

      const res = await fetch("/stock/api", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setForm({ type: "", quantity: "", unitPrice: "", total: 0 });
        setEditingId(null);
        fetchStock();
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de l'enregistrement du stock.");
      }
    } catch (err) {
      console.error("Erreur POST/PUT stock:", err);
      alert("Erreur réseau lors de l'enregistrement.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous supprimer ce stock ?")) return;

    try {
      await fetch(`/stock/api?id=${id}`, { method: "DELETE" });
      fetchStock();
    } catch (err) {
      console.error("Erreur DELETE stock:", err);
      alert("Impossible de supprimer ce stock.");
    }
  };

  const handleEdit = (s: StockItem) => {
    setEditingId(s.id);
    setForm({
      type: s.type,
      quantity: String(s.quantity),
      unitPrice: String(s.unitPrice),
      total: s.total,
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
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
        <div className="p-4 text-2xl font-bold border-b border-blue-700 flex justify-between items-center">
          <span>🪵 Scierie</span>
          <button
            className="lg:hidden p-2 hover:bg-blue-700 rounded"
            onClick={() => setMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-2 text-sm">
          <a href="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded truncate">📊 Tableau de bord</a>
          <a href="/charges" className="hover:bg-blue-700 px-3 py-2 rounded truncate">💰 Charges</a>
          <a href="/expenses" className="hover:bg-blue-700 px-3 py-2 rounded truncate">💸 Dépenses</a>
          <a href="/invoices" className="hover:bg-blue-700 px-3 py-2 rounded truncate">🧾 Factures</a>
          <a href="/productions" className="hover:bg-blue-700 px-3 py-2 rounded truncate">🪚 Productions</a>
          <a href="/sales" className="hover:bg-blue-700 px-3 py-2 rounded truncate">🛒 Ventes</a>
          <a href="/stock" className="bg-blue-700 px-3 py-2 rounded truncate">📦 Stock</a>
          <a href="/reports" className="hover:bg-blue-700 px-3 py-2 rounded truncate">📊 Rapports</a>
          <a href="/settings" className="hover:bg-blue-700 px-3 py-2 rounded truncate">⚙️ Paramètres</a>
          <a href="/users" className="hover:bg-blue-700 px-3 py-2 rounded truncate">👤 Utilisateurs</a>
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
              <div className="text-lg sm:text-base font-bold truncate">🪵 ScieriePro</div>
              <div className="text-sm sm:text-xs text-blue-200 truncate">Gestion du Stock</div>
            </div>
          </div>
        </header>

        {/* PAGE */}
        <main className="flex-1 p-4 sm:p-4 lg:p-8 overflow-y-auto">
          <h1 className="text-2xl sm:text-xl font-semibold mb-6 text-gray-800 truncate">📦 Gestion du Stock</h1>

          {/* FORMULAIRE MOBILE-FRIENDLY */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-3 mb-6 max-w-xs mx-auto"
          >
            <label className="block text-sm font-medium">Type de bois</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded-lg px-2 py-2 text-sm"
            >
              <option value="">-- Sélectionner --</option>
              {boisTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <label className="block text-sm font-medium">Quantité</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border rounded-lg px-2 py-2 text-sm"
              placeholder="Ex: 50"
            />

            <label className="block text-sm font-medium">Prix unitaire (CDF)</label>
            <input
              type="number"
              name="unitPrice"
              value={form.unitPrice}
              onChange={handleChange}
              className="w-full border rounded-lg px-2 py-2 text-sm"
              placeholder="Ex: 120"
            />

            <label className="block text-sm font-medium">Total (CDF)</label>
            <input
              type="text"
              name="total"
              value={formatCDF(form.total)}
              disabled
              className="w-full border rounded-lg px-2 py-2 bg-gray-100 text-sm"
            />

            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-lg w-full text-sm"
            >
              {editingId ? "✏️ Modifier" : "➕ Ajouter"}
            </button>
          </form>

          {/* TABLEAU SCROLLABLE */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="bg-blue-600 text-white uppercase text-xs">
                <tr>
                  <th className="px-3 py-2">Type de bois</th>
                  <th className="px-3 py-2">Quantité</th>
                  <th className="px-3 py-2">Prix unitaire (CDF)</th>
                  <th className="px-3 py-2">Total (CDF)</th>
                  <th className="px-3 py-2">Dernière mise à jour</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stock.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-3 text-gray-400 text-xs">
                      Aucun stock enregistré.
                    </td>
                  </tr>
                ) : (
                  stock.map((s) => (
                    <tr key={s.id} className="border-b hover:bg-blue-50 transition text-xs">
                      <td className="px-3 py-2">{s.type}</td>
                      <td className="px-3 py-2">{s.quantity}</td>
                      <td className="px-3 py-2">{formatCDF(s.unitPrice)}</td>
                      <td className="px-3 py-2 font-semibold text-gray-900">{formatCDF(s.total)}</td>
                      <td className="px-3 py-2">{new Date(s.date).toLocaleDateString("fr-FR")}</td>
                      <td className="px-3 py-2 flex flex-wrap gap-1">
                        <button
                          onClick={() => handleEdit(s)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {stock.length > 0 && (
                <tfoot className="bg-gray-100 font-semibold text-xs">
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-right">Valeur totale du stock :</td>
                    <td className="px-3 py-2 text-blue-700">{formatCDF(totalGeneral)}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </main>

        {/* FOOTER */}
        <div className="bg-blue-800 text-white text-center py-2 text-xs mt-auto shadow-inner">
          © {new Date().getFullYear()} ScieriePro — Tous droits réservés.
        </div>
      </div>
    </div>
  );
}
