import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateBenefice } from "@/lib/updateBenefice";

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

// 📤 Créer une dépense
export async function POST(req: Request) {
  try {
    const data = await req.json();

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

    // 🟢 Mise à jour automatique du bénéfice
    await updateBenefice();

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error: any) {
    console.error("Erreur POST /expenses/api :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 📝 Modifier une dépense
export async function PUT(req: Request) {
  try {
    const data = await req.json();

    if (!data.id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const updatedExpense = await prisma.depense.update({
      where: { id: Number(data.id) },
      data: {
        date: new Date(data.date),
        categorie: data.categorie,
        montant: parseFloat(data.montant),
      },
    });

    // 🟢 Recalculer le bénéfice
    await updateBenefice();

    return NextResponse.json(updatedExpense);
  } catch (error: any) {
    console.error("Erreur PUT /expenses/api :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ❌ Supprimer une dépense
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const deletedExpense = await prisma.depense.delete({
      where: { id: Number(idParam) },
    });

    // 🟢 Recalcul du bénéfice après suppression
    await updateBenefice();

    return NextResponse.json({ success: true, deletedExpense });
  } catch (error: any) {
    console.error("Erreur DELETE /expenses/api :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
