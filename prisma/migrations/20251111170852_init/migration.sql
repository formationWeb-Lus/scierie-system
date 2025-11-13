/*
  Warnings:

  - You are about to drop the column `name` on the `Charge` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Charge` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Charge` table. All the data in the column will be lost.
  - Added the required column `date` to the `Charge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fournisseur` to the `Charge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `poids` to the `Charge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prix` to the `Charge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantite` to the `Charge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Charge" DROP COLUMN "name",
DROP COLUMN "price",
DROP COLUMN "quantity",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fournisseur" TEXT NOT NULL,
ADD COLUMN     "poids" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "prix" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantite" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Depense" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "categorie" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Depense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facture" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "client" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Production" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "typeBois" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Production_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vente" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);
