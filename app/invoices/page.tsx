"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  Menu,
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

interface Product {
  typeDeProduit: string;
  quantity: number;
  price: number;
  total: number;
}

interface Invoice {
  id: number;
  numeroFacture: string;
  clientNom: string;
  clientTelephone: string;
  clientAdresse?: string;
  products: Product[];
  total: number;
  modePaiement: string;
  statut: string;
  createdAt: string;
}

export default function InvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    clientNom: "",
    clientTelephone: "",
    clientAdresse: "",
    modePaiement: "Espèces",
    editId: 0,
  });
  const [productForm, setProductForm] = useState({
    typeDeProduit: "",
    quantity: "",
    price: "",
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Charger les factures
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

  // Formulaires
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const addProduct = () => {
    if (!productForm.typeDeProduit || !productForm.quantity || !productForm.price) {
      alert("Veuillez remplir tous les champs produit !");
      return;
    }
    const total =
      Number(productForm.quantity) * Number(productForm.price);
    setProducts([
      ...products,
      {
        typeDeProduit: productForm.typeDeProduit,
        quantity: Number(productForm.quantity),
        price: Number(productForm.price),
        total,
      },
    ]);
    setProductForm({ typeDeProduit: "", quantity: "", price: "" });
  };

  const removeProduct = (index: number) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientNom || !form.clientTelephone || products.length === 0) {
      alert("Veuillez remplir les infos client et ajouter au moins un produit !");
      return;
    }

    const total = products.reduce((acc, p) => acc + p.total, 0);

    setLoading(true);
    try {
      if (form.editId) {
        await fetch("/invoices/api", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, products, total, id: form.editId }),
        });
      } else {
        await fetch("/invoices/api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, products, total }),
        });
      }
      setForm({
        clientNom: "",
        clientTelephone: "",
        clientAdresse: "",
        modePaiement: "Espèces",
        editId: 0,
      });
      setProducts([]);
      fetchInvoices();
    } catch {
      alert("Erreur lors de l’enregistrement !");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (inv: Invoice) => {
    setForm({
      clientNom: inv.clientNom,
      clientTelephone: inv.clientTelephone,
      clientAdresse: inv.clientAdresse || "",
      modePaiement: inv.modePaiement,
      editId: inv.id,
    });
    setProducts(inv.products);
    setMenuOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette facture ?")) return;
    try {
      await fetch(`/invoices/api?id=${id}`, { method: "DELETE" });
      fetchInvoices();
    } catch {
      alert("Erreur lors de la suppression !");
    }
  };

  // 🔹 printInvoice corrigé pour Next.js + TypeScript
  const printInvoice = async (invoice: Invoice) => {
    const { default: html2pdf } = await import("html2pdf.js");

    const element = document.createElement("div");
    element.innerHTML = `
      <div style="font-family: sans-serif; padding: 10px; width: 190mm; box-sizing: border-box;">
        <div style="display: flex; align-items: center; border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 10px;">
          <img src="/logo.png" style="width: 60px; height: 60px; margin-right: 10px;" />
          <div>
            <h1 style="margin:0; font-size: 18px;">Scierie du Congo SARL</h1>
            <p style="margin:0; font-size: 10px;">RCCM : CD/KIN/12345</p>
            <p style="margin:0; font-size: 10px;">Email : contact@scieriecongo.com</p>
          </div>
        </div>
        <div style="display:flex; justify-content: space-between; margin-bottom:10px; font-size: 10px;">
          <div>
            <p><strong>Facture N°:</strong> ${invoice.numeroFacture}</p>
            <p><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p><strong>Client:</strong> ${invoice.clientNom}</p>
            <p><strong>Téléphone:</strong> ${invoice.clientTelephone}</p>
            <p><strong>Adresse:</strong> ${invoice.clientAdresse || ""}</p>
          </div>
        </div>
        <table style="width:100%; border-collapse: collapse; font-size: 12px; table-layout: fixed;">
          <thead>
            <tr>
              <th style="border:1px solid #000; padding:5px; width:45%;">Produit</th>
              <th style="border:1px solid #000; padding:5px; width:15%;">Qté</th>
              <th style="border:1px solid #000; padding:5px; width:20%;">Prix</th>
              <th style="border:1px solid #000; padding:5px; width:20%;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.products
              .map(
                (p) => `
              <tr>
                <td style="border:1px solid #000; padding:5px; word-break: break-word;">${p.typeDeProduit}</td>
                <td style="border:1px solid #000; padding:5px; text-align:center;">${p.quantity}</td>
                <td style="border:1px solid #000; padding:5px; text-align:right;">${p.price.toLocaleString()}</td>
                <td style="border:1px solid #000; padding:5px; text-align:right;">${p.total.toLocaleString()}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <div style="text-align:right; font-weight:bold; font-size: 14px; margin-top:5px;">
          TOTAL: ${invoice.total.toLocaleString()} CDF
        </div>
        <p style="font-size: 12px; margin-top:5px;">Mode de paiement: ${invoice.modePaiement}</p>
      </div>
    `;

    html2pdf()
      .set({
        margin: [5, 5, 5, 5],
        filename: `Facture-${invoice.numeroFacture}.pdf`,
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        html2canvas: { scale: 1, scrollY: -window.scrollY },
        ...( { pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } } as any), // ✅ forcer TypeScript
      })
      .from(element)
      .save();
  };

  // ---------------------------
  // JSX
  // ---------------------------
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
        <aside
          className={`fixed lg:static top-0 left-0 h-full bg-blue-900 text-gray-100 w-64 transform ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 z-50`}
        >
          <div className="p-4 text-2xl font-bold border-b border-blue-700 flex justify-between items-center">
            🪵 Scierie
            <X
              className="lg:hidden p-1 rounded hover:bg-blue-700 cursor-pointer"
              size={20}
              onClick={() => setMenuOpen(false)}
            />
          </div>
          <nav className="flex flex-col p-4 space-y-2 text-sm">
            <MenuLink href="/" icon={<Home size={16} />} text="Accueil" />
            <MenuLink href="/charges" icon={<Settings size={16} />} text="Charges" />
            <MenuLink href="/stock" icon={<Package size={16} />} text="Stock" />
            <MenuLink href="/productions" icon={<Factory size={16} />} text="Production" />
            <MenuLink href="/sales" icon={<ShoppingCart size={16} />} text="Ventes" />
            <MenuLink href="/expenses" icon={<DollarSign size={16} />} text="Dépenses" />
            <MenuLink href="/invoices" icon={<FileText size={16} />} text="Factures" />
            <MenuLink href="/benefice" icon={<DollarSign size={16} />} text="Bénéfice" />
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
          {/* Formulaire et tableau factures ici... */}
          {/* Tu peux garder ton JSX existant, inchangé */}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-blue-900 text-gray-200 py-3 text-center text-sm shadow-inner">
        © {new Date().getFullYear()} ScieriePro — Tous droits réservés.
      </footer>
    </div>
  );
}

// MenuLink
function MenuLink({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-800 transition text-sm"
    >
      <span className="text-blue-100">{icon}</span>
      <span>{text}</span>
    </Link>
  );
}

