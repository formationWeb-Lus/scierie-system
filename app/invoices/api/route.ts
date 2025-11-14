import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";


// ===============================
// 🔹 GET — Récupérer toutes les factures
// ===============================
export async function GET() {
  try {
    const invoices = await prisma.facture.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("❌ Erreur GET /factures/api:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// ===============================
// 🔹 POST — Créer une nouvelle facture
// ===============================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      clientNom,
      clientTelephone,
      clientAdresse,
      typeDeProduit,
      quantity,
      price,
      modePaiement,
    } = body;

    // 🔺 Vérifier les champs requis
    if (!clientNom || !clientTelephone || !typeDeProduit || !quantity || !price) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    // 🔹 Générer numéro facture unique
    const numeroFacture = "FAC-" + Date.now().toString().slice(-6);

    const total = Number(quantity) * Number(price);

    // 🔹 Enregistrement MongoDB / Prisma
    const newInvoice = await prisma.facture.create({
      data: {
        numeroFacture,
        clientNom,
        clientTelephone,
        clientAdresse: clientAdresse || "",
        typeDeProduit,
        quantity: Number(quantity),
        price: Number(price),
        total,
        modePaiement: modePaiement || "Espèces",
      },
    });

    return NextResponse.json(newInvoice);
  } catch (error) {
    console.error("❌ Erreur POST /factures/api:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la facture" },
      { status: 500 }
    );
  }
}

