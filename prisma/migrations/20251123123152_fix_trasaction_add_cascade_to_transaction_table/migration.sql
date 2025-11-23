-- DropForeignKey
ALTER TABLE "public"."transaction" DROP CONSTRAINT "transaction_projectId_fkey";

-- AddForeignKey
ALTER TABLE "public"."transaction" ADD CONSTRAINT "transaction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
