/*
  Warnings:

  - Changed the type of `quantity` on the `Vente` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Vente" ADD COLUMN     "unite" TEXT,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "quantity",
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL;
