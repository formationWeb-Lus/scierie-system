import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🟢 GET — Récupérer toutes les factures
export async function GET() {
  try {
    const invoices = await prisma.facture.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("❌ Erreur GET /invoices/api:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🔵 POST — Créer une facture
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientNom, clientTelephone, typeDeProduit, quantity, price, modePaiement } = body;

    if (!clientNom || !clientTelephone || !typeDeProduit || !quantity || !price) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    const numeroFacture = "FAC-" + Date.now().toString().slice(-6);
    const total = Number(quantity) * Number(price);

    const newInvoice = await prisma.facture.create({
      data: {
        numeroFacture,
        clientNom,
        clientTelephone,
        typeDeProduit,
        quantity: Number(quantity),
        price: Number(price),
        total,
        modePaiement: modePaiement || "Espèces",
      },
    });

    return NextResponse.json(newInvoice);
  } catch (error) {
    console.error("❌ Erreur POST /invoices/api:", error);
    return NextResponse.json({ error: "Erreur lors de la création de la facture" }, { status: 500 });
  }
}
