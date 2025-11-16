import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------
// 🔹 GET — Récupérer toutes les charges
// ---------------------------------------------------
export async function GET() {
  try {
    const charges = await prisma.charge.findMany({
      orderBy: { date: "desc" },
    });

    return NextResponse.json(charges);
  } catch (error) {
    console.error("GET /charge error:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les charges" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------
// 🔹 POST — Ajouter une charge
// ---------------------------------------------------
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.date || !data.fournisseur || !data.quantite || !data.poids || !data.prix) {
      return NextResponse.json(
        { error: "Champs manquants pour créer une charge" },
        { status: 400 }
      );
    }

    const newCharge = await prisma.charge.create({
      data: {
        date: new Date(data.date),
        fournisseur: data.fournisseur,
        quantite: Number(data.quantite),
        poids: Number(data.poids),
        prix: Number(data.prix),
      },
    });

    return NextResponse.json(newCharge, { status: 201 });
  } catch (error) {
    console.error("POST /charge error:", error);
    return NextResponse.json(
      { error: "Impossible d'ajouter la charge" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------
// 🔹 PUT — Modifier une charge
// ---------------------------------------------------
export async function PUT(req: Request) {
  try {
    const data = await req.json();

    if (!data.id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const updatedCharge = await prisma.charge.update({
      where: { id: Number(data.id) },
      data: {
        date: new Date(data.date),
        fournisseur: data.fournisseur,
        quantite: Number(data.quantite),
        poids: Number(data.poids),
        prix: Number(data.prix),
      },
    });

    return NextResponse.json(updatedCharge);
  } catch (error) {
    console.error("PUT /charge error:", error);
    return NextResponse.json(
      { error: "Impossible de modifier la charge" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------
// 🔹 DELETE — Supprimer une charge
// ---------------------------------------------------
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    await prisma.charge.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /charge error:", error);
    return NextResponse.json(
      { error: "Impossible de supprimer la charge" },
      { status: 500 }
    );
  }
}
