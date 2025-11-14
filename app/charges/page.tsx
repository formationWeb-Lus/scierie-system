"use client";


import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function ChargesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [charges, setCharges] = useState<any[]>([]);
  const [form, setForm] = useState({
    date: "",
    fournisseur: "",
    quantite: "",
    poids: "",
    prix: "",
  });

  const fetchCharges = async () => {
    try {
      const res = await fetch("/charges/api");
      const data = await res.json();
      setCharges(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
    }
  };

  useEffect(() => {
    fetchCharges();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.fournisseur || !form.quantite || !form.poids || !form.prix) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    await fetch("/charges/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ date: "", fournisseur: "", quantite: "", poids: "", prix: "" });
    fetchCharges();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 🧭 SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full bg-blue-800 text-white w-64 transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 z-50`}
      >
        <div className="p-4 text-2xl font-bold border-b border-blue-700">🪵 Scierie</div>

        <nav className="flex flex-col p-4 space-y-2 text-sm">
          <a href="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">📊 Tableau de bord</a>
          <a href="/charges" className="bg-blue-700 px-3 py-2 rounded">💰 Charges</a>
          <a href="/expenses" className="hover:bg-blue-700 px-3 py-2 rounded">💸 Dépenses</a>
          <a href="/invoices" className="hover:bg-blue-700 px-3 py-2 rounded">🧾 Factures</a>
          <a href="/productions" className="hover:bg-blue-700 px-3 py-2 rounded">🪚 Productions</a>
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

      {/* 🧭 HEADER + CONTENU */}
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
              <div className="text-sm text-blue-200">Gestion des Charges</div>
            </div>
          </div>

          <nav className="hidden lg:flex gap-6 text-sm text-white/90">
            <a href="/dashboard" className="hover:text-white">Accueil</a>
            <a href="/reports" className="hover:text-white">Rapports</a>
            <a href="/settings" className="hover:text-white">Paramètres</a>
            <a href="/users" className="hover:text-white">Utilisateurs</a>
          </nav>
        </header>

        {/* CONTENU PRINCIPAL */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">⚙️ Gestion des Charges</h1>

          {/* FORMULAIRE */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-6 gap-4 mb-6"
          >
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border rounded-lg px-3 py-2 w-full"
            />
            <input
              type="text"
              name="fournisseur"
              placeholder="Fournisseur"
              value={form.fournisseur}
              onChange={(e) => setForm({ ...form, fournisseur: e.target.value })}
              className="border rounded-lg px-3 py-2 w-full"
            />
            <input
              type="number"
              name="quantite"
              placeholder="Quantité"
              value={form.quantite}
              onChange={(e) => setForm({ ...form, quantite: e.target.value })}
              className="border rounded-lg px-3 py-2 w-full"
            />
            <input
              type="number"
              name="poids"
              placeholder="Poids"
              value={form.poids}
              onChange={(e) => setForm({ ...form, poids: e.target.value })}
              className="border rounded-lg px-3 py-2 w-full"
            />
            <input
              type="number"
              name="prix"
              placeholder="Prix"
              value={form.prix}
              onChange={(e) => setForm({ ...form, prix: e.target.value })}
              className="border rounded-lg px-3 py-2 w-full"
            />
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg px-4 py-2 font-medium w-full"
            >
              ➕ Ajouter
            </button>
          </form>

          {/* TABLEAU */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-blue-600 text-white uppercase">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Fournisseur</th>
                  <th className="px-6 py-3">Quantité</th>
                  <th className="px-6 py-3">Poids</th>
                  <th className="px-6 py-3">Prix</th>
                </tr>
              </thead>
              <tbody>
                {charges.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-400">
                      Aucune charge enregistrée.
                    </td>
                  </tr>
                ) : (
                  charges.map((c) => (
                    <tr key={c.id} className="border-b hover:bg-blue-50 transition">
                      <td className="px-6 py-3">{new Date(c.date).toLocaleDateString("fr-FR")}</td>
                      <td className="px-6 py-3">{c.fournisseur}</td>
                      <td className="px-6 py-3">{c.quantite}</td>
                      <td className="px-6 py-3">{c.poids}</td>
                      <td className="px-6 py-3 font-semibold text-gray-900">${c.prix}</td>
                    </tr>
                  ))
                )}
              </tbody>
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