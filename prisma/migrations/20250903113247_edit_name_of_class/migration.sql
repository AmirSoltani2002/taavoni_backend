/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."UserInfo" (
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

    CONSTRAINT "UserInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_nationalNumber_key" ON "public"."UserInfo"("nationalNumber");
