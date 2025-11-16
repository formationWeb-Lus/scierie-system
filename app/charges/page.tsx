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

interface Charge {
  id: number;
  date: string;
  fournisseur: string;
  quantite: number;
  poids: number;
  prix: number;
}

export default function ChargesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [charges, setCharges] = useState<Charge[]>([]);
  const [form, setForm] = useState<Partial<Charge>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.fournisseur || !form.quantite || !form.poids || !form.prix) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    const payload = {
      ...form,
      quantite: Number(form.quantite),
      poids: Number(form.poids),
      prix: Number(form.prix),
    };

    try {
      if (editingId) {
        await fetch("/charges/api", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, id: editingId }),
        });
        setEditingId(null);
      } else {
        await fetch("/charges/api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setForm({});
      fetchCharges();
    } catch (err) {
      alert("Erreur lors de l'enregistrement !");
      console.error(err);
    }
  };

  const handleEdit = (charge: Charge) => {
    setForm({ ...charge });
    setEditingId(charge.id);
    if (menuOpen) setMenuOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette charge ?")) return;
    try {
      await fetch(`/charges/api?id=${id}`, { method: "DELETE" });
      fetchCharges();
    } catch (err) {
      alert("Erreur lors de la suppression !");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* HEADER */}
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
            <MenuLink href="/charges" icon={<DollarSign size={16} />} text="Charges" />
            <MenuLink href="/expenses" icon={<DollarSign size={16} />} text="Dépenses" />
            <MenuLink href="/invoices" icon={<FileText size={16} />} text="Factures" />
            <MenuLink href="/productions" icon={<Factory size={16} />} text="Production" />
            <MenuLink href="/sales" icon={<ShoppingCart size={16} />} text="Ventes" />
            <MenuLink href="/stock" icon={<Package size={16} />} text="Stock" />
            <MenuLink href="/reports" icon={<BarChart2 size={16} />} text="Rapports" />
            <MenuLink href="/parametres" icon={<Settings size={16} />} text="Paramètres" />
            <MenuLink href="/utilisateurs" icon={<User size={16} />} text="Utilisateurs" />
          </nav>
          <div className="px-4 py-4 text-xs text-blue-200 border-t border-blue-800">
            © {new Date().getFullYear()} ScieriePro
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">💰 Gestion des Charges</h1>

          {/* FORMULAIRE */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 mb-6"
          >
            <input type="date" name="date" value={form.date || ""} onChange={handleChange} className="input" />
            <input type="text" name="fournisseur" placeholder="Fournisseur" value={form.fournisseur || ""} onChange={handleChange} className="input" />
            <input type="number" name="quantite" placeholder="Quantité" value={form.quantite || ""} onChange={handleChange} className="input" />
            <input type="number" name="poids" placeholder="Poids" value={form.poids || ""} onChange={handleChange} className="input" />
            <input type="number" name="prix" placeholder="Prix (FC)" value={form.prix || ""} onChange={handleChange} className="input" />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full">
              {editingId ? "✏️ Modifier" : "➕ Ajouter"}
            </button>
          </form>

          {/* TABLEAU */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="bg-green-600 text-white text-sm uppercase">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Fournisseur</th>
                  <th className="px-4 py-3">Quantité</th>
                  <th className="px-4 py-3">Poids</th>
                  <th className="px-4 py-3">Prix (FC)</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {charges.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-400">
                      Aucune charge enregistrée.
                    </td>
                  </tr>
                ) : (
                  charges.map((c) => (
                    <tr key={c.id} className="border-b hover:bg-green-50 transition">
                      <td className="px-4 py-3">{new Date(c.date).toLocaleDateString("fr-FR")}</td>
                      <td className="px-4 py-3">{c.fournisseur}</td>
                      <td className="px-4 py-3">{c.quantite}</td>
                      <td className="px-4 py-3">{c.poids}</td>
                      <td className="px-4 py-3 font-semibold">{Number(c.prix).toLocaleString("fr-FR")} FC</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button onClick={() => handleEdit(c)} className="px-3 py-1 bg-yellow-500 text-white rounded">
                          Modifier
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="px-3 py-1 bg-red-600 text-white rounded">
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-blue-900 text-gray-200 py-3 text-center text-sm shadow-inner">
        © {new Date().getFullYear()} ScieriePro — Tous droits réservés.
      </footer>

      {/* MENU MOBILE */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden" onClick={() => setMenuOpen(false)}>
          <aside onClick={(e) => e.stopPropagation()} className="absolute left-0 top-0 w-64 h-full bg-blue-900 text-gray-100 py-6 px-4 space-y-4 shadow-lg">
            <nav className="flex flex-col space-y-2">
              <MobileMenuLink href="/" icon={<Home size={18} />} text="Accueil" onClick={() => setMenuOpen(false)} />
              <MobileMenuLink href="/charges" icon={<DollarSign size={18} />} text="Charges" onClick={() => setMenuOpen(false)} />
              <MobileMenuLink href="/sales" icon={<ShoppingCart size={18} />} text="Ventes" onClick={() => setMenuOpen(false)} />
              <MobileMenuLink href="/stock" icon={<Package size={18} />} text="Stock" onClick={() => setMenuOpen(false)} />
              <MobileMenuLink href="/productions" icon={<Factory size={18} />} text="Production" onClick={() => setMenuOpen(false)} />
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
