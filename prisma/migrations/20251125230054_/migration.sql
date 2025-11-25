/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "transaction_number_key" ON "public"."transaction"("number");
