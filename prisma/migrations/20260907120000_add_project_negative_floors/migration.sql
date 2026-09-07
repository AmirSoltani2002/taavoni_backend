-- AlterTable
ALTER TABLE "public"."block"
ADD COLUMN "negativeFloorCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."negativeFloor" (
  "id" SERIAL NOT NULL,
  "floorNumber" INTEGER NOT NULL,
  "parkingCount" INTEGER NOT NULL DEFAULT 0,
  "storageCount" INTEGER NOT NULL DEFAULT 0,
  "description" TEXT,
  "blockId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "negativeFloor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "negativeFloor_blockId_floorNumber_key"
ON "public"."negativeFloor"("blockId", "floorNumber");

-- AddForeignKey
ALTER TABLE "public"."negativeFloor"
ADD CONSTRAINT "negativeFloor_blockId_fkey"
FOREIGN KEY ("blockId") REFERENCES "public"."block"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddCheckConstraints
ALTER TABLE "public"."block"
ADD CONSTRAINT "block_negative_floor_count_check"
CHECK ("negativeFloorCount" >= 0);

ALTER TABLE "public"."negativeFloor"
ADD CONSTRAINT "negative_floor_number_check" CHECK ("floorNumber" > 0),
ADD CONSTRAINT "negative_floor_parking_count_check" CHECK ("parkingCount" >= 0),
ADD CONSTRAINT "negative_floor_storage_count_check" CHECK ("storageCount" >= 0);
