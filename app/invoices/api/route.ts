import { NextResponse } from "next/server";
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
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      clientNom,
      clientTelephone,
      clientAdresse,
      typeDeProduit,
      quantity,
      price,
      modePaiement,
    } = body;

    if (!clientNom || !clientTelephone || !typeDeProduit || !quantity || !price) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    const numeroFacture = "FAC-" + Date.now().toString().slice(-6);
    const total = Number(quantity) * Number(price);

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

// ===============================
// 🔹 PUT — Modifier une facture existante
// ===============================
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, clientNom, clientTelephone, clientAdresse, typeDeProduit, quantity, price, modePaiement } = body;

    if (!id) {
      return NextResponse.json({ error: "ID manquant pour modification" }, { status: 400 });
    }

    const total = Number(quantity) * Number(price);

    const updatedInvoice = await prisma.facture.update({
      where: { id: Number(id) },
      data: {
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

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error("❌ Erreur PUT /factures/api:", error);
    return NextResponse.json({ error: "Erreur lors de la modification" }, { status: 500 });
  }
}

// ===============================
// 🔹 DELETE — Supprimer une facture
// ===============================
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json({ error: "ID manquant pour suppression" }, { status: 400 });
    }

    const id = Number(idParam);
    await prisma.facture.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur DELETE /factures/api:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}

