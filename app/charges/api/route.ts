import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔹 Récupérer toutes les charges
export async function GET() {
  try {
    const charges = await prisma.charge.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(charges);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Impossible de récupérer les charges" }, { status: 500 });
  }
}

// 🔹 Ajouter une nouvelle charge
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newCharge = await prisma.charge.create({
      data: {
        date: new Date(data.date),
        fournisseur: data.fournisseur,
        quantite: Number(data.quantite),
        poids: Number(data.poids),
        prix: Number(data.prix),
      },
    });
    return NextResponse.json(newCharge);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Impossible d'ajouter la charge" }, { status: 500 });
  }
}

// 🔹 Modifier une charge
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
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Impossible de modifier la charge" }, { status: 500 });
  }
}

// 🔹 Supprimer une charge
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const id = Number(idParam);
    await prisma.charge.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Impossible de supprimer la charge" }, { status: 500 });
  }
}
