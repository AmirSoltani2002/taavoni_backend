/*
  Warnings:

  - You are about to drop the column `nationalCard` on the `userinfo` table. All the data in the column will be lost.
  - Added the required column `blockNumber` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buildingArea` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floorCount` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landArea` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitCount` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `block` to the `subProject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomCount` to the `subProject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."project" ADD COLUMN     "blockNumber" INTEGER NOT NULL,
ADD COLUMN     "buildingArea" INTEGER NOT NULL,
ADD COLUMN     "floorCount" INTEGER NOT NULL,
ADD COLUMN     "landArea" INTEGER NOT NULL,
ADD COLUMN     "unitCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."subProject" ADD COLUMN     "block" INTEGER NOT NULL,
ADD COLUMN     "options" TEXT,
ADD COLUMN     "roomCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."userinfo" DROP COLUMN "nationalCard";

-- CreateTable
CREATE TABLE "public"."userDoc" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "documet" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userDoc_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."userDoc" ADD CONSTRAINT "userDoc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."userinfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
