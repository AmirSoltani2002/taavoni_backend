/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `userinfo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "userinfo_email_key" ON "public"."userinfo"("email");
