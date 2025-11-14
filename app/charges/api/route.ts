import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// 🔹 Récupérer toutes les charges
export async function GET() {
  const charges = await prisma.charge.findMany({
    orderBy: { date: "desc" },
  });
  return NextResponse.json(charges);
}

// 🔹 Ajouter une nouvelle charge
export async function POST(req: Request) {
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
}