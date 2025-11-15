import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ===============================
// 🔹 GET — récupérer toutes les productions
// ===============================
export async function GET() {
  try {
    const productions = await prisma.production.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(productions);
  } catch (error: any) {
    console.error("Erreur GET /productions/api :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ===============================
// 🔹 POST — créer une nouvelle production
// ===============================
export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.typeBois || !data.quantity || !data.unitPrice) {
      return NextResponse.json({ error: "Champs manquants : typeBois, quantity ou unitPrice" }, { status: 400 });
    }

    const newProduction = await prisma.production.create({
      data: {
        typeBois: data.typeBois,
        quantity: parseFloat(data.quantity),
        unitPrice: parseFloat(data.unitPrice),
        total: parseFloat(data.quantity) * parseFloat(data.unitPrice),
        date: new Date(),
      },
    });

    return NextResponse.json(newProduction, { status: 201 });
  } catch (error: any) {
    console.error("Erreur POST /productions/api :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ===============================
// 🔹 PUT — modifier une production existante
// ===============================
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    if (!data.id || !data.typeBois || !data.quantity || !data.unitPrice) {
      return NextResponse.json({ error: "Champs manquants : id, typeBois, quantity ou unitPrice" }, { status: 400 });
    }

    const updatedProduction = await prisma.production.update({
      where: { id: Number(data.id) },
      data: {
        typeBois: data.typeBois,
        quantity: parseFloat(data.quantity),
        unitPrice: parseFloat(data.unitPrice),
        total: parseFloat(data.quantity) * parseFloat(data.unitPrice),
      },
    });

    return NextResponse.json(updatedProduction);
  } catch (error: any) {
    console.error("Erreur PUT /productions/api :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ===============================
// 🔹 DELETE — supprimer une production
// ===============================
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID manquant pour la suppression" }, { status: 400 });
    }

    await prisma.production.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Production supprimée avec succès" });
  } catch (error: any) {
    console.error("Erreur DELETE /productions/api :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
