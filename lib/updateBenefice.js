import { prisma } from "@/lib/prisma";

export async function updateBenefice() {
  // Sommes totales
  const totalProduction = await prisma.production.aggregate({
    _sum: { total: true },
  });

  const totalCharges = await prisma.charge.aggregate({
    _sum: { prix: true },
  });

  const totalDepenses = await prisma.depense.aggregate({
    _sum: { montant: true },
  });

  const beneficeNet =
    (totalProduction._sum.total || 0) -
    (totalCharges._sum.prix || 0) -
    (totalDepenses._sum.montant || 0);

  // Mettre à jour ou créer la ligne unique dans Benefice
  let benefice = await prisma.benefice.findFirst();

  if (!benefice) {
    await prisma.benefice.create({
      data: {
        totalProduction: totalProduction._sum.total || 0,
        totalCharges: totalCharges._sum.prix || 0,
        totalDepenses: totalDepenses._sum.montant || 0,
        beneficeNet,
      },
    });
  } else {
    await prisma.benefice.update({
      where: { id: benefice.id },
      data: {
        totalProduction: totalProduction._sum.total || 0,
        totalCharges: totalCharges._sum.prix || 0,
        totalDepenses: totalDepenses._sum.montant || 0,
        beneficeNet,
      },
    });
  }

  return beneficeNet;
}
