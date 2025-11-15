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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    typeBois: "",
    quantity: "",
    unitPrice: "",
  });
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({ typeBois: "", quantity: "", unitPrice: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.typeBois || !form.quantity || !form.unitPrice) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        typeBois: form.typeBois,
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
      };

      if (editingId) {
        await fetch("/productions/api", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
      } else {
        await fetch("/productions/api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      resetForm();
      await fetchProductions();
      setMenuOpen(false);
    } catch (err) {
      console.error("Erreur POST/PUT production:", err);
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: Production) => {
    setEditingId(p.id);
    setForm({
      typeBois: p.typeBois,
      quantity: String(p.quantity),
      unitPrice: String(p.unitPrice),
    });
    setMenuOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous supprimer cette production ?")) return;
    try {
      await fetch(`/productions/api?id=${id}`, { method: "DELETE" });
      await fetchProductions();
      setMenuOpen(false);
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Suppression impossible.");
    }
  };

  const totalGeneral = productions.reduce((acc, p) => acc + (p.total || 0), 0);

  const formatCDF = (value: number) =>
    value.toLocaleString("fr-FR", { style: "currency", currency: "CDF", minimumFractionDigits: 0 });

  return (
    <div className="flex min-h-screen bg-blue-50 text-gray-800">
      {/* SIDEBAR */}
      {menuOpen && (
        <button
          aria-label="Fermer le menu"
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-full bg-blue-600 shadow-lg w-64 transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 z-40`}
      >
        <div className="p-4 flex items-center justify-between text-lg sm:text-xl font-bold border-b border-blue-700 text-white">
          <span>🪵 ScieriePro</span>
          <button
            className="lg:hidden p-2 rounded hover:bg-white/10"
            aria-label="Fermer le menu"
            onClick={() => setMenuOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-1 text-xs sm:text-sm font-medium text-white">
          <a href="/dashboard" className="px-3 py-2 rounded hover:bg-blue-700 truncate">📊 Tableau</a>
          <a href="/charges" className="px-3 py-2 rounded hover:bg-blue-700 truncate">💰 Charges</a>
          <a href="/expenses" className="px-3 py-2 rounded hover:bg-blue-700 truncate">💸 Dépenses</a>
          <a href="/invoices" className="px-3 py-2 rounded hover:bg-blue-700 truncate">🧾 Factures</a>
          <a href="/productions" className="px-3 py-2 rounded bg-blue-800 truncate">🪚 Productions</a>
          <a href="/sales" className="px-3 py-2 rounded hover:bg-blue-700 truncate">🛒 Ventes</a>
          <a href="/stock" className="px-3 py-2 rounded hover:bg-blue-700 truncate">📦 Stock</a>
          <a href="/reports" className="px-3 py-2 rounded hover:bg-blue-700 truncate">📊 Rapports</a>
          <a href="/settings" className="px-3 py-2 rounded hover:bg-blue-700 truncate">⚙️ Paramètres</a>
          <a href="/users" className="px-3 py-2 rounded hover:bg-blue-700 truncate">👤 Utilisateurs</a>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <header className="bg-blue-600 shadow px-4 py-3 flex items-center justify-between sticky top-0 z-20 border-b border-blue-700 text-white">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded hover:bg-white/10"
              onClick={() => setMenuOpen((s) => !s)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div>
              <div className="text-base sm:text-lg font-semibold">Gestion de la Production</div>
              <div className="text-[10px] sm:text-xs text-gray-200">ScieriePro</div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-4 sm:gap-6 text-[10px] sm:text-sm">
            <a href="/dashboard" className="hover:text-gray-200">Accueil</a>
            <a href="/reports" className="hover:text-gray-200">Rapports</a>
            <a href="/settings" className="hover:text-gray-200">Paramètres</a>
            <a href="/users" className="hover:text-gray-200">Utilisateurs</a>
          </nav>
        </header>

        <main className="flex-1 p-2 sm:p-4 lg:p-8 overflow-y-auto">
          <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">🪚 Gestion de la Production</h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-2 sm:p-4 rounded-lg shadow border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6"
          >
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">Type de bois</label>
              <select
                name="typeBois"
                value={form.typeBois}
                onChange={handleChange}
                className="w-full border rounded-md px-2 py-1 sm:px-3 sm:py-2 bg-gray-50 text-xs sm:text-sm"
              >
                <option value="">-- Sélectionner --</option>
                {boisTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">Quantité</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Ex: 10"
                className="w-full border rounded-md px-2 py-1 sm:px-3 sm:py-2 bg-gray-50 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">Prix unitaire (CDF)</label>
              <input
                type="number"
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
                placeholder="Ex: 100"
                className="w-full border rounded-md px-2 py-1 sm:px-3 sm:py-2 bg-gray-50 text-xs sm:text-sm"
              />
            </div>

            <div className="flex items-end">
              <div className="w-full">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md w-full shadow text-xs sm:text-sm"
                  disabled={loading}
                >
                  {editingId ? "✔️ Modifier" : "➕ Ajouter"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-1 sm:mt-2 w-full border rounded-md px-2 py-1 sm:px-3 sm:py-2 text-[10px] sm:text-sm"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="bg-white shadow rounded-lg border overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-[9px] sm:text-xs">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3">Type de bois</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3">Quantité</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3">Prix unitaire (CDF)</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3">Total (CDF)</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3">Date</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-[10px] sm:text-sm">
                {productions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-2 sm:py-4 text-gray-400">Aucune production enregistrée.</td>
                  </tr>
                ) : (
                  productions.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-2 sm:py-3">{p.typeBois}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-3">{p.quantity}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-3">{formatCDF(p.unitPrice)}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-3 font-semibold text-gray-900">{formatCDF(p.total)}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-3">{new Date(p.date).toLocaleDateString("fr-FR")}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-3 flex gap-1 sm:gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded px-2 py-1 sm:px-3 sm:py-1 text-[9px] sm:text-sm"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="bg-red-600 hover:bg-red-700 text-white rounded px-2 py-1 sm:px-3 sm:py-1 text-[9px] sm:text-sm"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              {productions.length > 0 && (
                <tfoot className="bg-gray-50 font-medium text-xs sm:text-sm">
                  <tr>
                    <td colSpan={3} className="px-3 sm:px-6 py-2 sm:py-3 text-right">Total général :</td>
                    <td className="px-3 sm:px-6 py-2 sm:py-3 text-blue-600">{formatCDF(totalGeneral)}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </main>

        <footer className="bg-blue-600 text-center py-2 sm:py-3 text-[10px] sm:text-sm text-white border-t mt-auto">
          © {new Date().getFullYear()} ScieriePro — Tous droits réservés.
        </footer>
      </div>
    </div>
  );
}
