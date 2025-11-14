import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";


// 🔹 GET — récupérer toutes les productions
export async function GET() {
  const productions = await prisma.production.findMany({
    orderBy: { date: "desc" },
  });
  return NextResponse.json(productions);
}

// 🔹 POST — créer une nouvelle production
export async function POST(req: Request) {
  const data = await req.json();

  const newProduction = await prisma.production.create({
    data: {
      typeBois: data.typeBois,
      quantity: parseFloat(data.quantity),
      unitPrice: parseFloat(data.unitPrice),
      total: parseFloat(data.quantity) * parseFloat(data.unitPrice),
      date: new Date(),
    },
  });

  return NextResponse.json(newProduction);
}
