import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";


// 📤 Créer une dépense
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validation des données entrantes
    if (!data.date || !data.categorie || !data.montant) {
      return NextResponse.json(
        { error: "Champs manquants : date, catégorie ou montant." },
        { status: 400 }
      );
    }

    const newExpense = await prisma.depense.create({
      data: {
        date: new Date(data.date),
        categorie: data.categorie,
        montant: parseFloat(data.montant),
      },
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error: any) {
    console.error("Erreur POST /expenses/api :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 📥 Obtenir toutes les dépenses
export async function GET() {
  try {
    const expenses = await prisma.depense.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(expenses);
  } catch (error: any) {
    console.error("Erreur GET /expenses/api :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
