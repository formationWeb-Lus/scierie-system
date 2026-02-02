"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */

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
  clientAdresse: string;
  products: Product[];
  total: number;
  modePaiement: string;
  statut: string;
  createdAt: string;
}

/* ================= PAGE ================= */

export default function InvoicePage() {
  /* ===== STATES ===== */
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  /* 🔒 AJOUT : verrouillage après ajout facture */
  const [isLocked, setIsLocked] = useState(false);

  const [client, setClient] = useState({
    clientNom: "",
    clientTelephone: "",
    clientAdresse: "",
    modePaiement: "Espèces",
  });

  const [productForm, setProductForm] = useState({
    typeDeProduit: "",
    quantity: "",
    price: "",
  });

  /* ===== FETCH ===== */
  const fetchInvoices = async () => {
    const res = await fetch("/invoices/api");
    const data = await res.json();
    setInvoices(data || []);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  /* ===== PRODUITS ===== */
  const addProduct = () => {
    if (!productForm.typeDeProduit || !productForm.quantity || !productForm.price) return;

    const total = Number(productForm.quantity) * Number(productForm.price);

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

  /* ➕ AJOUT : supprimer produit */
  const deleteProduct = (index: number) => {
    if (isLocked) return;
    setProducts(products.filter((_, i) => i !== index));
  };

  /* ➕ AJOUT : modifier produit */
  const editProduct = (index: number) => {
    if (isLocked) return;

    const p = products[index];

    setProductForm({
      typeDeProduit: p.typeDeProduit,
      quantity: String(p.quantity),
      price: String(p.price),
    });

    setProducts(products.filter((_, i) => i !== index));
  };

  const totalGlobal = products.reduce((sum, p) => sum + p.total, 0);

  /* ===== AJOUT FACTURE ===== */
  const addInvoice = async () => {
    if (!client.clientNom || products.length === 0) {
      alert("Client et produits obligatoires");
      return;
    }

    await fetch("/invoices/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...client,
        products,
        total: totalGlobal,
      }),
    });

    /* 🔒 AJOUT : verrouiller après ajout facture */
    setIsLocked(true);

    setClient({
      clientNom: "",
      clientTelephone: "",
      clientAdresse: "",
      modePaiement: "Espèces",
    });
    setProducts([]);
    setIsLocked(false); // prêt pour nouvelle facture
    fetchInvoices();
  };

  /* ===== IMPRIMER FACTURE ===== */
const printInvoice = async (inv: Invoice) => {
  const html2pdf = (await import("html2pdf.js")).default;

  const element = document.createElement("div");

  element.innerHTML = `
  <div style="
    font-family: Arial, sans-serif;
    padding:16px;
    width:180mm;
    color:#000;
    line-height:1.9;
    font-size:16px;
    font-weight:800;
  ">

    <!-- EN-TÊTE : ENTREPRISE À GAUCHE / CLIENT À DROITE -->
    <div style="
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      margin-bottom:10px;
    ">

      <!-- ENTREPRISE -->
      <div style="width:50%; text-align:left;">
        <div style="font-size:19px; font-weight:900;">
          SCIERIE DU CONGO SARL
        </div>
        <div style="margin-top:6px; font-size:15px;">
          Email : contact@scieriecongo.com<br/>
          Tél : +243 999 999 999<br/>
          RCCM : CD/KIN/12345<br/>
          TVA : 123456
        </div>
      </div>

      <!-- CLIENT -->
      <div style="width:45%; text-align:right; font-size:15px;">
        <div style="font-size:18px; font-weight:900;">
          FACTURE
        </div>
        <div style="margin-top:6px;">
          <strong>N° :</strong> ${inv.numeroFacture}<br/>
          <strong>Date :</strong> ${new Date(inv.createdAt).toLocaleDateString()}<br/><br/>

          <strong>Client :</strong> ${inv.clientNom}<br/>
          <strong>Tél :</strong> ${inv.clientTelephone}<br/>
          <strong>Adresse :</strong> ${inv.clientAdresse || "-"}
        </div>
      </div>

    </div>

    <!-- SÉPARATION FORTE -->
    <hr style="border:4px solid #000; margin:6px 0 10px 0;" />

    <!-- TABLE PRODUITS -->
    <table style="
      width:100%;
      border-collapse:collapse;
      font-size:16px;
    ">
      <thead>
        <tr>
          <th style="border:3px solid #000; padding:8px;">Produit</th>
          <th style="border:3px solid #000; padding:8px;">Qté</th>
          <th style="border:3px solid #000; padding:8px;">Prix</th>
          <th style="border:3px solid #000; padding:8px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${inv.products.map(p => `
          <tr>
            <td style="border:3px solid #000; padding:8px;">
              ${p.typeDeProduit}
            </td>
            <td style="border:3px solid #000; padding:8px; text-align:center;">
              ${p.quantity}
            </td>
            <td style="border:3px solid #000; padding:8px; text-align:right;">
              ${p.price.toLocaleString()} CDF
            </td>
            <td style="border:3px solid #000; padding:8px; text-align:right;">
              ${p.total.toLocaleString()} CDF
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <!-- TOTAL -->
    <div style="
      margin-top:16px;
      padding-top:12px;
      border-top:4px solid #000;
      font-size:18px;
      font-weight:900;
      text-align:right;
    ">
      TOTAL GLOBAL : ${inv.total.toLocaleString()} CDF
    </div>

    <!-- MESSAGE -->
    <div style="
      margin-top:24px;
      text-align:center;
      font-size:15px;
      font-weight:800;
    ">
      Merci pour votre confiance.<br/>
      SCIERIE DU CONGO SARL
    </div>

  </div>
  `;

  html2pdf()
    .set({
      margin: 3,
      filename: `Facture-${inv.numeroFacture}.pdf`,
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      html2canvas: {
        scale: 4,              // 🔥 ULTRA NET
        letterRendering: true,
        useCORS: true
      },
    })
    .from(element)
    .save();
};

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">

      {/* INFOS HAUT (ENTREPRISE + CLIENT) — INCHANGÉ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow">
        <div>
          <h2 className="font-bold text-lg">🏢 Scierie du Congo SARL</h2>
          <p>Email: contact@scieriecongo.com</p>
          <p>Tél: +243 999 999 999</p>
          <p>TVA: 123456 | RCCM: CD/KIN/12345</p>
        </div>

        <div className="space-y-2">
          <input placeholder="Nom client" value={client.clientNom}
            onChange={(e) => setClient({ ...client, clientNom: e.target.value })}
            className="border p-2 w-full" />
          <input placeholder="Téléphone" value={client.clientTelephone}
            onChange={(e) => setClient({ ...client, clientTelephone: e.target.value })}
            className="border p-2 w-full" />
          <input placeholder="Adresse" value={client.clientAdresse}
            onChange={(e) => setClient({ ...client, clientAdresse: e.target.value })}
            className="border p-2 w-full" />
        </div>
      </div>

      {/* PRODUITS */}
      <div className="bg-white p-4 rounded shadow">
        <div className="grid grid-cols-4 gap-2">
          <input placeholder="Produit"
            value={productForm.typeDeProduit}
            onChange={(e) => setProductForm({ ...productForm, typeDeProduit: e.target.value })}
            className="border p-2" />
          <input type="number" placeholder="Qté"
            value={productForm.quantity}
            onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
            className="border p-2" />
          <input type="number" placeholder="Prix unitaire"
            value={productForm.price}
            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
            className="border p-2" />
          <button onClick={addProduct} className="bg-blue-600 text-white">
            ➕ Ajouter
          </button>
        </div>

        <table className="w-full mt-4 border">
          <thead className="bg-gray-200">
            <tr>
              <th>Produit</th>
              <th>Qté</th>
              <th>Prix</th>
              <th>Total</th>
              {!isLocked && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i}>
                <td>{p.typeDeProduit}</td>
                <td>{p.quantity}</td>
                <td>{p.price}</td>
                <td>{p.total}</td>
                {!isLocked && (
                  <td className="space-x-2">
                    <button onClick={() => editProduct(i)}>✏️</button>
                    <button onClick={() => deleteProduct(i)}>🗑️</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right font-bold mt-2">
          TOTAL GLOBAL : {totalGlobal} CDF
        </div>

        <button onClick={addInvoice}
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded">
          💾 Ajouter Facture
        </button>
      </div>

      {/* TABLE FACTURES — INCHANGÉ */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">📋 Factures</h2>
        <table className="w-full border">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th>N°</th><th>Client</th><th>Total</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.numeroFacture}</td>
                <td>{inv.clientNom}</td>
                <td>{inv.total}</td>
                <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => printInvoice(inv)}>🖨️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}



