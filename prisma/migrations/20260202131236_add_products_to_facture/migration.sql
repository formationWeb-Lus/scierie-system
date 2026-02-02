/*
  Warnings:

  - You are about to drop the column `price` on the `Facture` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Facture` table. All the data in the column will be lost.
  - You are about to drop the column `typeDeProduit` on the `Facture` table. All the data in the column will be lost.
  - Added the required column `products` to the `Facture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Facture" DROP COLUMN "price",
DROP COLUMN "quantity",
DROP COLUMN "typeDeProduit",
ADD COLUMN     "products" JSONB NOT NULL,
ALTER COLUMN "entrepriseAdresse" SET DEFAULT 'Avenue Salama, Kplwezi, RDC',
ALTER COLUMN "entrepriseTelephone" SET DEFAULT '+243 972 235 288';

-- CreateTable
CREATE TABLE "Benefice" (
    "id" SERIAL NOT NULL,
    "totalProduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCharges" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalDepenses" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "beneficeNet" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Benefice_pkey" PRIMARY KEY ("id")
);
