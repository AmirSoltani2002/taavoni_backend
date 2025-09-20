-- CreateEnum
CREATE TYPE "public"."subProjectTicketType" AS ENUM ('buy', 'sell');

-- AlterTable
ALTER TABLE "public"."userinfo" ADD COLUMN     "accepted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."post" (
    "id" SERIAL NOT NULL,
    "subProjectId" INTEGER NOT NULL,
    "detail" TEXT,
    "available" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subProjectTicket" (
    "id" SERIAL NOT NULL,
    "subProjectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "public"."subProjectTicketType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subProjectTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subProjectChat" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subProjectChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."otherChat" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otherChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."otherTicket" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "recieverId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otherTicket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."post" ADD CONSTRAINT "post_subProjectId_fkey" FOREIGN KEY ("subProjectId") REFERENCES "public"."subProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subProjectTicket" ADD CONSTRAINT "subProjectTicket_subProjectId_fkey" FOREIGN KEY ("subProjectId") REFERENCES "public"."subProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subProjectTicket" ADD CONSTRAINT "subProjectTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."userinfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subProjectChat" ADD CONSTRAINT "subProjectChat_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."subProjectTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subProjectChat" ADD CONSTRAINT "subProjectChat_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."userinfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."otherChat" ADD CONSTRAINT "otherChat_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."otherTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."otherChat" ADD CONSTRAINT "otherChat_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."userinfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."otherTicket" ADD CONSTRAINT "otherTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."userinfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."otherTicket" ADD CONSTRAINT "otherTicket_recieverId_fkey" FOREIGN KEY ("recieverId") REFERENCES "public"."userinfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
