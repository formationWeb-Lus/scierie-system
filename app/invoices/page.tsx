"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
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

interface Invoice {
  id: number;
  numeroFacture: string;
  clientNom: string;
  clientTelephone: string;
  clientAdresse?: string;
  typeDeProduit: string;
  quantity: number;
  price: number;
  total: number;
  modePaiement: string;
  statut: string;
  createdAt: string;
}

export default function InvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [form, setForm] = useState({
    clientNom: "",
    clientTelephone: "",
    clientAdresse: "",
    typeDeProduit: "",
    quantity: "",
    price: "",
    modePaiement: "Espèces",
  });
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔹 Charger les factures
  const fetchInvoices = async () => {
    try {
      const res = await fetch("/invoices/api");
      const data = await res.json();
      setInvoices(Array.isArray(data) ? data : []);
    } catch {
      setInvoices([]);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // 🔹 Gestion formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Ajouter une facture
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { clientNom, clientTelephone, typeDeProduit, quantity, price } = form;
    if (!clientNom || !clientTelephone || !typeDeProduit || !quantity || !price) {
      alert("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    await fetch("/invoices/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        quantity: Number(quantity),
        price: Number(price),
      }),
    });

    setForm({
      clientNom: "",
      clientTelephone: "",
      clientAdresse: "",
      typeDeProduit: "",
      quantity: "",
      price: "",
      modePaiement: "Espèces",
    });
    fetchInvoices();
  };

  const totalGeneral = invoices.reduce((acc, inv) => acc + inv.total, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ✅ EN-TÊTE */}
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
            <span className="text-2xl">🧾</span>
            <h1 className="text-lg sm:text-xl font-bold">Gestion des Factures</h1>
          </div>
        </div>

        {/* Menu horizontal (grand écran) */}
        <nav className="hidden lg:flex lg:items-center lg:space-x-6 text-sm">
          <Link href="/" className="text-white/90 hover:text-white">Accueil</Link>
          <Link href="/reports" className="text-white/90 hover:text-white">Rapports</Link>
          <Link href="/parametres" className="text-white/90 hover:text-white">Paramètres</Link>
          <Link href="/utilisateurs" className="text-white/90 hover:text-white">Utilisateurs</Link>
        </nav>
      </header>

      <div className="flex flex-1">
        {/* ✅ SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-64 bg-blue-900 text-gray-100 py-6 space-y-2 shadow-lg">
          <div className="px-4 mb-4">
            <div className="text-2xl font-bold">🪵 Scierie</div>
            <div className="text-xs text-blue-200 mt-1">Gestion & Production</div>
          </div>

          <nav className="flex-1 px-2 space-y-1">
            <MenuLink href="/" icon={<Home size={16} />} text="Accueil" />
            <MenuLink href="/charges" icon={<Settings size={16} />} text="Charges" />
            <MenuLink href="/stock" icon={<Package size={16} />} text="Stock" />
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

        {/* ✅ CONTENU */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {/* Formulaire */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-6 gap-4 mb-6"
          >
            <input name="clientNom" value={form.clientNom} onChange={handleChange} placeholder="Nom du client" className="border rounded px-2 py-2 text-sm" />
            <input name="clientTelephone" value={form.clientTelephone} onChange={handleChange} placeholder="Téléphone" className="border rounded px-2 py-2 text-sm" />
            <input name="clientAdresse" value={form.clientAdresse} onChange={handleChange} placeholder="Adresse (facultatif)" className="border rounded px-2 py-2 text-sm" />
            <input name="typeDeProduit" value={form.typeDeProduit} onChange={handleChange} placeholder="Type de produit" className="border rounded px-2 py-2 text-sm" />
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantité" className="border rounded px-2 py-2 text-sm" />
            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Prix unitaire" className="border rounded px-2 py-2 text-sm" />

            <select name="modePaiement" value={form.modePaiement} onChange={handleChange} className="border rounded px-2 py-2 text-sm">
              <option value="Espèces">Espèces</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Virement">Virement bancaire</option>
            </select>

            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 col-span-1 sm:col-span-2">
              💾 Enregistrer
            </button>
          </form>

          {/* Tableau des factures */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-xs sm:text-sm text-left text-gray-600">
              <thead className="bg-blue-600 text-white uppercase">
                <tr>
                  <th className="px-3 py-2">N°</th>
                  <th className="px-3 py-2">Client</th>
                  <th className="px-3 py-2">Téléphone</th>
                  <th className="px-3 py-2">Produit</th>
                  <th className="px-3 py-2">Qté</th>
                  <th className="px-3 py-2">Prix</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2">Paiement</th>
                  <th className="px-3 py-2">Statut</th>
                  <th className="px-3 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-3 text-gray-400">
                      Aucune facture enregistrée.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="border-b hover:bg-blue-50 transition">
                      <td className="px-3 py-2 font-semibold">{inv.numeroFacture}</td>
                      <td className="px-3 py-2">{inv.clientNom}</td>
                      <td className="px-3 py-2">{inv.clientTelephone}</td>
                      <td className="px-3 py-2">{inv.typeDeProduit}</td>
                      <td className="px-3 py-2">{inv.quantity}</td>
                      <td className="px-3 py-2">${inv.price.toLocaleString()}</td>
                      <td className="px-3 py-2 font-semibold">${inv.total.toLocaleString()}</td>
                      <td className="px-3 py-2">{inv.modePaiement}</td>
                      <td className="px-3 py-2">{inv.statut}</td>
                      <td className="px-3 py-2">{new Date(inv.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>

              {invoices.length > 0 && (
                <tfoot className="bg-gray-100 font-semibold">
                  <tr>
                    <td colSpan={6} className="text-right px-3 py-2">Total :</td>
                    <td className="px-3 py-2 text-blue-700">${totalGeneral.toLocaleString()}</td>
                    <td colSpan={3}></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </main>
      </div>

      {/* ✅ FOOTER */}
      <footer className="bg-blue-900 text-gray-200 py-3 text-center text-sm shadow-inner">
        © {new Date().getFullYear()} ScieriePro — Tous droits réservés.
      </footer>

      {/* ✅ MENU MOBILE */}
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
              <div className="text-2xl font-bold">🧾 ScieriePro</div>
              <div className="text-xs text-blue-200 mt-1">Menu</div>
            </div>

            <nav className="flex flex-col space-y-2">
              <MobileMenuLink href="/" icon={<Home size={18} />} text="Accueil" onClick={() => setMenuOpen(false)} />
              <MobileMenuLink href="/charges" icon={<Settings size={18} />} text="Charges" onClick={() => setMenuOpen(false)} />
              <MobileMenuLink href="/stock" icon={<Package size={18} />} text="Stock" onClick={() => setMenuOpen(false)} />
              <MobileMenuLink href="/production" icon={<Factory size={18} />} text="Production" onClick={() => setMenuOpen(false)} />
              <MobileMenuLink href="/sales" icon={<ShoppingCart size={18} />} text="Ventes" onClick={() => setMenuOpen(false)} />
              <MobileMenuLink href="/expenses" icon={<DollarSign size={18} />} text="Dépenses" onClick={() => setMenuOpen(false)} />
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

/* 🔸 Lien du menu (desktop) */
function MenuLink({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-800 transition text-sm">
      <span className="text-blue-100">{icon}</span>
      <span>{text}</span>
    </Link>
  );
}

/* 🔸 Lien du menu mobile */
function MobileMenuLink({
  href,
  icon,
  text,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-800 transition text-sm"
    >
      <span className="text-blue-100">{icon}</span>
      <span>{text}</span>
    </Link>
  );
}