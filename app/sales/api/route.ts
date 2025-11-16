import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

// 🔹 GET : récupérer toutes les ventes
export async function GET() {
  try {
    const ventes = await prisma.vente.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(ventes);
  } catch (error) {
    console.error("❌ Erreur GET /sales/api :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// 🔹 POST : créer une nouvelle vente
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const quantity = parseFloat(data.quantity);
    const unitPrice = parseFloat(data.unitPrice);

    if (!data.type || isNaN(quantity) || isNaN(unitPrice) || quantity <= 0 || unitPrice <= 0) {
      return NextResponse.json({ error: "Données invalides ou champs manquants" }, { status: 400 });
    }

    // Créer la vente
    const vente = await prisma.vente.create({
      data: {
        type: data.type,
        quantity,
        unitPrice,
        total: quantity * unitPrice,
        unite: data.unite || null,
        date: new Date(),
      },
    });

    // Mise à jour du stock
    const stock = await prisma.stock.findFirst({ where: { type: data.type } });
    if (stock) {
      const newQuantity = stock.quantity - quantity;
      await prisma.stock.update({
        where: { id: stock.id },
        data: {
          quantity: newQuantity < 0 ? 0 : newQuantity,
          total: (newQuantity < 0 ? 0 : newQuantity) * stock.unitPrice,
        },
      });
    }

    return NextResponse.json({ success: true, message: "Vente enregistrée et stock mis à jour.", vente });
  } catch (error) {
    console.error("❌ Erreur POST /sales/api :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// 🔹 PUT : modifier une vente
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const quantity = parseFloat(data.quantity);
    const unitPrice = parseFloat(data.unitPrice);

    if (!data.id || !data.type || isNaN(quantity) || isNaN(unitPrice) || quantity <= 0 || unitPrice <= 0) {
      return NextResponse.json({ error: "Données invalides pour modification" }, { status: 400 });
    }

    const updatedVente = await prisma.vente.update({
      where: { id: data.id },
      data: {
        type: data.type,
        quantity,
        unitPrice,
        total: quantity * unitPrice,
        unite: data.unite || null,
        date: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: "Vente modifiée.", updatedVente });
  } catch (error) {
    console.error("❌ Erreur PUT /sales/api :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// 🔹 DELETE : supprimer une vente
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json({ error: "ID manquant pour suppression" }, { status: 400 });
    }

    const id = parseInt(idParam);
    await prisma.vente.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Vente supprimée." });
  } catch (error) {
    console.error("❌ Erreur DELETE /sales/api :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
