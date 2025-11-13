import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

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
  }
}

// 🔹 POST : ajouter / mettre à jour un élément de stock
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
  }
}


