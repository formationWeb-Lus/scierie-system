/*
  Warnings:

  - A unique constraint covering the columns `[numeroFacture]` on the table `Facture` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Facture" ADD COLUMN     "clientAdresse" TEXT,
ADD COLUMN     "entrepriseAdresse" TEXT NOT NULL DEFAULT 'Avenue Industrielle, Kinshasa, RDC',
ADD COLUMN     "entrepriseEmail" TEXT DEFAULT 'contact@scierieducongo.com',
ADD COLUMN     "entrepriseNIF" TEXT DEFAULT 'NIF A123456789',
ADD COLUMN     "entrepriseNom" TEXT NOT NULL DEFAULT 'Scierie du Congo SARL',
ADD COLUMN     "entrepriseTelephone" TEXT NOT NULL DEFAULT '+243 999 999 999',
ADD COLUMN     "modePaiement" TEXT NOT NULL DEFAULT 'Espèces',
ADD COLUMN     "numeroFacture" TEXT NOT NULL DEFAULT 'FAC-INIT',
ADD COLUMN     "statut" TEXT NOT NULL DEFAULT 'Payée';

-- CreateIndex
CREATE UNIQUE INDEX "Facture_numeroFacture_key" ON "Facture"("numeroFacture");
