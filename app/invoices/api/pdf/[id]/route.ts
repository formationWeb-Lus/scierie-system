import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import PDFDocument from "pdfkit";
import { Buffer } from "buffer";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }  // ← ici
) {
  const { id } = await context.params;           // ← await params

  const facture = await prisma.facture.findUnique({
    where: { id: Number(id) },
  });

  if (!facture) {
    return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });
  }

  const products = facture.products ? JSON.parse(facture.products as string) : [];

  const doc = new PDFDocument({ size: "A4", margin: 40 });

  const pdfBuffer = await new Promise<Buffer>((resolve) => {
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  // 🏢 Infos entreprise
  doc.fontSize(16).text(facture.entrepriseNom, { align: "center" });
  doc.fontSize(10).text(facture.entrepriseAdresse, { align: "center" });
  doc.text(`Tel: ${facture.entrepriseTelephone} | Email: ${facture.entrepriseEmail ?? ""}`, { align: "center" });
  doc.moveDown();

  // 🧾 Infos facture & client
  doc.fontSize(12).text(`Facture N°: ${facture.numeroFacture}`);
  doc.text(`Date: ${new Date(facture.date).toLocaleDateString()}`);
  doc.moveDown();
  doc.text(`Client: ${facture.clientNom}`);
  doc.text(`Téléphone: ${facture.clientTelephone}`);
  doc.text(`Adresse: ${facture.clientAdresse ?? ""}`);
  doc.moveDown();

  // 📦 Produits
  doc.fontSize(11).text("Produits :", { underline: true });
  products.forEach((p: any, i: number) => {
    doc.text(`${i + 1}. ${p.typeDeProduit} | Qté: ${p.quantity} | Prix: ${p.price.toLocaleString()} FC | Total: ${p.total.toLocaleString()} FC`);
  });
  doc.moveDown();

  // 💰 Total
  doc.fontSize(13).text(`TOTAL: ${facture.total.toLocaleString()} FC`, { align: "right" });
  doc.text(`Paiement: ${facture.modePaiement}`);
  doc.text(`Statut: ${facture.statut}`);
  doc.moveDown(2);

  doc.fontSize(12).text("Merci pour votre confiance 🙏", { align: "center" });

  doc.end();

  return new NextResponse(pdfBuffer as unknown as ArrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=facture-${facture.numeroFacture}.pdf`,
    },
  });
}
