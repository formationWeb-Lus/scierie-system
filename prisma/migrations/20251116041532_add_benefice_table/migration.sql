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
