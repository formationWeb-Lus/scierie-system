"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  ShoppingCart,
  Package,
  Factory,
  DollarSign,
  FileText,
  Settings,
  BarChart2,
  User,
} from "lucide-react";

interface Vente {
  id: number;
  type: string;
  quantity: number;
  unitPrice: number;
  total: number;
  unite?: string;
  date: string;
}

export default function SalesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [form, setForm] = useState({
    type: "",
    quantity: "",
    unitPrice: "",
    unite: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const boisTypes = [
    "2x22 planche",
    "2x15 planche",
    "4x8 planche",
    "5x5 planche",
    "Voliges",
    "Relaves",
    "Déchets",
    "Palettes",
  ];

  // 🔹 Charger les ventes
  const fetchsales = async () => {
    try {
      const res = await fetch("/sales/api");
      const data = await res.json();
      setVentes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur fetch ventes:", err);
      setVentes([]);
    }
  };

  useEffect(() => {
    fetchsales();
  }, []);

  // 🔹 Gérer les champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Ajouter ou modifier une vente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type || !form.quantity || !form.unitPrice) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...form, id: editingId } : form;

      const res = await fetch("/sales/api", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        alert(editingId ? "✅ Vente modifiée !" : "✅ Vente enregistrée !");
        setForm({ type: "", quantity: "", unitPrice: "", unite: "" });
        setEditingId(null);
        fetchsales();
      } else {
        alert(`❌ Erreur : ${data.error || "Impossible d'enregistrer la vente."}`);
      }
    } catch (err) {
      console.error("Erreur POST/PUT vente:", err);
      alert("Erreur réseau lors de l'enregistrement.");
    }
  };

  // 🔹 Modifier une vente
  const handleEdit = (vente: Vente) => {
    setEditingId(vente.id);
    setForm({
      type: vente.type,
      quantity: vente.quantity.toString(),
      unitPrice: vente.unitPrice.toString(),
      unite: vente.unite || "",
    });

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 🔹 Supprimer une vente
  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette vente ?")) return;

    try {
      const res = await fetch(`/sales/api?id=${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        alert("✅ Vente supprimée !");
        fetchsales();
      } else {
        alert(`❌ Erreur : ${data.error || "Impossible de supprimer la vente."}`);
      }
    } catch (err) {
      console.error("Erreur DELETE vente:", err);
      alert("Erreur réseau lors de la suppression.");
    }
  };

  // 🔹 Fonction pour formater en francs congolais
  const formatCDF = (value: number) =>
    value.toLocaleString("fr-FR", { style: "currency", currency: "CDF", minimumFractionDigits: 0 });

  const totalGeneral = ventes.reduce((acc, v) => acc + (v.total || 0), 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 🔹 HEADER PROFESSIONNEL */}
      <header className="bg-blue-800 text-white flex items-center justify-between px-4 py-3 shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded hover:bg-blue-700 transition"
            aria-label="Ouvrir le menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl">🪵</span>
            <h1 className="text-lg sm:text-xl font-bold">ScieriePro</h1>
          </div>
        </div>

        <nav className="hidden lg:flex lg:items-center lg:space-x-6 text-sm">
          <Link href="/" className="text-white/90 hover:text-white">Accueil</Link>
          <Link href="/charges" className="text-white/90 hover:text-white">Charges</Link>
          <Link href="/stock" className="text-white/90 hover:text-white">Stock</Link>
          <Link href="/productions" className="text-white/90 hover:text-white">Productions</Link>
          <Link href="/sales" className="text-white/90 hover:text-white">Ventes</Link>
          <Link href="/expenses" className="text-white/90 hover:text-white">Dépenses</Link>
          <Link href="/invoices" className="text-white/90 hover:text-white">Factures</Link>
          <Link href="/benefice" className="text-white/90 hover:text-white">Bénéfice</Link>
          <Link href="/reports" className="text-white/90 hover:text-white">Rapports</Link>
          <Link href="/parametres" className="text-white/90 hover:text-white">Paramètres</Link>
          <Link href="/utilisateurs" className="text-white/90 hover:text-white">Utilisateurs</Link>
        </nav>
      </header>

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-64 bg-blue-900 text-gray-100 py-6 space-y-2 shadow-lg">
          <div className="px-4 mb-4">
            <div className="text-2xl font-bold">🪵 Scierie</div>
            <div className="text-xs text-blue-200 mt-1">Gestion & Production</div>
          </div>

          <nav className="flex-1 px-2 space-y-1">
            <MenuLink href="/" icon={<Home size={16} />} text="Accueil" />
            <MenuLink href="/charges" icon={<Settings size={16} />} text="Charges" />
            <MenuLink href="/stock" icon={<Package size={18} />} text="Stock" />
            <MenuLink href="/productions" icon={<Factory size={16} />} text="Production" />
            <MenuLink href="/sales" icon={<ShoppingCart size={16} />} text="Ventes" />
            <MenuLink href="/expenses" icon={<DollarSign size={16} />} text="Dépenses" /> 
            <MenuLink href="/invoices" icon={<FileText size={16} />} text="Factures" />
            <MenuLink href="/reports" icon={<BarChart2 size={16} />} text="Rapports" />
            <MenuLink href="/parametres" icon={<Settings size={16} />} text="Paramètres" />
            <MenuLink href="/utilisateurs" icon={<User size={16} />} text="Utilisateurs" />
          </nav>

          <div className="px-4 py-4 text-xs text-blue-200 border-t border-blue-800">
            © {new Date().getFullYear()} ScieriePro
          </div>
        </aside>

        {/* CONTENU PRINCIPAL */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">
            💰 Gestion des Ventes
          </h1>

          {/* FORMULAIRE */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
          >
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Type de bois</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 appearance-none z-10 relative"
                style={{ maxWidth: '100%' }}
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
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prix unitaire (CDF)</label>
              <input
                type="number"
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
                placeholder="Ex: 120000"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-col gap-2 items-end">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full"
              >
                {editingId ? "✏️ Modifier la vente" : "💾 Enregistrer la vente"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setForm({ type: "", quantity: "", unitPrice: "", unite: "" }); setEditingId(null); }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg w-full"
                >
                  ❌ Annuler
                </button>
              )}
            </div>
          </form>

          {/* TABLEAU */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="bg-green-600 text-white text-sm uppercase">
                <tr>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Quantité</th>
                  <th className="px-6 py-3">Prix unitaire</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ventes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-400">
                      Aucune vente enregistrée.
                    </td>
                  </tr>
                ) : (
                  ventes.map((v) => (
                    <tr key={v.id} className="border-b hover:bg-green-50 transition">
                      <td className="px-6 py-4">{v.type}</td>
                      <td className="px-6 py-4">{v.quantity}</td>
                      <td className="px-6 py-4">{formatCDF(v.unitPrice)}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{formatCDF(v.total)}</td>
                      <td className="px-6 py-4">{new Date(v.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(v)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {ventes.length > 0 && (
                <tfoot className="bg-gray-100 font-semibold">
                  <tr>
                    <td colSpan={3} className="px-6 py-3 text-right">
                      Total des ventes :
                    </td>
                    <td className="px-6 py-3 text-green-700">
                      {formatCDF(totalGeneral)}
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </main>
      </div>

      {/* 🔹 FOOTER */}
      <footer className="bg-blue-900 text-gray-200 py-3 text-center text-sm shadow-inner">
        © {new Date().getFullYear()} ScieriePro — Tous droits réservés.
      </footer>

      {/* 🔹 MENU MOBILE */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-0 w-64 h-full bg-blue-900 text-gray-100 py-6 px-4 space-y-4 shadow-lg animate-slideIn"
          >
            <div className="mb-4">
              <div className="text-2xl font-bold">🪵 Scierie</div>
              <div className="text-xs text-blue-200 mt-1">Menu</div>
            </div>

            <nav className="flex flex-col space-y-2">
              <MobileMenuLink href="/" icon={<Home size={18} />} text="Accueil" onClick={() => setMenuOpen(false)} />
              <MobileMenuLink href="/sales" icon={<ShoppingCart size={18} />} text="Ventes" onClick={() => setMenuOpen(false)} />
              <MobileMenuLink href="/stock" icon={<Package size={18} />} text="Stock" onClick={() => setMenuOpen(false)} />
              <MobileMenuLink href="/productions" icon={<Factory size={18} />} text="Production" onClick={() => setMenuOpen(false)} />
              <MobileMenuLink href="/expenses" icon={<DollarSign size={18} />} text="Dépenses" onClick={() => setMenuOpen(false)} />
              <MobileMenuLink href="/charges" icon={<Settings size={18} />} text="Charges" onClick={() => setMenuOpen(false)} />
              <MobileMenuLink href="/invoices" icon={<FileText size={18} />} text="Factures" onClick={() => setMenuOpen(false)} />
              <MobileMenuLink href="/reports" icon={<BarChart2 size={18} />} text="Rapports" onClick={() => setMenuOpen(false)} />
              <MobileMenuLink href="/parametres" icon={<Settings size={18} />} text="Paramètres" onClick={() => setMenuOpen(false)} />
              <MobileMenuLink href="/utilisateurs" icon={<User size={18} />} text="Utilisateurs" onClick={() => setMenuOpen(false)} />
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-800 transition text-sm">
      <span className="text-blue-100">{icon}</span>
      <span>{text}</span>
    </Link>
  );
}

function MobileMenuLink({ href, icon, text, onClick }: { href: string; icon: React.ReactNode; text: string; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-800 transition text-sm">
      <span className="text-blue-100">{icon}</span>
      <span>{text}</span>
    </Link>
  );
}
