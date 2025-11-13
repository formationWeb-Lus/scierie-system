import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [stocks, ventes, productions, depenses, charges] = await Promise.all([
      prisma.stock.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.vente.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.production.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.depense.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.charge.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

    const totalStock = stocks.reduce((acc, s) => acc + s.total, 0);
    const totalVentes = ventes.reduce((acc, v) => acc + v.total, 0);
    const totalDepenses = depenses.reduce((acc, d) => acc + d.montant, 0);
    const totalCharges = charges.reduce((acc, c) => acc + c.prix, 0);

    return NextResponse.json({
      stocks,
      ventes,
      productions,
      depenses,
      charges,
      resume: {
        totalStock,
        totalVentes,
        totalDepenses,
        totalCharges,
      },
    });
  } catch (error) {
    console.error("Erreur API Dashboard:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
