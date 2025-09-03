/*
  Warnings:

  - You are about to drop the `userInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."userInfo";

-- CreateTable
CREATE TABLE "public"."userinfo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "sex" "public"."SEX" NOT NULL,
    "birthDay" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "homePhone" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "workPhone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nationalNumber" TEXT NOT NULL,
    "type" "public"."TYPE" NOT NULL,
    "isargaryPercent" "public"."ISARGARIPERCENT",
    "azadeEsaratMonths" INTEGER,
    "azadeMonths" INTEGER,
    "shahedFamilyNumber" INTEGER,
    "shahedRelation" "public"."SHAHEDRELATION",

    CONSTRAINT "userinfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userinfo_nationalNumber_key" ON "public"."userinfo"("nationalNumber");
