import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔹 GET — Toutes les factures
export async function GET() {
  try {
    const invoices = await prisma.facture.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error("GET /invoices error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🔹 POST — Ajouter une facture
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientNom, clientTelephone, clientAdresse, products, modePaiement } = body;

    if (!clientNom || !clientTelephone || !products || !products.length) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    // Calculer le total de la facture
    const total = products.reduce((sum: number, p: any) => sum + p.total, 0);

    const numeroFacture = "FAC-" + Date.now().toString().slice(-6);

    const newInvoice = await prisma.facture.create({
      data: {
        numeroFacture,
        clientNom,
        clientTelephone,
        clientAdresse: clientAdresse || "",
        products,       // ⚡ JSON directement
        total,
        modePaiement: modePaiement || "Espèces",
        statut: "Payée",
      },
    });

    return NextResponse.json(newInvoice);
  } catch (error) {
    console.error("POST /invoices error:", error);
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
  }
}

// 🔹 PUT — Modifier une facture
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, clientNom, clientTelephone, clientAdresse, products, modePaiement, statut } = body;

    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    const total = products.reduce((sum: number, p: any) => sum + p.total, 0);

    const updatedInvoice = await prisma.facture.update({
      where: { id: Number(id) },
      data: {
        clientNom,
        clientTelephone,
        clientAdresse: clientAdresse || "",
        products,      // ⚡ JSON directement
        total,
        modePaiement: modePaiement || "Espèces",
        statut: statut || "Payée",
      },
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error("PUT /invoices error:", error);
    return NextResponse.json({ error: "Erreur lors de la modification" }, { status: 500 });
  }
}

// 🔹 DELETE — Supprimer une facture
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    if (!idParam) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    await prisma.facture.delete({ where: { id: Number(idParam) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /invoices error:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
