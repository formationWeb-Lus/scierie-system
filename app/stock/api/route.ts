import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔹 GET : liste du stock
export async function GET() {
  try {
    const stock = await prisma.stock.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(stock);
  } catch (error) {
    console.error("Erreur GET /stock/api :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// 🔹 POST : ajouter un élément de stock
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.type || !data.quantity || !data.unitPrice) {
      return NextResponse.json(
        { error: "Champs manquants" },
        { status: 400 }
      );
    }

    const total = parseFloat(data.quantity) * parseFloat(data.unitPrice);

    // Vérifier si le type existe déjà
    const existing = await prisma.stock.findFirst({
      where: { type: data.type },
    });

    let result;
    if (existing) {
      // Mise à jour du stock existant
      result = await prisma.stock.update({
        where: { id: existing.id },
        data: {
          quantity: parseFloat(data.quantity),
          unitPrice: parseFloat(data.unitPrice),
          total,
          date: new Date(),
        },
      });
    } else {
      // Création d’un nouveau stock
      result = await prisma.stock.create({
        data: {
          type: data.type,
          quantity: parseFloat(data.quantity),
          unitPrice: parseFloat(data.unitPrice),
          total,
          date: new Date(),
        },
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur POST /stock/api :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// 🔹 PUT : modifier un élément existant
export async function PUT(req: Request) {
  try {
    const data = await req.json();

    if (!data.id || !data.type || !data.quantity || !data.unitPrice) {
      return NextResponse.json(
        { error: "Champs manquants" },
        { status: 400 }
      );
    }

    const total = parseFloat(data.quantity) * parseFloat(data.unitPrice);

    const updated = await prisma.stock.update({
      where: { id: data.id },
      data: {
        type: data.type,
        quantity: parseFloat(data.quantity),
        unitPrice: parseFloat(data.unitPrice),
        total,
        date: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur PUT /stock/api :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// 🔹 DELETE : supprimer un élément
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const deleted = await prisma.stock.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("Erreur DELETE /stock/api :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

