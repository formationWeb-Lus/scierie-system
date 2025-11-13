/*
  Warnings:

  - You are about to drop the column `client` on the `Facture` table. All the data in the column will be lost.
  - Added the required column `clientNom` to the `Facture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientTelephone` to the `Facture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeDeProduit` to the `Facture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Facture" DROP COLUMN "client",
ADD COLUMN     "clientNom" TEXT NOT NULL,
ADD COLUMN     "clientTelephone" TEXT NOT NULL,
ADD COLUMN     "typeDeProduit" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
