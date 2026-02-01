import Image from "next/image";

export default function InvoicePDF({ invoice }: { invoice: any }) {
  return (
    <div id="invoice-pdf" className="p-8 text-black bg-white w-[210mm] min-h-[297mm]">

      {/* EN-TÊTE ENTREPRISE */}
      <div className="flex items-center gap-4 border-b pb-4 mb-4">
        <Image src="/logo.png" alt="Logo" width={80} height={80} />
        <div>
          <h1 className="text-xl font-bold">Scierie du Congo SARL</h1>
          <p className="text-sm">Adress : AV/SALAMA ARRE/BAHIPASSE</p>
            <p className="text-sm">Tel : +243 999 999 999</p>
          <p className="text-sm">Email : contact@scieriecongo.com</p>
          <p className="text-sm">RCCM : CD/KIN/2020/B/12345</p>
        </div>
      </div>

      {/* INFOS FACTURE */}
      <div className="grid grid-cols-2 text-sm mb-4">
        <div>
          <p><strong>Facture N° :</strong> {invoice.numeroFacture}</p>
          <p><strong>Date :</strong> {new Date(invoice.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p><strong>Client :</strong> {invoice.clientNom}</p>
          <p><strong>Téléphone :</strong> {invoice.clientTelephone}</p>
          <p><strong>Adresse :</strong> {invoice.clientAdresse}</p>
          <p><strong>Statut :</strong> {invoice.statut}</p>
        </div>
      </div>

      {/* TABLE PRODUITS */}
      <table className="w-full border text-sm mb-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">Produit</th>
            <th className="border px-2 py-1">Qté</th>
            <th className="border px-2 py-1">Prix</th>
            <th className="border px-2 py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.products.map((p: any, i: number) => (
            <tr key={i}>
              <td className="border px-2 py-1">{p.typeDeProduit}</td>
              <td className="border px-2 py-1">{p.quantity}</td>
              <td className="border px-2 py-1">{p.price.toLocaleString()}</td>
              <td className="border px-2 py-1">{p.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTAL */}
      <div className="text-right font-bold text-lg">
        TOTAL : {invoice.total.toLocaleString()} CDF
      </div>

      <p className="text-sm mt-4">
        Mode de paiement : {invoice.modePaiement}
      </p>

    </div>
  );
}
