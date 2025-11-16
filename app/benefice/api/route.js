import { NextResponse } from "next/server";
import { updateBenefice } from "@/lib/updateBenefice";

export async function GET() {
  try {
    const beneficeNet = await updateBenefice(); // recalcul automatique
    return NextResponse.json({ benefice: beneficeNet });
  } catch (error) {
    console.error("Erreur GET /benefice/api :", error);
    return NextResponse.json({ error: "Impossible de récupérer le bénéfice" }, { status: 500 });
  }
}
