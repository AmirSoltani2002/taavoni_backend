-- CreateEnum
CREATE TYPE "public"."ISARGARYTYPE" AS ENUM ('none', 'martyrFamily', 'janbaz', 'azade', 'isargar');

-- CreateEnum
CREATE TYPE "public"."MARTYRRELATION" AS ENUM ('child', 'brother', 'parent', 'spouse');

-- CreateEnum
CREATE TYPE "public"."ISARGARRELATION" AS ENUM ('self', 'spouse', 'child');

-- CreateEnum
CREATE TYPE "public"."FRONTPRESENCETYPE" AS ENUM ('voluntary', 'mandatory');

-- Replace the unused legacy fields without recreating userinfo or deleting users.
ALTER TABLE "public"."userinfo"
ADD COLUMN "isargaryType" "public"."ISARGARYTYPE" NOT NULL DEFAULT 'none',
ADD COLUMN "martyrRelation" "public"."MARTYRRELATION",
ADD COLUMN "isargarRelation" "public"."ISARGARRELATION",
ADD COLUMN "janbaziPercent" INTEGER,
ADD COLUMN "captivityMonths" INTEGER,
ADD COLUMN "frontPresenceType" "public"."FRONTPRESENCETYPE",
ADD COLUMN "frontPresenceMonths" INTEGER,
DROP COLUMN "isargaryPercent",
DROP COLUMN "azadeEsaratMonths",
DROP COLUMN "azadeMonths",
DROP COLUMN "shahedFamilyNumber",
DROP COLUMN "shahedRelation";

-- DropEnum
DROP TYPE "public"."ISARGARIPERCENT";

-- DropEnum
DROP TYPE "public"."SHAHEDRELATION";

-- Keep numeric values and type-specific details internally consistent even
-- when writes do not originate from the application.
ALTER TABLE "public"."userinfo"
ADD CONSTRAINT "userinfo_janbazi_percent_check"
CHECK (
  "janbaziPercent" IS NULL
  OR (
    "janbaziPercent" BETWEEN 5 AND 80
    AND MOD("janbaziPercent", 5) = 0
  )
),
ADD CONSTRAINT "userinfo_captivity_months_check"
CHECK ("captivityMonths" IS NULL OR "captivityMonths" > 0),
ADD CONSTRAINT "userinfo_front_presence_months_check"
CHECK ("frontPresenceMonths" IS NULL OR "frontPresenceMonths" > 0),
ADD CONSTRAINT "userinfo_isargary_details_check"
CHECK (
  (
    "isargaryType" = 'none'
    AND "martyrRelation" IS NULL
    AND "isargarRelation" IS NULL
    AND "janbaziPercent" IS NULL
    AND "captivityMonths" IS NULL
    AND "frontPresenceType" IS NULL
    AND "frontPresenceMonths" IS NULL
  )
  OR (
    "isargaryType" = 'martyrFamily'
    AND "martyrRelation" IS NOT NULL
    AND "isargarRelation" IS NULL
    AND "janbaziPercent" IS NULL
    AND "captivityMonths" IS NULL
    AND "frontPresenceType" IS NULL
    AND "frontPresenceMonths" IS NULL
  )
  OR (
    "isargaryType" = 'janbaz'
    AND "martyrRelation" IS NULL
    AND "isargarRelation" IS NOT NULL
    AND "janbaziPercent" IS NOT NULL
    AND "captivityMonths" IS NULL
    AND "frontPresenceType" IS NULL
    AND "frontPresenceMonths" IS NULL
  )
  OR (
    "isargaryType" = 'azade'
    AND "martyrRelation" IS NULL
    AND "isargarRelation" IS NOT NULL
    AND "janbaziPercent" IS NULL
    AND "captivityMonths" IS NOT NULL
    AND "frontPresenceType" IS NULL
    AND "frontPresenceMonths" IS NULL
  )
  OR (
    "isargaryType" = 'isargar'
    AND "martyrRelation" IS NULL
    AND "isargarRelation" IS NOT NULL
    AND "janbaziPercent" IS NULL
    AND "captivityMonths" IS NULL
    AND "frontPresenceType" IS NOT NULL
    AND "frontPresenceMonths" IS NOT NULL
  )
);
