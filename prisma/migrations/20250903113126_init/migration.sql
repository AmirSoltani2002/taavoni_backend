-- CreateEnum
CREATE TYPE "public"."SEX" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "public"."TYPE" AS ENUM ('admin', 'tehranUni', 'otherUni', 'free', 'employee');

-- CreateEnum
CREATE TYPE "public"."SHAHEDRELATION" AS ENUM ('azade_wife', 'azade_child', 'jan_wife', 'jan_child');

-- CreateEnum
CREATE TYPE "public"."ISARGARIPERCENT" AS ENUM ('val10_15', 'val15_20', 'val20_plus');

-- CreateTable
CREATE TABLE "public"."User" (
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

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nationalNumber_key" ON "public"."User"("nationalNumber");
