-- CreateTable
CREATE TABLE "public"."transaction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "subProjectId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "bank" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invoice" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "subProjectId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "bank" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."transaction" ADD CONSTRAINT "transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."userinfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transaction" ADD CONSTRAINT "transaction_subProjectId_fkey" FOREIGN KEY ("subProjectId") REFERENCES "public"."subProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice" ADD CONSTRAINT "invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."userinfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice" ADD CONSTRAINT "invoice_subProjectId_fkey" FOREIGN KEY ("subProjectId") REFERENCES "public"."subProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
