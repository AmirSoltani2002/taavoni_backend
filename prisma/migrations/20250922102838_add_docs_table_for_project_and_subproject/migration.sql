-- CreateTable
CREATE TABLE "public"."projectDoc" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "documet" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projectDoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subProjectDoc" (
    "id" SERIAL NOT NULL,
    "subProjectId" INTEGER NOT NULL,
    "documet" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subProjectDoc_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."projectDoc" ADD CONSTRAINT "projectDoc_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subProjectDoc" ADD CONSTRAINT "subProjectDoc_subProjectId_fkey" FOREIGN KEY ("subProjectId") REFERENCES "public"."subProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
