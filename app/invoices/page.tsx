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
    editId: 0, // pour savoir si on édite
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // 🔹 Gestion du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Ajouter ou modifier une facture
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { clientNom, clientTelephone, typeDeProduit, quantity, price, clientAdresse, modePaiement, editId } = form;

    if (!clientNom || !clientTelephone || !typeDeProduit || !quantity || !price) {
      alert("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        // 🔹 Modifier
        await fetch("/invoices/api", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editId,
            clientNom,
            clientTelephone,
            clientAdresse,
            typeDeProduit,
            quantity: Number(quantity),
            price: Number(price),
            modePaiement,
          }),
        });
      } else {
        // 🔹 Ajouter
        await fetch("/invoices/api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientNom,
            clientTelephone,
            clientAdresse,
            typeDeProduit,
            quantity: Number(quantity),
            price: Number(price),
            modePaiement,
          }),
        });
      }

      setForm({
        clientNom: "",
        clientTelephone: "",
        clientAdresse: "",
        typeDeProduit: "",
        quantity: "",
        price: "",
        modePaiement: "Espèces",
        editId: 0,
      });
      fetchInvoices();
    } catch {
      alert("Erreur lors de l’enregistrement !");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Pré-remplir formulaire pour modification
  const handleEdit = (inv: Invoice) => {
    setForm({
      clientNom: inv.clientNom,
      clientTelephone: inv.clientTelephone,
      clientAdresse: inv.clientAdresse || "",
      typeDeProduit: inv.typeDeProduit,
      quantity: inv.quantity.toString(),
      price: inv.price.toString(),
      modePaiement: inv.modePaiement,
      editId: inv.id,
    });
    setMenuOpen(false);
  };

  // 🔹 Supprimer une facture
  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette facture ?")) return;
    try {
      await fetch(`/invoices/api?id=${id}`, { method: "DELETE" });
      fetchInvoices();
    } catch {
      alert("Erreur lors de la suppression !");
    }
  };

  const totalGeneral = invoices.reduce((acc, inv) => acc + inv.total, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
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
            <span className="text-2xl">🧾</span>
            <h1 className="text-lg sm:text-xl font-bold">Factures</h1>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside className={`fixed lg:static top-0 left-0 h-full bg-blue-900 text-gray-100 w-64 transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 z-50`}>
          <div className="p-4 text-2xl font-bold border-b border-blue-700 flex justify-between items-center">
            🪵 Scierie
            <button className="lg:hidden p-1 rounded hover:bg-blue-700" onClick={() => setMenuOpen(false)}><X size={20} /></button>
          </div>

          <nav className="flex flex-col p-4 space-y-2 text-sm">
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

          <div className="mt-auto px-4 py-4 text-xs text-blue-200 border-t border-blue-800">
            © {new Date().getFullYear()} ScieriePro
          </div>
        </aside>

        {/* CONTENU */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-6 gap-3 mb-6">
            <input name="clientNom" value={form.clientNom} onChange={handleChange} placeholder="Client" className="border rounded px-2 py-2 text-sm" />
            <input name="clientTelephone" value={form.clientTelephone} onChange={handleChange} placeholder="Téléphone" className="border rounded px-2 py-2 text-sm" />
            <input name="clientAdresse" value={form.clientAdresse} onChange={handleChange} placeholder="Adresse" className="border rounded px-2 py-2 text-sm" />
            <input name="typeDeProduit" value={form.typeDeProduit} onChange={handleChange} placeholder="Produit" className="border rounded px-2 py-2 text-sm" />
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Qté" className="border rounded px-2 py-2 text-sm" />
            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Prix" className="border rounded px-2 py-2 text-sm" />
            <select name="modePaiement" value={form.modePaiement} onChange={handleChange} className="border rounded px-2 py-2 text-sm">
              <option value="Espèces">Espèces</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Virement">Virement</option>
            </select>
            <button type="submit" disabled={loading} className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 col-span-1 sm:col-span-2">
              {form.editId ? "✏️ Modifier" : "💾 Ajouter"}
            </button>
          </form>

          {/* Tableau */}
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
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-3 text-gray-400">Aucune facture.</td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="border-b hover:bg-blue-50 transition">
                      <td className="px-3 py-2 font-semibold">{inv.numeroFacture}</td>
                      <td className="px-3 py-2">{inv.clientNom}</td>
                      <td className="px-3 py-2">{inv.clientTelephone}</td>
                      <td className="px-3 py-2">{inv.typeDeProduit}</td>
                      <td className="px-3 py-2">{inv.quantity}</td>
                      <td className="px-3 py-2">{inv.price.toLocaleString()}</td>
                      <td className="px-3 py-2 font-semibold">{inv.total.toLocaleString()}</td>
                      <td className="px-3 py-2">{inv.modePaiement}</td>
                      <td className="px-3 py-2">{inv.statut}</td>
                      <td className="px-3 py-2">{new Date(inv.createdAt).toLocaleDateString()}</td>
                      <td className="px-3 py-2 flex gap-1">
                        <button onClick={() => handleEdit(inv)} className="bg-yellow-500 text-white rounded px-2 py-1 text-xs">✏️</button>
                        <button onClick={() => handleDelete(inv.id)} className="bg-red-600 text-white rounded px-2 py-1 text-xs">🗑️</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {invoices.length > 0 && (
                <tfoot className="bg-gray-100 font-semibold">
                  <tr>
                    <td colSpan={6} className="text-right px-3 py-2">Total :</td>
                    <td className="px-3 py-2 text-blue-700">{totalGeneral.toLocaleString()}</td>
                    <td colSpan={4}></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-blue-900 text-gray-200 py-3 text-center text-sm shadow-inner">
        © {new Date().getFullYear()} ScieriePro — Tous droits réservés.
      </footer>
    </div>
  );
}

/* Lien menu desktop */
function MenuLink({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-800 transition text-sm">
      <span className="text-blue-100">{icon}</span>
      <span>{text}</span>
    </Link>
  );
}
