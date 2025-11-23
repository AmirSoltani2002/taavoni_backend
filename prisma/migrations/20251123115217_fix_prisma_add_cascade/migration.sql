-- DropForeignKey
ALTER TABLE "public"."block" DROP CONSTRAINT "block_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."invoice" DROP CONSTRAINT "invoice_subProjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."invoice" DROP CONSTRAINT "invoice_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."otherChat" DROP CONSTRAINT "otherChat_senderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."otherChat" DROP CONSTRAINT "otherChat_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "public"."otherTicket" DROP CONSTRAINT "otherTicket_recieverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."otherTicket" DROP CONSTRAINT "otherTicket_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."post" DROP CONSTRAINT "post_subProjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."projectDoc" DROP CONSTRAINT "projectDoc_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."subProject" DROP CONSTRAINT "subProject_blockId_fkey";

-- DropForeignKey
ALTER TABLE "public"."subProjectChat" DROP CONSTRAINT "subProjectChat_senderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."subProjectChat" DROP CONSTRAINT "subProjectChat_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "public"."subProjectDoc" DROP CONSTRAINT "subProjectDoc_subProjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."subProjectTicket" DROP CONSTRAINT "subProjectTicket_subProjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."subProjectTicket" DROP CONSTRAINT "subProjectTicket_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."transaction" DROP CONSTRAINT "transaction_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."transaction" DROP CONSTRAINT "transaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."transactionHistory" DROP CONSTRAINT "transactionHistory_subProjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."transactionHistory" DROP CONSTRAINT "transactionHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."userDoc" DROP CONSTRAINT "userDoc_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."userDoc" ADD CONSTRAINT "userDoc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."userinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."projectDoc" ADD CONSTRAINT "projectDoc_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subProjectDoc" ADD CONSTRAINT "subProjectDoc_subProjectId_fkey" FOREIGN KEY ("subProjectId") REFERENCES "public"."subProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."block" ADD CONSTRAINT "block_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subProject" ADD CONSTRAINT "subProject_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "public"."block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactionHistory" ADD CONSTRAINT "transactionHistory_subProjectId_fkey" FOREIGN KEY ("subProjectId") REFERENCES "public"."subProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactionHistory" ADD CONSTRAINT "transactionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."userinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transaction" ADD CONSTRAINT "transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."userinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transaction" ADD CONSTRAINT "transaction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice" ADD CONSTRAINT "invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."userinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice" ADD CONSTRAINT "invoice_subProjectId_fkey" FOREIGN KEY ("subProjectId") REFERENCES "public"."subProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post" ADD CONSTRAINT "post_subProjectId_fkey" FOREIGN KEY ("subProjectId") REFERENCES "public"."subProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subProjectTicket" ADD CONSTRAINT "subProjectTicket_subProjectId_fkey" FOREIGN KEY ("subProjectId") REFERENCES "public"."subProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subProjectTicket" ADD CONSTRAINT "subProjectTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."userinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subProjectChat" ADD CONSTRAINT "subProjectChat_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."subProjectTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subProjectChat" ADD CONSTRAINT "subProjectChat_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."userinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."otherChat" ADD CONSTRAINT "otherChat_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."otherTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."otherChat" ADD CONSTRAINT "otherChat_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."userinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."otherTicket" ADD CONSTRAINT "otherTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."userinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."otherTicket" ADD CONSTRAINT "otherTicket_recieverId_fkey" FOREIGN KEY ("recieverId") REFERENCES "public"."userinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
