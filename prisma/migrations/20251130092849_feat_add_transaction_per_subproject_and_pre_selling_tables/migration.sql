/*
  Warnings:

  - You are about to drop the column `isConfirmed` on the `transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."project" ADD COLUMN     "pricePerMeter" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."subProject" ADD COLUMN     "pricePerMeter" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."transaction" DROP COLUMN "isConfirmed";

-- CreateTable
CREATE TABLE "public"."preSelling" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "area" INTEGER NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "preSelling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."finalTransaction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "subProjectId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "bank" TEXT NOT NULL,
    "targetBank" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "document" TEXT,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finalTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "finalTransaction_number_key" ON "public"."finalTransaction"("number");

-- AddForeignKey
ALTER TABLE "public"."preSelling" ADD CONSTRAINT "preSelling_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."userinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."preSelling" ADD CONSTRAINT "preSelling_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."finalTransaction" ADD CONSTRAINT "finalTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."userinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."finalTransaction" ADD CONSTRAINT "finalTransaction_subProjectId_fkey" FOREIGN KEY ("subProjectId") REFERENCES "public"."subProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
