/*
  Warnings:

  - Added the required column `password` to the `userinfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."userinfo" ADD COLUMN     "password" TEXT NOT NULL;
