import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

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

// 🔹 POST : enregistrer une vente + réduire le stock
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.type || !data.quantity || !data.unitPrice) {
      return NextResponse.json(
        { error: "Champs manquants" },
        { status: 400 }
      );
    }

    // ✅ Créer la vente
    const vente = await prisma.vente.create({
      data: {
        type: data.type,
        quantity: parseFloat(data.quantity),
        unitPrice: parseFloat(data.unitPrice),
        total: parseFloat(data.quantity) * parseFloat(data.unitPrice),
        unite: data.unite || null,
        date: new Date(),
      },
    });

    // 🪵 Mise à jour du stock
    const stock = await prisma.stock.findFirst({
      where: { type: data.type },
    });

    if (stock) {
      const newQuantity = stock.quantity - parseFloat(data.quantity);
      await prisma.stock.update({
        where: { id: stock.id },
        data: {
          quantity: newQuantity < 0 ? 0 : newQuantity,
          total:
            (newQuantity < 0 ? 0 : newQuantity) * stock.unitPrice,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "✅ Vente enregistrée et stock mis à jour.",
      vente,
    });
  } catch (error) {
    console.error("❌ Erreur POST /sales/api :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
