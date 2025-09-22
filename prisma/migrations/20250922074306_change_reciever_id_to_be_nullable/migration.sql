-- DropForeignKey
ALTER TABLE "public"."otherTicket" DROP CONSTRAINT "otherTicket_recieverId_fkey";

-- AlterTable
ALTER TABLE "public"."otherTicket" ADD COLUMN     "closed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recieverRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "senderRead" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "recieverId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."subProjectTicket" ADD COLUMN     "adminRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "closed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "senderRead" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "public"."otherTicket" ADD CONSTRAINT "otherTicket_recieverId_fkey" FOREIGN KEY ("recieverId") REFERENCES "public"."userinfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
